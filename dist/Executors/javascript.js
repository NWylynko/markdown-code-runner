"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const child_process_1 = require("child_process");
const npm_1 = require("../utils/npm");
const JavascriptExecutor = async (code, options) => {
    // create a random number to use as a filename for the file to be saved to /tmp and ran from
    const randomFileName = Math.floor(Math.random() * 100000000);
    const TempFolderDir = `/tmp/${randomFileName}`;
    const TempCodeFile = TempFolderDir + "/index.js";
    // create the folder and write the file so it can be ran
    await fs_1.promises.mkdir(TempFolderDir);
    await fs_1.promises.writeFile(TempCodeFile, code);
    await npm_1.createPackageJson(TempFolderDir);
    if (options === null || options === void 0 ? void 0 : options.dependencies) {
        await npm_1.installDependencies(options.dependencies, TempFolderDir);
    }
    return new Promise((resolve) => {
        // run the process using the runtime and the file of code
        const JSChildProcess = child_process_1.spawn("node", [TempCodeFile], {
            cwd: TempFolderDir,
        });
        // start the output with ``` for markdown and 'markdown-code-runner output' so it can be found later to be written over if the code is changed
        let output = "\n``` markdown-code-runner output\n";
        // take the output from the process and add it to the output string
        JSChildProcess.stdout.on("data", (data) => {
            output += data;
        });
        // same for errors, if the process errors it will still be written to the markdown so consumers of whatever thing this github action is being used on will know if the example code is broken
        JSChildProcess.stderr.on("data", (data) => {
            output += data;
        });
        // wait for the process to exit, either successfully or with an error code
        JSChildProcess.on("close", (code) => {
            // exit code 0 means the process didn't error
            if (code === 0) {
                console.log(" ✔️", TempFolderDir, "finished successfully");
            }
            else {
                console.warn(" ❌", TempFolderDir, "failed with error code", code);
            }
            // add ``` and a newline to the end of the output for the markdown
            output += "```\n";
            // remove the temp file
            fs_1.promises.rmdir(TempFolderDir, { recursive: true });
            // resolve (aka return) the results so it can be added to the markdown file
            resolve(output);
        });
    });
};
exports.default = JavascriptExecutor;
