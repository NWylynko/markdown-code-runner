import TypescriptExecutor from "./typescript";

test('simple console.log', async () => {
  const code = 'console.log("hello js")'
  const { output, exitCode } = await TypescriptExecutor({ code })
  expect(output).toBe('hello js\n');
  expect(exitCode).toBe(0);
}, 60000);

test('multiline', async () => {
  const code = `
    const first: string = "Nick"
    const last: string = "Wylynko"
    const fullName: string = first + " " + last
    console.log(fullName)
  `
  const { output, exitCode } = await TypescriptExecutor({ code })

  expect(output).toBe('Nick Wylynko\n');
  expect(exitCode).toBe(0);
}, 60000);

test('dependency', async () => {
  const code = `
    const { chain } = require('mathjs')
    const num = chain(3)
                  .add(4)
                  .multiply(2)
                  .done()
    console.log(num)
  `

  const options = {
    dependencies: [
      "mathjs",
      "@types/mathjs"
    ]
  }

  const { output, exitCode } = await TypescriptExecutor({ code, options })
  
  expect(output).toBe('14\n');
  expect(exitCode).toBe(0);
}, 60000);