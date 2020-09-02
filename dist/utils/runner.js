"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const runner = (command, args, options) => {
    return new Promise((resolve, reject) => {
        const child = child_process_1.spawn(command, args, options);
        let output;
        child.stdout.on("data", (data) => {
            output += data.toString();
        });
        child.stderr.on("data", (data) => {
            output += data.toString();
        });
        child.on("close", (code, signal) => {
            if (code === 0 || code === null) {
                resolve(output);
            }
            else {
                reject(output);
            }
        });
    });
};
exports.default = runner;
