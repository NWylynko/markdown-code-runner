import genericExecutor from "./genericExecutor";
import JavascriptExecutor from "./javascript";
import TypescriptExecutor from "./typescript";
import JSXExecutor from "./jsx";

export const Executors = {
  "js": JavascriptExecutor,
  "javascript": JavascriptExecutor,
  "ts": TypescriptExecutor,
  "typescript": TypescriptExecutor,
  "jsx": JSXExecutor,
  "bash": genericExecutor("bash"),
  "sh": genericExecutor("sh"),
  "shell": genericExecutor("sh"),
  "py": genericExecutor("python3"),
  "python": genericExecutor("python3")
}