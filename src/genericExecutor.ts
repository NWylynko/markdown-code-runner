import { promises as fs } from "fs";
import languages from "./languages.json";
import { spawn } from "child_process";

const genericExecutor = async (MDLanguage: string, code: string): Promise<string> => {
  // gets the runtime for the code from the language thats defined in the markdown file
  const runner = languages[MDLanguage.toLowerCase()];

  // create a random number to use as a filename for the file to be saved to /tmp and ran from
  const randomFileName = Math.floor(Math.random() * 100000000);

  const fileLocation = `/tmp/${randomFileName}`;

  // write the file so it can be ran
  await fs.writeFile(fileLocation, code);

  return new Promise((resolve) => {
    // run the process using the runtime and the file of code
    const ls = spawn(runner, [fileLocation]);

    // start the output with ``` for markdown and 'markdown-code-runner output' so it can be found later to be written over if the code is changed
    let output = "\n``` markdown-code-runner output\n";

    // take the output from the process and add it to the output string
    ls.stdout.on("data", (data) => {
      output += data;
    });

    // same for errors, if the process errors it will still be written to the markdown so consumers of whatever thing this github action is being used on will know if the example code is broken
    ls.stderr.on("data", (data) => {
      output += data;
    });

    // wait for the process to exit, either successfully or with an error code
    ls.on("close", (code) => {
      // exit code 0 means the process didn't error
      if (code === 0) {
        console.log(" ", fileLocation, "finished successfully");
      } else {
        console.warn(" ", fileLocation, "failed with error code", code);
      }

      // add ``` and a newline to the end of the output for the markdown
      output += "```\n";

      // remove the temp file
      fs.unlink(fileLocation);

      // resolve (aka return) the results so it can be added to the markdown file
      resolve(output);
    });
  });
};

export default genericExecutor