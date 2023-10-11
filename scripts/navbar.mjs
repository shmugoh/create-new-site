import fs from 'node:fs';
import readline from 'readline';
import { readDir } from './build.mjs';

// Iterates through each file in '/markdown/' and
// generates a raw navigation bar string.
// The navigation bar includes the title obtained
// from the header of each Markdown file
export async function processNavBar(src = './markdown') {
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
