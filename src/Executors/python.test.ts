import PythonExecutor from "./python";

test('simple print', async () => {
  const code = 'print("hello python")'
  const { output, exitCode } = await PythonExecutor("3")({ code })
  expect(output).toBe('hello python\n');
  expect(exitCode).toBe(0);
});

test('multiline', async () => {
  const code = `
first = "Nick"
last = "Wylynko"
fullName = first + " " + last
print(fullName)
  `
  const { output, exitCode } = await PythonExecutor("3")({ code })

  expect(output).toBe('Nick Wylynko\n');
  expect(exitCode).toBe(0);
});

// test('dependency', async () => {
//   const code = `

//   `

//   const options = {
//     dependencies: [
//       ""
//     ]
//   }

//   const { output, exitCode } = await PythonExecutor("3")({ code, options })
  
//   expect(output).toBe('\n');
//   expect(exitCode).toBe(0);
// }, 20000);