const { spawn } = require("child_process")

const base = "/home/runner/work/"

const test = spawn("ls", [base])
const test2 = spawn("ls", [base + "_actions"])
const test3 = spawn("ls", [base + "_actions/actions"])
const test4 = spawn("ls", [base + "_actions/nwylynko"])
const test5 = spawn("ls", [base + "_actions/nwylynko/markdown-code-runner"])

test.stdout.on("data", data => console.log(data.toString()))
test2.stdout.on("data", data => console.log(data.toString()))
test3.stdout.on("data", data => console.log(data.toString()))
test4.stdout.on("data", data => console.log(data.toString()))
test5.stdout.on("data", data => console.log(data.toString()))

// const cwd = "/home/runner/work/markdown-code-runner/markdown-code-runner/"

// const installDependenciesRunner = spawn("yarn", [], { cwd })

// installDependenciesRunner.stdout.on("data", (data) => {
//   data = data.toString()
//   console.log(data)
// })

// installDependenciesRunner.stderr.on("data", (data) => {
//   data = data.toString()
//   console.log(data)
// })

// installDependenciesRunner.on("close", async (code) => {
//   if (code === 0 || code === null ) {
//     console.log("installed dependencies")
//     const exitCode = await runAction()
//     process.exit(exitCode)
//   } else {
//     console.log("failed to install dependencies")
//     process.exit(code)
//   }
// })

// const runAction = () => {
//   return new Promise((resolve, reject) => {
//     const runner = spawn("node", ["./dist/githubAction.js"], { cwd })
//     runner.stdout.on("data", data => process.stdout.write(data))
//     runner.stderr.on("data", data => process.stderr.write(data))
//     runner.on("close", code => { 
//       if (code === 0 || code === null) {
//         resolve(code)
//       } else {
//         reject(code)
//       } 
//     })
//   })
// }
