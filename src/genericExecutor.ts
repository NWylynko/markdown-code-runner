import { promises as fs } from "fs";
import languages from "./languages.json";
import runner from "./utils/runner"
import { execute } from "./index"

const genericExecutor = async (MDLanguage: string, code: string): Promise<execute> => {
  // gets the runtime for the code from the language thats defined in the markdown file
  const runTime: string = languages[MDLanguage.toLowerCase()];

  // create a random number to use as a filename for the file to be saved to /tmp and ran from
  const randomFileName = Math.floor(Math.random() * 100000000);

  const fileLocation = `/tmp/${randomFileName}`;

  // write the file so it can be ran
  await fs.writeFile(fileLocation, code);

  return new Promise(async(resolve) => {

    let exitCode: number;
    let output: string = '';

    try {
      // run the process using the runtime and the file of code
      output = await runner(runTime, [fileLocation]);
      exitCode = 0
    } catch (error) {
      exitCode = 1
    }

    // remove the temp file
    await fs.unlink(fileLocation);

    resolve({ output, exitCode, Temp: fileLocation });
  });
};

export default genericExecutor