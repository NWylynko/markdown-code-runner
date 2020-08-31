const { spawn } = require("child_process")
// const runAction = require("./dist/githubAction")

const installDependenciesRunner = spawn("yarn")

// installDependenciesRunner.stdout.on("data", (data) => {
//   data = data.toString()
//   console.log(data)
// })

// installDependenciesRunner.stderr.on("data", (data) => {
//   data = data.toString()
//   console.log(data)
// })

installDependenciesRunner.on("close", (code) => {
  if (code === 0 || code === null ) {
    console.log("installed dependencies")
    runAction()
  } else {
    console.log("failed to install dependencies")
  }
})

const runAction = () => {
  const runner = spawn("node", ["./dist/githubAction"])
  runner.stdout.on("data", process.write.stdout)
  runner.stderr.on("data", process.write.stderr)
  runner.close("data", process.exit)
}