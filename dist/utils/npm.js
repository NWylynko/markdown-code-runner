"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addScript = exports.installDependencies = exports.installDependency = exports.createPackageJson = void 0;
const child_process_1 = require("child_process");
const fs_1 = require("fs");
exports.createPackageJson = (FolderDir) => {
    return new Promise((resolve, reject) => {
        const childProcess = child_process_1.spawn("npm", ["init", "-y"], { cwd: FolderDir });
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
exports.installDependency = (dependency, FolderDir) => {
    return new Promise((resolve, reject) => {
        const childProcess = child_process_1.spawn("npm", ["i", dependency], { cwd: FolderDir });
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
exports.installDependencies = (dependencies, FolderDir) => {
    return Promise.all(dependencies.map((dependency) => exports.installDependency(dependency, FolderDir)));
};
exports.addScript = async (scripts, FolderDir) => {
    const json = JSON.parse(await fs_1.promises.readFile(FolderDir + "/package.json", "utf8"));
    Object.keys(scripts).map((scriptName) => {
        json.scripts[scriptName] = scripts[scriptName];
    });
    await fs_1.promises.writeFile(FolderDir + '/package.json', JSON.stringify(json));
};
