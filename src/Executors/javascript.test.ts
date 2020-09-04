import JavascriptExecutor from "./javascript";

test('simple console.log', async () => {
  const code = 'console.log("hello js")'
  const { output, exitCode } = await JavascriptExecutor({ code })
  expect(output).toBe('hello js\n');
  expect(exitCode).toBe(0);
});

test('multiline', async () => {
  const code = `
    const first = "Nick"
    const last = "Wylynko"
    const fullName = first + " " + last
    console.log(fullName)
  `
  const { output, exitCode } = await JavascriptExecutor({ code })

  expect(output).toBe('Nick Wylynko\n');
  expect(exitCode).toBe(0);
});

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
      "mathjs"
    ]
  }

  const { output, exitCode } = await JavascriptExecutor({ code, options })
  
  expect(output).toBe('14\n');
  expect(exitCode).toBe(0);
}, 20000);