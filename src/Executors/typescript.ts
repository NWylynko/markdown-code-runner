import { promises as fs } from "fs";
import { spawn } from "child_process";
import NPM from "../utils/npm"
import runner from "../utils/runner"
import { executeOutput, executeInput } from "../types"

const TypescriptExecutor = async (
  { code, options }: executeInput
): Promise<executeOutput> => {
  // create a random number to use as a filename for the file to be saved to /tmp and ran from
  const randomFileName = Math.floor(Math.random() * 100000000);

  const TempFolderDir = `/tmp/${randomFileName}`;
  const TempCodeFile = TempFolderDir + "/index.ts";

  // create the folder and write the file so it can be ran
  await fs.mkdir(TempFolderDir);
  await fs.writeFile(TempCodeFile, code);

  const npm = new NPM(TempFolderDir)

  await npm.createPackageJson();
  await npm.installDependencies(["typescript", "@types/node"])
  if (options?.dependencies) {
    await npm.installDependencies(options.dependencies);
  }

  // build the typescript to javascript
  await npm.addScript({ build: "tsc index.ts"})
  await runner("npm", ["run", "build"], { cwd: TempFolderDir })

  return new Promise(async (resolve) => {
    // run the process using the runtime and the file of code
    const TSChildProcess = spawn("node", ["index.js"], {
      cwd: TempFolderDir,
    });

    let output: string = '';

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
      fs.rmdir(TempFolderDir, { recursive: true });

      // resolve (aka return) the results so it can be added to the markdown file
      resolve({ output, exitCode: code, Temp: TempFolderDir });
    });
  });
};

export default TypescriptExecutor;
