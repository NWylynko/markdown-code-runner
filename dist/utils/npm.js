"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const fs_1 = require("fs");
class NPM {
    constructor(folder) {
        this.createPackageJson = () => {
            return new Promise((resolve, reject) => {
                const childProcess = child_process_1.spawn("npm", ["init", "-y"], { cwd: this.folder });
                childProcess.on("close", (code) => {
                    if (code === 0) {
                        resolve(`successfully initialized package.json`);
                    }
                    else {
                        reject(`failed to initialize package.json`);
                    }
                });
            });
        };
        this.installDependency = (dependency) => {
            return new Promise((resolve, reject) => {
                const childProcess = child_process_1.spawn("npm", ["i", dependency], { cwd: this.folder });
                childProcess.on("close", (code) => {
                    if (code === 0) {
                        resolve(`successfully installed ${dependency}`);
                    }
                    else {
                        reject(`failed to install ${dependency}`);
                    }
                });
            });
        };
        this.installDependencies = (dependencies) => {
            return new Promise((resolve, reject) => {
                const childProcess = child_process_1.spawn("npm", ["i", ...dependencies], { cwd: this.folder });
                childProcess.on("close", (code) => {
                    if (code === 0) {
                        resolve(`successfully installed ${dependencies}`);
                    }
                    else {
                        reject(`failed to install ${dependencies}`);
                    }
                });
            });
        };
        this.addScript = async (scripts) => {
            const json = JSON.parse(await fs_1.promises.readFile(this.folder + "/package.json", "utf8"));
            Object.keys(scripts).map((scriptName) => {
                json.scripts[scriptName] = scripts[scriptName];
            });
            await fs_1.promises.writeFile(this.folder + '/package.json', JSON.stringify(json));
        };
        this.folder = folder;
    }
}
exports.default = NPM;
