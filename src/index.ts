import { promises as fs } from "fs";
import util from "util";
import glob from "glob";
// import * as core from '@actions/core';
import * as github from '@actions/github';
import languages from "./languages.json";
import genericExecutor from "./genericExecutor";

// console.log(core)
console.log(github.context.payload.repository.full_name)
process.exit();

const supportedLanguages = Object.keys(languages);

// convert callback functions to async friendly functions
const globAsync = util.promisify(glob);

async function run() {
  const folders = "/home/runner/work/**/*.md";
  // const folders = __dirname + "/../*.md";

  //get the markdown files
  const files = await globAsync(folders);

  if (files.length === 0) {
    console.error("no markdown files found :(");
    process.exit(1);
  }

  // loop over each file found
  files.forEach(async (path) => {
    console.log("opening", path);

    // read in the markdown file
    const markdownFile = await fs.readFile(path, "utf8");

    const splitter = new RegExp(/\n[`]{3}[ ]/); // '\n``` '

    // split the file by '\n``` ' to 'find' the code
    let parts = markdownFile.split(splitter);
    parts.shift();

    const outputs = await Promise.all(
      parts.map(async (part) => {
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

        // run it through the generic executor to get the output
        const output = await genericExecutor(MDLanguage, code)

        return {output, markdownCode: "\n``` " + codeWithLanguage + "\n```\n"}
      })
    );

    // copy the markdown to a new markdown file so it can be edited
    let newMarkdownFile = markdownFile;

    await Promise.all(
      outputs.map(async ({ remove, markdownCode, output }: output) => {
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

    console.log("written", path, ":)");
  });
}

interface output {
  output?: string;
  remove?: boolean;
  markdownCode?: string;
}

run();
