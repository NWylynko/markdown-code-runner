import { promises as fs } from "fs";
import { spawn } from "child_process";
import { createPackageJson, installDependencies, installDependency, addScript } from "../utils/npm"

interface ExecutorOptions {
  dependencies: string[];
}

const TypescriptExecutor = async (
  code: string,
  options: ExecutorOptions
): Promise<string> => {
  // create a random number to use as a filename for the file to be saved to /tmp and ran from
  const randomFileName = Math.floor(Math.random() * 100000000);

  const TempFolderDir = `/tmp/${randomFileName}`;
  const TempCodeFile = TempFolderDir + "/index.ts";

  // create the folder and write the file so it can be ran
  await fs.mkdir(TempFolderDir);
  await fs.writeFile(TempCodeFile, code);

  await createPackageJson(TempFolderDir);
  await addScript({ start: "ts-node index.ts"}, TempFolderDir)
  await installDependency("ts-node", TempFolderDir)
  await installDependency("typescript", TempFolderDir)
  if (options?.dependencies) {
    await installDependencies(options.dependencies, TempFolderDir);
  }

  return new Promise((resolve) => {
    // run the process using the runtime and the file of code
    const TSChildProcess = spawn("npm", ["start"], {
      cwd: TempFolderDir,
    });

    // start the output with ``` for markdown and 'markdown-code-runner output' so it can be found later to be written over if the code is changed
    let output = "\n``` markdown-code-runner output\n";

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
      // exit code 0 means the process didn't error
      if (code === 0) {
        console.log(" ✔️", TempFolderDir, "finished successfully");
      } else {
        console.warn(" ❌", TempFolderDir, "failed with error code", code);
      }

      // add ``` and a newline to the end of the output for the markdown
      output += "```\n";

      // remove the temp file
      fs.rmdir(TempFolderDir, { recursive: true });

      // resolve (aka return) the results so it can be added to the markdown file
      resolve(output);
    });
  });
};

export default TypescriptExecutor;
