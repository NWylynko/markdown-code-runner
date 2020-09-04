import genericExecutor from "./genericExecutor";
import JavascriptExecutor from "./javascript";
import TypescriptExecutor from "./typescript";
import JSXExecutor from "./jsx";
import PythonExecutor from "./python"

export const Executors = {
  "js": JavascriptExecutor,
  "javascript": JavascriptExecutor,
  "ts": TypescriptExecutor,
  "typescript": TypescriptExecutor,
  "jsx": JSXExecutor,
  "bash": genericExecutor("bash"),
  "sh": genericExecutor("sh"),
  "shell": genericExecutor("sh"),
  "py": PythonExecutor(""),
  "python": PythonExecutor(""),
  "py3": PythonExecutor("3"),
  "python3": PythonExecutor("3")
}