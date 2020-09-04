import { promises as fs } from "fs";
import { spawn } from "child_process";
import { executeInput, executeOutput } from "../types";
import runner from "../utils/runner";

const PythonExecutor = (version: string) => async ({
  code,
  options,
}: executeInput): Promise<executeOutput> => {
  // create a random number to use as a filename for the file to be saved to /tmp and ran from
  const randomFileName = Math.floor(Math.random() * 100000000);

  const TempFolderDir = `/tmp/${randomFileName}`;
  const TempCodeFile = TempFolderDir + "/app.py";

  // create the folder and write the file so it can be ran
  await fs.mkdir(TempFolderDir);
  await fs.writeFile(TempCodeFile, code);

  if (options?.dependencies) {
    await Promise.all(
      options.dependencies.map((dependency) =>
        runner(`python${version}`, ["-m", "pip", "install", dependency])
      )
    );
  }

  return new Promise(async (resolve) => {
    let output: string;
    let exitCode: number = 0;

    try {
      output = await runner(`python${version}`, [TempCodeFile], {
        cwd: TempFolderDir,
      });
    } catch (error) {
      exitCode = 1;
    }

    // remove the temp file
    fs.rmdir(TempFolderDir, { recursive: true });

    // resolve (aka return) the results so it can be added to the markdown file
    resolve({ output, exitCode, Temp: TempFolderDir });
  });
};

export default PythonExecutor;
