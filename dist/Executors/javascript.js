"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const child_process_1 = require("child_process");
const npm_1 = __importDefault(require("../utils/npm"));
const JavascriptExecutor = async (code, options) => {
    // create a random number to use as a filename for the file to be saved to /tmp and ran from
    const randomFileName = Math.floor(Math.random() * 100000000);
    const TempFolderDir = `/tmp/${randomFileName}`;
    const TempCodeFile = TempFolderDir + "/index.js";
    // create the folder and write the file so it can be ran
    await fs_1.promises.mkdir(TempFolderDir);
    await fs_1.promises.writeFile(TempCodeFile, code);
    const npm = new npm_1.default(TempFolderDir);
    await npm.createPackageJson();
    if (options === null || options === void 0 ? void 0 : options.dependencies) {
        await npm.installDependencies(options.dependencies);
    }
    return new Promise((resolve) => {
        // run the process using the runtime and the file of code
        const JSChildProcess = child_process_1.spawn("node", [TempCodeFile], {
            cwd: TempFolderDir,
        });
        let output = '';
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
            // remove the temp file
            fs_1.promises.rmdir(TempFolderDir, { recursive: true });
            // resolve (aka return) the results so it can be added to the markdown file
            resolve({ output, exitCode: code, Temp: TempFolderDir });
        });
    });
};
exports.default = JavascriptExecutor;
