import { promises as fs } from "fs";
import util from "util";
import glob from "glob";
import languages from "./languages.json";
import { spawn } from "child_process"

const supportedLanguages = Object.keys(languages)

// convert callback functions to async friendly functions
const globAsync = util.promisify(glob);

async function run() {
    const folders = "/home/runner/work/**/*.md";
  // const folders = __dirname + "/../**/*.md";

  //get the markdown files
  const files = await globAsync(folders);

  // loop over each file found
  files.forEach(async (path) => {

    console.log('opening', path)
    process.stdout.write('   ')

    // read in the markdown file
    const markdownFile = await fs.readFile(path, "utf8");

    const splitter = new RegExp(/\n[`]{3}[ ]/) // '\n``` '

    // split the file by '\n``` ' to 'find' the code
    let parts = markdownFile.split(splitter)
    parts.shift()

    const outputs = await Promise.all(parts.map(async (part) => {
      const codeWithLanguage = part.split('\n```\n')[0]
      let codeLineArray = codeWithLanguage.split('\n')
      const MDlanguage = codeLineArray.shift()
      if (MDlanguage === 'markdown-code-runner output') {
        // console.log('  found stale output')
        process.stdout.write(' 👴🏻 ')
        return {remove: true, codeWithLanguage}
      } else if (!(supportedLanguages.includes(MDlanguage))) {
        // console.error('  not supported language')
        process.stdout.write(' 🙅‍♂️ ')
        return;
      }
      const code = codeLineArray.join('\n')
      const runner = languages[MDlanguage.toLowerCase()]
      const randomFileName = Math.floor(Math.random() * 100000000)

      const fileLocation = `/tmp/${randomFileName}`

      await fs.writeFile(fileLocation, code)

      return new Promise((resolve) => {
        const ls = spawn(runner, [fileLocation]);

        let output = '\n``` markdown-code-runner output\n'

        ls.stdout.on('data', (data) => {
          output += data
        });

        ls.stderr.on('data', (data) => {
          output += data
        });

        ls.on('close', (code) => {
          if (code === 0) {
            // console.log(' ', fileLocation, 'finished successfully')
            process.stdout.write(' ✔️ ')
          } else {
            // console.warn(' ', fileLocation, 'failed with error code', code)
            process.stdout.write(' ❌ ')
          }
          output += '```\n'
          resolve({ fileLocation, runner, output, codeLineArray, codeWithLanguage, part, MDlanguage })
        });
      })
    }))

    let newMarkdownFile = markdownFile

    await Promise.all(outputs.map(async (output: output) => {
      if (output?.remove) {
        const staleOutput = '\n``` ' + output.codeWithLanguage + '\n```\n'
        newMarkdownFile = newMarkdownFile.replace(staleOutput, '')
      } else if (output) {
        const markdownCode = '\n``` ' + output.codeWithLanguage + '\n```\n'
        const newMarkdown = markdownCode + output.output
        newMarkdownFile = newMarkdownFile.replace(markdownCode, newMarkdown)
      }

    }))

    fs.writeFile(path, newMarkdownFile)

    process.stdout.write('\n\n')

  })

}

interface output {
  fileLocation: string
  runner: string
  output: string
  codeLineArray: string[]
  codeWithLanguage: string
  part: string
  MDlanguage: string
  remove?: boolean
}

run()