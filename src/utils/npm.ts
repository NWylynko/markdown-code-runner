import { spawn } from "child_process";
import { promises as fs } from "fs";

export default class NPM {
  folder: string;
  constructor(folder: string) {
    this.folder = folder
  }

  createPackageJson = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      const childProcess = spawn("npm", ["init", "-y"], { cwd: this.folder });
      childProcess.on("close", (code) => {
        if (code === 0) {
          resolve(`successfully initialized package.json`);
        } else {
          reject(`failed to initialize package.json`);
        }
      });
    });
  };

  installDependency = (dependency: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const childProcess = spawn("npm", ["i", dependency], { cwd: this.folder });
      childProcess.on("close", (code) => {
        if (code === 0) {
          resolve(`successfully installed ${dependency}`);
        } else {
          reject(`failed to install ${dependency}`);
        }
      });
    });
  };

  installDependencies = (
    dependencies: string[]
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const childProcess = spawn("npm", ["i", ...dependencies], { cwd: this.folder });
      childProcess.on("close", (code) => {
        if (code === 0) {
          resolve(`successfully installed ${dependencies}`);
        } else {
          reject(`failed to install ${dependencies}`);
        }
      });
    });
  };

  addScript = async (scripts: { [x: string]: string; }) => {
    const json = JSON.parse(
      await fs.readFile(this.folder + "/package.json", "utf8")
    );

    Object.keys(scripts).map((scriptName) => {
      json.scripts[scriptName] = scripts[scriptName];
    });
  
    await fs.writeFile(this.folder + '/package.json', JSON.stringify(json))
  };
}
