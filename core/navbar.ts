import fs from 'node:fs';
import readline from 'readline';
import { READ_DIRECTORY } from '../lib/osBindings';

/**
 * Iterates through each markdown file in the specified source directory (default is './markdown/')
 * and generates a Title String for a Navigation Bar. After finishing each iteration, it returns a
 * raw HTML navigation bar string. The navigation bar includes links to HTML
 * pages generated from the Markdown files and their corresponding titles obtained from
 * the header of each Markdown file.
 *
 * @param {string} src - The source directory containing Markdown files.
 * @returns {Promise<string>} A Promise that resolves with the raw navigation bar string.
 */
export async function processNavBar(src = './markdown'): Promise<string> {
    // Read the list of files in the source directory.
    const markdownFiles: string[] = (await READ_DIRECTORY(src)) as string[]; // MAN

    // Empty buffer for Raw HTML Navigation Bar String
    let buff = '';

    return new Promise(async (resolve) => {
        setTimeout(async function () {
            for (const file of markdownFiles) {
                // Skip files that don't have a '.md' extension.
                if (!file.endsWith('.md')) {
                    continue;
                }

                // Read the first line of the Markdown file to extract the title.
                const readable = fs.createReadStream(`${src}//${file}`);
                const reader = readline.createInterface({ input: readable });
                let line: any;
                for await (const fileLine of reader) {
                    line = fileLine;
                    break;
                }
                readable.close();

                // Extract the file name and extension from the filename.
                let fileRegEx: any = String(file).match(/([^\\]*)\.(\w+)$/);
                let fileName = fileRegEx[1];

                // Construct a navigation link for the Markdown file using its title.
                // Goes through each iteration
                buff += `<a href="./${fileName}.html"> ${
                    line.match(/#\W(.+)/)[1]
                }</a> |\n`;
            }
            // Resolve the Promise with the generated navigation bar string.
            resolve(buff);
        });
    });
}
