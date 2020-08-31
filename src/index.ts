import { promises as fs } from "fs";
import util from "util";
import glob from "glob";
import languages from "./languages.json";
import genericExecutor from "./genericExecutor";
import JavascriptExecutor from "./Executors/javascript";
import TypescriptExecutor from "./Executors/typescript";
import JSXExecutor from "./Executors/jsx";

// get al the languages supported by genericExecutor
const supportedLanguages = Object.keys(languages);

// convert callback functions to async friendly functions
const globAsync = util.promisify(glob);

export default async function run(folders: string) {
  //get the markdown files
  const filesUnFiltered = await globAsync(folders);

  const files = filesUnFiltered.filter(file => !file.includes("node_modules"))

  if (files.length === 0) {
    console.error("no markdown files found :(");
    process.exit(1);
  }

  // loop over each file found
  files.forEach(async (path) => {
    console.log("opening", shortenDir(path, folders));

    // read in the markdown file
    const markdownFile = await fs.readFile(path, "utf8");

    const splitter = new RegExp(/\n[`]{3}[ ]/); // '\n``` '

    // split the file by '\n``` ' to 'find' the code
    let parts = markdownFile.split(splitter);
    parts.shift();

    const outputs = await Promise.all(
      parts.map(async (part, index) => {
        const { options, optionsMarkdown } = getCodeOptions(part);

        // remove the rest of the string after the closing ```
        const codeWithLanguage = part.split("\n```\n")[0];

        // split it by the new line so it can get the language from the first line
        let codeLineArray = codeWithLanguage.split("\n");

        // gets the language and removes it from the above array so when its joined it doesn't have it
        const MDLanguage = codeLineArray.shift();

        // if the language is markdown-code-runner output its been put there by this code so it needs to be marked for removal so it can be updated
        if (MDLanguage === "markdown-code-runner output") {
          console.log("  found stale output, removing it...");
          return {
            remove: true,
            markdownCode: "\n``` " + codeWithLanguage + "\n```\n",
          };
        }
        // or if its not found in the array of supported languages then just skip over it
        else if (!supportedLanguages.includes(MDLanguage)) {
          console.warn("  not supported language");
          return;
        }

        // join the array (without the language part at the start now) back together to be executed
        const code = codeLineArray.join("\n");

        const markdownCode =
          "\n``` " + codeWithLanguage + "\n```\n" + optionsMarkdown;
        try {
          if (MDLanguage === "javascript" || MDLanguage === "js") {
            return {
              output: await JavascriptExecutor(code, options),
              markdownCode,
            };
          } else if (MDLanguage === "typescript" || MDLanguage === "ts") {
            return {
              output: await TypescriptExecutor(code, options),
              markdownCode,
            };
          } else if (MDLanguage === "jsx") {
            return {
              output: await JSXExecutor(code, index, path, options),
              markdownCode
              
            };
          } else {
            // run it through the generic executor to get the output
            const output = await genericExecutor(MDLanguage, code);

            return {
              output,
              markdownCode,
            };
          }
        } catch (error) {
          console.error(' ❌', error);
          return { error: true }
        }
      })
    );

    // copy the markdown to a new markdown file so it can be edited
    let newMarkdownFile = markdownFile;
    newMarkdownFile = removeStaleImages(newMarkdownFile)

    await Promise.all(
      outputs.map(async ({ remove, markdownCode, output, error }: output) => {
        
        // an error occurred with the executor, skip it
        if (error) {
          return;
        }
        // if a chuck of code has 'markdown-code-runner output' it will be marked for removal because it will be replaced with an updated version
        if (remove) {
          // the old output gets removed
          // replace it with '' (aka nothing)
          newMarkdownFile = newMarkdownFile.replace(markdownCode, "");

          // its possible output is undefined, if the language defined isn't supported for example
        } else if (output) {
          // use the markdownCode to position the output bellow it
          // add the code and output together so its all nice and snug on the markdown
          const newMarkdown = markdownCode + output;

          // replace it in the string that will be put into the .md file
          newMarkdownFile = newMarkdownFile.replace(markdownCode, newMarkdown);
        }
      })
    );

    // write the new markdown file out :)
    fs.writeFile(path, newMarkdownFile);

    console.log("written", shortenDir(path, folders), ":)");
  });

  console.log("written all files")
}

const shortenDir = (fileOrDir: string, baseDir: string): string =>
  fileOrDir.replace(baseDir, "");

const getCodeOptions = (part: string) => {
  // 'finds' and gets anything after '<!-- markdown-code-runner\n'
  const markdownOptions = part.split("<!-- markdown-code-runner\n");

  // if the length is 2 it means the options have been defined
  if (markdownOptions.length === 2) {
    // then gets everything before the closing -->
    const optionsString = markdownOptions[1].split("\n-->")[0];

    // use built in JSON.parse function to parse the json
    const options: ExecutorOptions = JSON.parse(optionsString);

    return {
      options,
      optionsMarkdown: `\n<!-- markdown-code-runner\n${optionsString}\n-->\n`,
    };
  }
  return { optionsMarkdown: "" };
};

const removeStaleImages = (markdown: string) => {
  const open = '\n<!-- markdown-code-runner image-start -->\n'
  const close = '\n<!-- markdown-code-runner image-end -->\n'
  const parts = markdown.split(open)
  if (parts.length > 1) {
    parts.shift()
    parts.forEach(part => {
      const oldOutput = part.split(close)[0]
      markdown = markdown.replace(open + oldOutput + close, '')
    })
  }
  return markdown
}

interface output {
  output?: string;
  remove?: boolean;
  markdownCode?: string;
  error?: boolean;
}


export interface ExecutorOptions {
  dependencies: string[];
}
