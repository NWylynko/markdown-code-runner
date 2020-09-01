import { promises as fs } from "fs";
import { spawn } from "child_process";
import puppeteer from "puppeteer";
import {
  createPackageJson,
  installDependencies,
  installDependency,
  addScript,
} from "../utils/npm";
import { ExecutorOptions } from "../index";

const JSXExecutor = async (
  code: string,
  index: number,
  path: string,
  options?: ExecutorOptions
): Promise<string> => {

  // create a random number to use as a filename for the file to be saved to /tmp and ran from
  const randomFileName = Math.floor(Math.random() * 100000000);

  const TempFolderDir = `/tmp/${randomFileName}`;
  const TempCodeFile = TempFolderDir + "/app.jsx";

  // create the folder and write the file so it can be ran
  await fs.mkdir(TempFolderDir);
  await fs.writeFile(TempCodeFile, code);

  await createPackageJson(TempFolderDir);
  await installDependencies(["react", "react-dom", "parcel-bundler", "express"], TempFolderDir);
  if (options?.dependencies) {
    await installDependencies(options.dependencies, TempFolderDir);
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

  await buildJSX(TempFolderDir)

  return new Promise((resolve, reject) => {
    // run the process using the runtime and the file of code
    const JSXChildProcess = spawn("node", ["express.js"], {
      cwd: TempFolderDir,
    });

    let port: string;
    let error: boolean = false;

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
      error = true;
    });

    // wait for the process to exit, either successfully or with an error code
    JSXChildProcess.on("exit", async (code, signal) => {
      // exit code 0 means the process didn't error
      if (code === 0 || code === null) {
        console.log(" ✔️", TempFolderDir, "finished successfully");
      } else {
        console.warn(" ❌", TempFolderDir, "failed with error code", code);
      }

      // add ``` and a newline to the end of the output for the markdown
      output += "\n<!-- markdown-code-runner image-end -->\n";

      // remove the temp folder
      await fs.rmdir(TempFolderDir, { recursive: true });

      if (error) {
        reject(output);
      } else {
        resolve(output);
      }
    });
  });
};

const buildJSX = (TempFolderDir: string): Promise<number> => {
  return new Promise( async (resolve, reject) => {
    await addScript({ build: "parcel build index.html" }, TempFolderDir);
    const build = spawn("npm", ['run', 'build'], {cwd: TempFolderDir})

    // build.stdout.on("data", data => console.log(data.toString()))
    // build.stderr.on("data", data => console.error(data.toString()))

    build.on("close", code => {
      if (code === 0 || code === null) {
        resolve(code)
      } else {
        reject(code)
      }
    })
  })

}

const captureWebPageScreenShot = async (port: string, TempFile: string) => {
  try {
    const browser = await puppeteer.launch();
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
  } catch (error) {
    throw new Error(`failed to screenshot, error: ${error}`)
  }
};

export default JSXExecutor;
