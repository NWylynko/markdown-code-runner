import { promises as fs } from "fs";
import { spawn } from "child_process";
import NPM from "../utils/npm";
import runner from "../utils/runner"
import captureWebPageScreenShot from "../utils/captureWebPage"
import { ExecutorOptions, execute } from "../index";

const JSXExecutor = async (
  code: string,
  index: number,
  path: string,
  options?: ExecutorOptions
): Promise<execute> => {

  // create a random number to use as a filename for the file to be saved to /tmp and ran from
  const randomFileName = Math.floor(Math.random() * 100000000);

  const TempFolderDir = `/tmp/${randomFileName}`;
  const TempCodeFile = TempFolderDir + "/app.jsx";

  // create the folder and write the file so it can be ran
  await fs.mkdir(TempFolderDir);
  await fs.writeFile(TempCodeFile, code);

  const npm = new NPM(TempFolderDir)

  await npm.createPackageJson();
  await npm.installDependencies(["react", "react-dom", "parcel-bundler", "express"]);
  if (options?.dependencies) {
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
  await fs.writeFile(TempFolderDir + "/index.html", html);

  const js = `
    import React from "react"
    import { render } from "react-dom"
    import App from "./app"
    
    render(<App />, document.getElementById("app"))
  `;
  await fs.writeFile(TempFolderDir + "/index.js", js);

  const expressApp = `
    const express = require('express');
    const app = express();
    app.use(express.static("dist"));
    const server = app.listen(0, () => console.log('localhost:' + server.address().port));
  `;
  await fs.writeFile(TempFolderDir + "/express.js", expressApp);

  return new Promise( async (resolve) => {

    let port: string;
    let exitCode: number;

    // start the output with <!-- --> so the image can be replaced later if needed
    let output = "\n<!-- markdown-code-runner image-start -->\n";

    await npm.addScript({ build: "parcel build index.html" });

    try {
      await runner("npm", ['run', 'build'], {cwd: TempFolderDir})
    } catch (error) {
      output += "\n```\n" + error + "\n```\n";
      exitCode = 1;
    }

    // run the process using the runtime and the file of code
    const JSXChildProcess = spawn("node", ["express.js"], {
      cwd: TempFolderDir,
    });

    // take the output from the process and add it to the output string
    JSXChildProcess.stdout.on("data", async (data) => {
      const dataString: string = data.toString();
      if (dataString.includes("localhost:")) {
        port = dataString.split("localhost:")[1].split(/[\n ]/)[0];

        try {
          const newPath = path.slice(0, -3) + "." + index + ".png";
          await captureWebPageScreenShot(`http://localhost:${port}/index.html`, newPath);
          output += `\n![rendered jsx](./${newPath.split("/").pop()})\n`;
        } catch (error) {
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
      // add ``` and a newline to the end of the output for the markdown
      output += "\n<!-- markdown-code-runner image-end -->\n";

      // remove the temp folder
      await fs.rmdir(TempFolderDir, { recursive: true });

      resolve({ output, exitCode, Temp: TempFolderDir });
    });
  });
};

export default JSXExecutor;
