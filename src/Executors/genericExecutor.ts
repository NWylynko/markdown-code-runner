import { promises as fs } from "fs";
import runner from "../utils/runner"
import { executeOutput, executeInput } from "../types"

const genericExecutor = (runTime: string) => {
  return async ({ code }: executeInput): Promise<executeOutput> => {  
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
        console.error(error)
        output = error
        exitCode = 1
      }
  
      // remove the temp file
      await fs.unlink(fileLocation);
  
      resolve({ output, exitCode, Temp: fileLocation });
    });
  };
}

export default genericExecutor