import run from "./index"

// all the markdown files in the repoDir
const folders = `${__dirname}/../examples/*.md`;

run(folders)