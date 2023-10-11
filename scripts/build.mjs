const showdown = require('showdown');
const ejs = require('ejs');
const fs = require('fs');
const minify = require('html-minifier').minify;
const CleanCSS = require('clean-css');

let converter = new showdown.Converter();

// Creates a production environment
// by copying static files and minifying CSS
export async function createProdEnv() {
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
export function parseMarkdown(
    src = './markdown/index.md',
    mode = 'template',
    navbar
) {
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

// Reads a directory and returns available files
export async function readDir(src = './markdown') {
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
