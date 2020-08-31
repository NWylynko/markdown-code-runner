import { promises as fs } from "fs";
import { spawn } from "child_process";
import puppeteer from "puppeteer"
import {
  createPackageJson,
  installDependencies,
  installDependency,
  addScript,
} from "../utils/npm";
import {ExecutorOptions} from "../index"

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
  await addScript({ start: "parcel index.html" }, TempFolderDir);
  await installDependency("react", TempFolderDir);
  await installDependency("react-dom", TempFolderDir);
  await installDependency("parcel-bundler", TempFolderDir);
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
  const js = `
    import React from "react"
    import { render } from "react-dom"
    import App from "./app"
    
    render(<App />, document.getElementById("app"))
  `;
  await fs.writeFile(TempFolderDir + "/index.html", html);
  await fs.writeFile(TempFolderDir + "/index.js", js);

  return new Promise((resolve) => {
    // run the process using the runtime and the file of code
    const JSXChildProcess = spawn("npm", ["start"], {
      cwd: TempFolderDir,
    });

    let port: string;

    // start the output with <!-- --> so the image can be replaced later if needed
    let output = "\n<!-- markdown-code-runner image-start -->\n";

    // take the output from the process and add it to the output string
    JSXChildProcess.stdout.on("data", async (data) => {
      data = data.toString()
      if (data.includes("localhost")) {
        port = data.split("localhost:")[1].split(/[\n ]/)[0];
      }
      if (data.includes("Built")) {
        await captureWebPageScreenShot(port, TempFolderDir + '/output.png')
        const newPath = path.slice(0, -3) + '.' + index + '.png'
        await fs.rename(TempFolderDir + '/output.png', newPath)
        output += `\n![rendered jsx](./${newPath.split('/').pop()})\n`
        JSXChildProcess.kill("SIGTERM");
      }
    });

    // same for errors, if the process errors it will still be written to the markdown so consumers of whatever thing this github action is being used on will know if the example code is broken
    JSXChildProcess.stderr.on("data", (data) => {
      output += data.toString();
    });

    // wait for the process to exit, either successfully or with an error code
    JSXChildProcess.on("exit", (code) => {
      // exit code 0 means the process didn't error
      if (code === 0 || code === null) {
        console.log(" ✔️", TempFolderDir, "finished successfully");
      } else {
        console.warn(" ❌", TempFolderDir, "failed with error code", code);
      }

      // add ``` and a newline to the end of the output for the markdown
      output += "\n<!-- markdown-code-runner image-end -->\n";

      // remove the temp file
      fs.rmdir(TempFolderDir, { recursive: true });

      // resolve (aka return) the results so it can be added to the markdown file
      resolve(output);
    });
  });
};

const captureWebPageScreenShot = async (port: string, TempFile: string) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(`http://localhost:${port}`)

  const dimensions = await page.evaluate(() => {
    return {
      // plus 16 for the 8px margin from the body tag
      width: document.getElementById('app').offsetWidth + 16,
      height: document.getElementById('app').offsetHeight + 16
    }
  })

  await page.screenshot({
    path: TempFile,
    clip: { x: 0, y: 0, ...dimensions }
  })

  await browser.close()
}

export default JSXExecutor;
