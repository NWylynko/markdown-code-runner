"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const util_1 = __importDefault(require("util"));
const glob_1 = __importDefault(require("glob"));
const Executors_1 = require("./Executors");
// convert callback functions to async friendly functions
const globAsync = util_1.default.promisify(glob_1.default);
async function run(folders) {
    //get the markdown files
    const filesUnFiltered = await globAsync(folders);
    const files = filesUnFiltered.filter((file) => !file.includes("node_modules"));
    if (files.length === 0) {
        console.error("no markdown files found :(");
        return;
    }
    // loop over each file found
    files.forEach(async (path) => {
        console.log("opening", shortenDir(path));
        // read in the markdown file
        const markdownFile = await fs_1.promises.readFile(path, "utf8");
        // split the file by '\n``` ' to 'find' the code
        const parts = markdownFile.split("\n\n``` ");
        parts.shift();
        if (parts.length === 0) {
            console.error("no code found :(");
            return;
        }
        const outputs = await Promise.all(parts.map(async (part, index) => {
            // get any options that are attached at the bottom of the code, eg dependencies that need to be installed
            const { options, optionsMarkdown } = getCodeOptions(part);
            // gets everything inside the ``` ```, this includes the first line that defines the language
            const codeWithLanguage = part.split("\n```\n")[0];
            // this splits up the string of code by new line
            const codeLineArray = codeWithLanguage.split("\n");
            // this removes the first line and splits up into the language and potential attributes
            const MDLanguageWithAttributes = codeLineArray.shift().split(" ");
            // this gets the first item in the list which should be the language
            const MDLanguage = MDLanguageWithAttributes[0].toLowerCase();
            // join the array back into a string, now without the ``` [language] part so its executable
            const code = codeLineArray.join("\n");
            // this is used to append the output to the code
            const markdownCode = "\n\n``` " + codeWithLanguage + "\n```\n" + optionsMarkdown;
            // if one of the attributes is "markdown-code-runner" it was added by the last time it was run so it should be removed to be replaced
            if (MDLanguage.includes("markdown-code-runner")) {
                console.log("  found stale output, removing it...");
                return {
                    remove: true,
                    markdownCode,
                };
            }
            let execute = Executors_1.Executors[MDLanguage];
            if (!execute) {
                console.warn(`  ${MDLanguage} not supported language`);
                return { skip: true };
            }
            const { output, exitCode, Temp, image } = await execute({
                code,
                index,
                path,
                options,
            });
            if (exitCode === 0 || exitCode === null) {
                console.log(" ✔️", Temp, "finished successfully");
            }
            else {
                console.warn(" ❌", Temp, "failed with error code", exitCode);
            }
            if (image) {
                return {
                    output: "\n<!-- markdown-code-runner image-start -->\n" +
                        output +
                        "\n<!-- markdown-code-runner image-end -->\n",
                    markdownCode,
                };
            }
            return {
                output: "\n\n``` markdown-code-runner\n" + output + "\n```\n",
                markdownCode,
            };
        }));
        // copy the markdown to a new markdown file so it can be edited
        let newMarkdownFile = markdownFile;
        newMarkdownFile = removeStaleImages(newMarkdownFile);
        await Promise.all(outputs.map(async ({ remove, markdownCode, output, skip }) => {
            // if a chuck of code has 'markdown-code-runner output' it will be marked for removal because it will be replaced with an updated version
            if (skip) {
                return;
            }
            else if (remove) {
                // the old output gets removed
                // replace it with '' (aka nothing)
                newMarkdownFile = newMarkdownFile.replace(markdownCode, "");
                // its possible output is undefined, if the language defined isn't supported for example
            }
            else if (output) {
                // use the markdownCode to position the output bellow it
                // add the code and output together so its all nice and snug on the markdown
                const newMarkdown = markdownCode + output;
                // replace it in the string that will be put into the .md file
                newMarkdownFile = newMarkdownFile.replace(markdownCode, newMarkdown);
            }
        }));
        // write the new markdown file out :)
        await fs_1.promises.writeFile(path, newMarkdownFile);
        console.log("written", shortenDir(path), ":)");
    });
}
exports.default = run;
// TODO: figure out how to shorten consistently
const shortenDir = (fileOrDir) => fileOrDir;
const getCodeOptions = (part) => {
    const opener = "<!-- markdown-code-runner\n";
    const closer = "\n-->\n";
    // 'finds' and gets anything after '<!-- markdown-code-runner\n'
    const markdownOptions = part.split(opener);
    // if the length is 2 it means the options have been defined
    if (markdownOptions.length === 2) {
        // then gets everything before the closing -->
        const optionsString = markdownOptions[1].split(closer)[0];
        try {
            // use built in JSON.parse function to parse the json
            const options = JSON.parse(optionsString);
            return {
                options,
                optionsMarkdown: `${opener}${optionsString}${closer}`,
            };
        }
        catch (error) {
            console.error('failed to parse options');
            console.error(optionsString);
            throw new Error(error);
        }
    }
    return { optionsMarkdown: "" };
};
const removeStaleImages = (markdown) => {
    const open = "\n<!-- markdown-code-runner image-start -->\n";
    const close = "\n<!-- markdown-code-runner image-end -->\n";
    const parts = markdown.split(open);
    if (parts.length > 1) {
        parts.shift();
        parts.forEach((part) => {
            const oldOutput = part.split(close)[0];
            markdown = markdown.replace(open + oldOutput + close, "");
        });
    }
    return markdown;
};
