import { spawn } from "child_process";
import { promises as fs } from "fs";

export const createPackageJson = (FolderDir: string) => {
  return new Promise((resolve, reject) => {
    const childProcess = spawn("npm", ["init", "-y"], { cwd: FolderDir });
    childProcess.on("close", (code) => {
      if (code === 0) {
        resolve(`successfully initialized package.json`);
      } else {
        reject(`failed to initialize package.json`);
      }
    });
  });
};

export const installDependency = (dependency: string, FolderDir: string) => {
  return new Promise((resolve, reject) => {
    const childProcess = spawn("npm", ["i", dependency], { cwd: FolderDir });
    childProcess.on("close", (code) => {
      if (code === 0) {
        resolve(`successfully installed ${dependency}`);
      } else {
        reject(`failed to install ${dependency}`);
      }
    });
  });
};

export const installDependencies = (
  dependencies: string[],
  FolderDir: string
) => {
  return Promise.all(
    dependencies.map((dependency) => installDependency(dependency, FolderDir))
  );
};

export const addScript = async (scripts: { [x: string]: string; }, FolderDir: string) => {
  const json = JSON.parse(
    await fs.readFile(FolderDir + "/package.json", "utf8")
  );
  Object.keys(scripts).map((scriptName) => {
    json.scripts[scriptName] = scripts[scriptName];
  });

  await fs.writeFile(FolderDir + '/package.json', JSON.stringify(json))
};
