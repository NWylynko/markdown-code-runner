import run from "./index"

// all the markdown files in the repoDir
const folders = `${__dirname}/../**/*.md`;

run(folders)