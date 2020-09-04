import genericExecutor from "./genericExecutor";

test('shell', async () => {
  const code = 'echo hello shell'
  const { output, exitCode } = await genericExecutor("sh")({ code })
  expect(output).toBe('hello shell\n');
  expect(exitCode).toBe(0);
});

test('bash', async () => {
  const code = 'echo hello bash'
  const { output, exitCode } = await genericExecutor("bash")({ code })
  expect(output).toBe('hello bash\n');
  expect(exitCode).toBe(0);
});