"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const child_process_1 = require("child_process");
const npm_1 = __importDefault(require("../utils/npm"));
const runner_1 = __importDefault(require("../utils/runner"));
const TypescriptExecutor = async (code, options) => {
    // create a random number to use as a filename for the file to be saved to /tmp and ran from
    const randomFileName = Math.floor(Math.random() * 100000000);
    const TempFolderDir = `/tmp/${randomFileName}`;
    const TempCodeFile = TempFolderDir + "/index.ts";
    // create the folder and write the file so it can be ran
    await fs_1.promises.mkdir(TempFolderDir);
    await fs_1.promises.writeFile(TempCodeFile, code);
    const npm = new npm_1.default(TempFolderDir);
    await npm.createPackageJson();
    await npm.installDependencies(["ts-node", "typescript"]);
    if (options === null || options === void 0 ? void 0 : options.dependencies) {
        await npm.installDependencies(options.dependencies);
    }
    // build the typescript to javascript
    await npm.addScript({ build: "tsc index.ts" });
    await runner_1.default("npm", ["run", "build"], { cwd: TempFolderDir });
    return new Promise(async (resolve) => {
        // run the process using the runtime and the file of code
        await npm.addScript({ start: "node index.js" });
        const TSChildProcess = child_process_1.spawn("npm", ["start"], {
            cwd: TempFolderDir,
        });
        // start the output with ``` for markdown and 'markdown-code-runner output' so it can be found later to be written over if the code is changed
        let output;
        // take the output from the process and add it to the output string
        TSChildProcess.stdout.on("data", (data) => {
            output += data;
        });
        // same for errors, if the process errors it will still be written to the markdown so consumers of whatever thing this github action is being used on will know if the example code is broken
        TSChildProcess.stderr.on("data", (data) => {
            output += data;
        });
        // wait for the process to exit, either successfully or with an error code
        TSChildProcess.on("close", (code) => {
            // remove the temp file
            fs_1.promises.rmdir(TempFolderDir, { recursive: true });
            // resolve (aka return) the results so it can be added to the markdown file
            resolve({ output, exitCode: code, Temp: TempFolderDir });
        });
    });
};
exports.default = TypescriptExecutor;
