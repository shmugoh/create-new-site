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
 * @param {string} queue                - Build Queue respectfully containing filename & subdirectories of Markdown files.
 * @returns {Promise<{[key: string]}>}  - A Promise that resolves an Object with the raw navigation bar string per subpath.
 */
export async function processNavBar(
    queue: [string, string]
): Promise<{ [key: string]: any }> {
    // Empty Buffer for Raw HTML Navigation Bar Object
    let buff: { [key: string]: any } = {};

    return new Promise(async (resolve) => {
        setTimeout(async function () {
            for (const file of queue) {
                // Initiate Key based off PATH
                let path: string = queue[1];
                if (path == '.') {
                    path = 'index';
                } else {
                    path = path.match(/^(\w+)\\\\|^(\w+)/g)![0]; // TODO: grab error here
                }
                // Initiate SubPath Value
                buff[path] = '<nav>';

                // Read the first line of the Markdown file to extract the title.
                // const readable = fs.createReadStream(`${src}//${file}`);
                // const reader = readline.createInterface({ input: readable });
                // let line: any;
                // for await (const fileLine of reader) {
                //     line = fileLine;
                //     break;
                // }
                // readable.close();

                // Extract the file name and extension from the filename.
                let fileRegEx: any = String(file).match(/([^\\]*)\.(\w+)$/);
                let fileName = fileRegEx[1];

                // Construct a navigation link for the Markdown file using its title.
                // Goes through each iteration
                buff[
                    path
                ] += `<a href="${queue[1]}\\${fileName}.html"> ${fileName}</a> |\n`;
            }
            // Close <nav> initialization per key
            for (const i in buff) {
                buff[i] += '</nav>';
            }

            // Resolve the Promise with the generated navigation bar string.
            resolve(buff);
        });
    });
}
