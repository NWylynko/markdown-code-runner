// import * as core from '@actions/core';
import * as github from "@actions/github";
import run from "./index"

const runAction = () => {
  // get the name of the repo this action is running in
  const fullRepo = github.context.payload.repository.full_name

  const repo = fullRepo.split("/")[1];

  // only want to run the code in the repo this is being run on
  const repoDir = `/home/runner/work/${repo}/${repo}`;

  // all the markdown files in the repoDir
  const folders = `${repoDir}/**/*.md`;

  run(folders)
}

export default runAction