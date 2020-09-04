"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const runner_1 = __importDefault(require("../utils/runner"));
const PythonExecutor = (version) => async ({ code, options, }) => {
    // create a random number to use as a filename for the file to be saved to /tmp and ran from
    const randomFileName = Math.floor(Math.random() * 100000000);
    const TempFolderDir = `/tmp/${randomFileName}`;
    const TempCodeFile = TempFolderDir + "/app.py";
    // create the folder and write the file so it can be ran
    await fs_1.promises.mkdir(TempFolderDir);
    await fs_1.promises.writeFile(TempCodeFile, code);
    if (options === null || options === void 0 ? void 0 : options.dependencies) {
        await Promise.all(options.dependencies.map((dependency) => runner_1.default(`python${version}`, ["-m", "pip", "install", dependency])));
    }
    return new Promise(async (resolve) => {
        let output;
        let exitCode = 0;
        try {
            output = await runner_1.default(`python${version}`, [TempCodeFile], {
                cwd: TempFolderDir,
            });
        }
        catch (error) {
            exitCode = 1;
        }
        // remove the temp file
        fs_1.promises.rmdir(TempFolderDir, { recursive: true });
        // resolve (aka return) the results so it can be added to the markdown file
        resolve({ output, exitCode, Temp: TempFolderDir });
    });
};
exports.default = PythonExecutor;
