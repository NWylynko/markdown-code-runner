"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const child_process_1 = require("child_process");
const puppeteer_1 = __importDefault(require("puppeteer"));
const npm_1 = require("../utils/npm");
const JSXExecutor = async (code, index, path, options) => {
    // create a random number to use as a filename for the file to be saved to /tmp and ran from
    const randomFileName = Math.floor(Math.random() * 100000000);
    const TempFolderDir = `/tmp/${randomFileName}`;
    const TempCodeFile = TempFolderDir + "/app.jsx";
    // create the folder and write the file so it can be ran
    await fs_1.promises.mkdir(TempFolderDir);
    await fs_1.promises.writeFile(TempCodeFile, code);
    await npm_1.createPackageJson(TempFolderDir);
    await npm_1.installDependencies(["react", "react-dom", "parcel-bundler", "express"], TempFolderDir);
    if (options === null || options === void 0 ? void 0 : options.dependencies) {
        await npm_1.installDependencies(options.dependencies, TempFolderDir);
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
    await buildJSX(TempFolderDir);
    return new Promise((resolve, reject) => {
        // run the process using the runtime and the file of code
        const JSXChildProcess = child_process_1.spawn("node", ["express.js"], {
            cwd: TempFolderDir,
        });
        let port;
        let error = false;
        // start the output with <!-- --> so the image can be replaced later if needed
        let output = "\n<!-- markdown-code-runner image-start -->\n";
        // take the output from the process and add it to the output string
        JSXChildProcess.stdout.on("data", async (data) => {
            data = data.toString();
            if (data.includes("localhost")) {
                port = data.split("localhost:")[1].split(/[\n ]/)[0];
                try {
                    const newPath = path.slice(0, -3) + "." + index + ".png";
                    await captureWebPageScreenShot(port, newPath);
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
            error = true;
        });
        // wait for the process to exit, either successfully or with an error code
        JSXChildProcess.on("exit", async (code, signal) => {
            // exit code 0 means the process didn't error
            if (code === 0 || code === null) {
                console.log(" ✔️", TempFolderDir, "finished successfully");
            }
            else {
                console.warn(" ❌", TempFolderDir, "failed with error code", code);
            }
            // add ``` and a newline to the end of the output for the markdown
            output += "\n<!-- markdown-code-runner image-end -->\n";
            // remove the temp folder
            await fs_1.promises.rmdir(TempFolderDir, { recursive: true });
            if (error) {
                reject(output);
            }
            else {
                resolve(output);
            }
        });
    });
};
const buildJSX = (TempFolderDir) => {
    return new Promise(async (resolve, reject) => {
        await npm_1.addScript({ build: "parcel build index.html" }, TempFolderDir);
        const build = child_process_1.spawn("npm", ['run', 'build'], { cwd: TempFolderDir });
        build.stdout.on("data", data => console.log(data.toString()));
        build.stderr.on("data", data => console.error(data.toString()));
        build.on("close", code => {
            if (code === 0 || code === null) {
                resolve(code);
            }
            else {
                reject(code);
            }
        });
    });
};
const captureWebPageScreenShot = async (port, TempFile) => {
    try {
        const browser = await puppeteer_1.default.launch();
        const page = await browser.newPage();
        await page.goto(`http://localhost:${port}/index.html`, { waitUntil: "networkidle0" });
        const dimensions = await page.evaluate(() => {
            return {
                // plus 16 for the 8px margin from the body tag
                width: document.getElementById("app").offsetWidth + 16,
                height: document.getElementById("app").offsetHeight + 16,
            };
        });
        await page.screenshot({
            path: TempFile,
            clip: { x: 0, y: 0, ...dimensions },
            omitBackground: true
        });
        await browser.close();
        return true;
    }
    catch (error) {
        throw new Error(`failed to screenshot, error: ${error}`);
    }
};
exports.default = JSXExecutor;
