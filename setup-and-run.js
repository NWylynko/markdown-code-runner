const { spawn } = require("child_process")

const cwd = "/home/runner/work/_actions/nwylynko/markdown-code-runner/master"

const installDependenciesRunner = spawn("yarn", [], { cwd })

// installDependenciesRunner.stdout.on("data", (data) => {
//   data = data.toString()
//   console.log(data)
// })

// installDependenciesRunner.stderr.on("data", (data) => {
//   data = data.toString()
//   console.log(data)
// })

installDependenciesRunner.on("close", async (code) => {
  if (code === 0 || code === null ) {
    console.log("installed dependencies")
    const exitCode = await runAction()
    process.exit(exitCode)
  } else {
    console.log("failed to install dependencies")
    process.exit(code)
  }
})

const runAction = () => {
  return new Promise((resolve, reject) => {
    const runner = spawn("node", ["./dist/githubAction.js"], { cwd })
//     runner.stdout.on("data", data => process.stdout.write(data))
//     runner.stderr.on("data", data => process.stderr.write(data))
    runner.on("close", code => { 
      if (code === 0 || code === null) {
        resolve(code)
      } else {
        reject(code)
      } 
    })
  })
}
