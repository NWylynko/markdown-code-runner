"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Executors = void 0;
const genericExecutor_1 = __importDefault(require("./genericExecutor"));
const javascript_1 = __importDefault(require("./javascript"));
const typescript_1 = __importDefault(require("./typescript"));
const jsx_1 = __importDefault(require("./jsx"));
const python_1 = __importDefault(require("./python"));
exports.Executors = {
    "js": javascript_1.default,
    "javascript": javascript_1.default,
    "ts": typescript_1.default,
    "typescript": typescript_1.default,
    "jsx": jsx_1.default,
    "bash": genericExecutor_1.default("bash"),
    "sh": genericExecutor_1.default("sh"),
    "shell": genericExecutor_1.default("sh"),
    "py": python_1.default(""),
    "python": python_1.default(""),
    "py3": python_1.default("3"),
    "python3": python_1.default("3")
};
