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
  "bash": genericExecutor,
  "sh": genericExecutor,
  "shell": genericExecutor
}