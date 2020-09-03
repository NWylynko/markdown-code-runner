"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const child_process_1 = require("child_process");
const npm_1 = __importDefault(require("../utils/npm"));
const runner_1 = __importDefault(require("../utils/runner"));
const captureWebPage_1 = __importDefault(require("../utils/captureWebPage"));
const JSXExecutor = async ({ code, index, path, options }) => {
    // create a random number to use as a filename for the file to be saved to /tmp and ran from
    const randomFileName = Math.floor(Math.random() * 100000000);
    const TempFolderDir = `/tmp/${randomFileName}`;
    const TempCodeFile = TempFolderDir + "/app.jsx";
    // create the folder and write the file so it can be ran
    await fs_1.promises.mkdir(TempFolderDir);
    await fs_1.promises.writeFile(TempCodeFile, code);
    const npm = new npm_1.default(TempFolderDir);
    await npm.createPackageJson();
    await npm.installDependencies(["react", "react-dom", "parcel-bundler", "express"]);
    if (options === null || options === void 0 ? void 0 : options.dependencies) {
        await npm.installDependencies(options.dependencies);
    }
    const html = `
    <style>
      body {
        width: fit-content;
        height: fit-content;
      }
    </style>
    <div id="app"></div>
    <script src="index.js"></script>
  `;
    await fs_1.promises.writeFile(TempFolderDir + "/index.html", html);
    const js = `
    import React from "react"
    import { render } from "react-dom"
    import App from "./app"
    
    render(<App />, document.getElementById("app"))
  `;
    await fs_1.promises.writeFile(TempFolderDir + "/index.js", js);
    const expressApp = `
    const express = require('express');
    const app = express();
    app.use(express.static("dist"));
    const server = app.listen(0, () => console.log('localhost:' + server.address().port));
  `;
    await fs_1.promises.writeFile(TempFolderDir + "/express.js", expressApp);
    return new Promise(async (resolve) => {
        let port;
        let exitCode = 0;
        // start the output with <!-- --> so the image can be replaced later if needed
        let output = '';
        await npm.addScript({ build: "parcel build index.html" });
        try {
            await runner_1.default("npm", ['run', 'build'], { cwd: TempFolderDir });
        }
        catch (error) {
            output += "\n```\n" + error + "\n```\n";
            exitCode = 1;
        }
        // run the process using the runtime and the file of code
        const JSXChildProcess = child_process_1.spawn("node", ["express.js"], {
            cwd: TempFolderDir,
        });
        // take the output from the process and add it to the output string
        JSXChildProcess.stdout.on("data", async (data) => {
            const dataString = data.toString();
            if (dataString.includes("localhost:")) {
                port = dataString.split("localhost:")[1].split(/[\n ]/)[0];
                try {
                    const newPath = path.slice(0, -3) + "." + index + ".png";
                    await captureWebPage_1.default(`http://localhost:${port}/index.html`, newPath);
                    output += `\n![rendered jsx](./${newPath.split("/").pop()})\n`;
                }
                catch (error) {
                    output += "\n```\n" + error + "\n```\n";
                }
                JSXChildProcess.kill("SIGKILL");
            }
        });
        // same for errors, if the process errors it will still be written to the markdown so consumers of whatever thing this github action is being used on will know if the example code is broken
        JSXChildProcess.stderr.on("data", (data) => {
            console.error(data.toString());
            output += data.toString();
        });
        // wait for the process to exit, either successfully or with an error code
        JSXChildProcess.on("exit", async (code, signal) => {
            // remove the temp folder
            await fs_1.promises.rmdir(TempFolderDir, { recursive: true });
            resolve({ output, exitCode, Temp: TempFolderDir, image: true });
        });
    });
};
exports.default = JSXExecutor;
