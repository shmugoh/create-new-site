const showdown = require('showdown');
const ejs = require('ejs');
const fs = require('fs');
const readline = require('readline');
const minify = require('html-minifier').minify;
const CleanCSS = require('clean-css');

let converter = new showdown.Converter();

// Reads a directory and returns available files
async function readDir(src = './markdown') {
    let files = [];

    return new Promise((resolve) => {
        setTimeout(function () {
            fs.readdir(src, (err, data) => {
                data.forEach((file) => {
                    files.push(file);
                });
                resolve(files);
            });
        }, 250);
    });
}

// Iterates through each file in '/markdown/' and
// generates a raw navigation bar string.
// The navigation bar includes the title obtained
// from the header of each Markdown file
async function processNavBar(src = './markdown') {
    const markdownFiles = await readDir(src);
    let buff = '';

    return new Promise(async (resolve) => {
        setTimeout(async function () {
            for (const file of markdownFiles) {
                if (file != file.match(/.*.md$/)) {
                    continue;
                }
                const readable = fs.createReadStream(`${src}/${file}`);
                const reader = readline.createInterface({ input: readable });
                let line;
                for await (const fileLine of reader) {
                    line = fileLine;
                    break;
                }
                readable.close();

                let fileRegEx = String(file).match(/([^\\]*)\.(\w+)$/);
                let fileName = fileRegEx[1];

                // Constructing a navigation link for the Markdown file
                buff += `<a href="./${fileName}.html"> ${
                    line.match(/#\W(.+)/)[1]
                }</a> |\n`;
            }
            resolve(buff);
        });
    });
}

// Creates a production environment
// by copying static files and minifying CSS
async function createProdEnv() {
    fs.mkdir('./prod', (err) => {
        if (err) {
            return console.error(err);
        }
    });
    let staticFiles = await readDir('./static');
    let cssFiles = await readDir('./css');

    staticFiles.forEach((file) => {
        if (file != String(file).match('.*.ejs$')) {
            fs.copyFile(`./static/${file}`, `./prod/${file}`, (err) => {
                if (err) {
                    return console.error();
                }
            });
        }
    });
    cssFiles.forEach((file) => {
        if (file == String(file).match('.*.css$')) {
            fs.readFile(`./css/${file}`, (err, data) => {
                if (err) {
                    console.error(err);
                }
                var output = new CleanCSS({
                    compatibility: 'ie8',
                    level: 2,
                    inline: false,
                    rebase: false,
                    keepBreaks: false,
                    aggressiveMerging: true,
                    processImport: false,
                    specialComments: 'none',
                }).minify(data);

                fs.writeFile(`./prod/${file}`, output['styles'], (err) => {
                    if (err) {
                        console.error(err);
                    }
                });
            });
        }
    });

    return 1;
}

// Parses Markdown to HTML and saves
// the result in the 'prod' directory
function parseMarkdown(src = './markdown/index.md', mode = 'template', navbar) {
    let fileRegEx = src.match(/\/.*\/([^\\]*)\.(\w+)$/);
    let fileName = fileRegEx[1];
    let fileFormat = fileRegEx[2];
    if (fileFormat != 'md') {
        console.error(
            `${fileName}.${fileFormat} in /markdown/ is not a .md file. Proceeding to skip.`
        );
        return;
    }

    fs.readFile(src, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        converter.setOption('tables', true);
        var markdownContent = converter.makeHtml(data);

        ejs.renderFile(
            `./static/${mode}.ejs`,
            { navbar: navbar, markdownContent: markdownContent },
            (err, str) => {
                str = minify(str, {
                    removeAttributeQuotes: true,
                    caseSensitive: true,
                    collapseWhitespace: true,
                    removeComments: true,
                    quoteCharacter: `'`,
                });
                fs.writeFile(`./prod/${fileName}.html`, str, (err) => {
                    if (err) {
                        console.error(err);
                    }
                });
            }
        );
    });
}

// This self-invoking async function is the entry point of the program.
// It orchestrates the following steps:
// 1. Create the production environment (copy static files and minify CSS).
// 2. Retrieve a list of Markdown files in the './markdown' directory.
// 3. Generate a navigation bar based on the first line of each Markdown file.
// 4. Iterate through each Markdown file, parse it into HTML, and save it in the 'prod' directory.
(async () => {
    // Step 1: Create the production environment
    await createProdEnv();

    // Step 2: Get a list of Markdown files in the './markdown' directory
    let files = await readDir('./markdown');

    // Step 3: Generate the navigation bar
    let navbar = await processNavBar();

    // Step 4: Iterate through each Markdown file, parse it, and save as HTML
    files.forEach(async (file) => {
        await parseMarkdown(`./markdown/${file}`, 'template', navbar);
    });
})();
