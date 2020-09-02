"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const languages_json_1 = __importDefault(require("./languages.json"));
const runner_1 = __importDefault(require("./utils/runner"));
const genericExecutor = async (MDLanguage, code) => {
    // gets the runtime for the code from the language thats defined in the markdown file
    const runTime = languages_json_1.default[MDLanguage.toLowerCase()];
    // create a random number to use as a filename for the file to be saved to /tmp and ran from
    const randomFileName = Math.floor(Math.random() * 100000000);
    const fileLocation = `/tmp/${randomFileName}`;
    // write the file so it can be ran
    await fs_1.promises.writeFile(fileLocation, code);
    return new Promise(async (resolve) => {
        let exitCode;
        let output;
        try {
            // run the process using the runtime and the file of code
            output = await runner_1.default(runTime, [fileLocation]);
            exitCode = 0;
        }
        catch (error) {
            exitCode = 1;
        }
        // remove the temp file
        await fs_1.promises.unlink(fileLocation);
        resolve({ output, exitCode, Temp: fileLocation });
    });
};
exports.default = genericExecutor;
