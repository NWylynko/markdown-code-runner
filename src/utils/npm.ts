import { spawn } from "child_process";

export const createPackageJson = (FolderDir: string) => {
  return new Promise((resolve, reject) => {
    const childProcess = spawn("npm", ["init", "-y"], { cwd: FolderDir })
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

export const installDependencies = (dependencies: string[], FolderDir: string) => {
  return Promise.all(
    dependencies.map((dependency) => installDependency(dependency, FolderDir))
  );
};