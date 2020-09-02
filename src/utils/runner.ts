import { spawn, SpawnOptionsWithoutStdio } from "child_process";

const runner = (command: string, args?: readonly string[], options?: SpawnOptionsWithoutStdio): Promise<string> => {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, options)

    let output: string;

    child.stdout.on("data", (data) => {
      output += data.toString()
    })

    child.stderr.on("data", (data) => {
      output += data.toString()
    })

    child.on("close", (code, signal) => {
      if (code === 0 || code === null) {
        resolve(output)
      } else {
        reject(output)
      }
    })
  })
}

export default runner