import YAML from 'yaml';
import fs from 'fs';

/**
 * Iterates through each markdown file in the specified source directory (default is './markdown/')
 * and generates a Title String for a Navigation Bar. After finishing each iteration, it returns a
 * raw HTML navigation bar string. The navigation bar includes links to HTML
 * pages generated from the Markdown files and their corresponding titles obtained from
 * the header of each Markdown file.
 *
 * @param {string} queue                - Build Queue respectfully containing filename & subdirectories of Markdown files.
 * @param {string} names_yaml           - The path to the YAML file containing the names of the Markdown files.
 * @returns {Promise<{[key: string]}>}  - A Promise that resolves an Object with the raw navigation bar string per subpath.
 */
export async function processNavBar(
    queue: [string, string],
    names_yaml: string
): Promise<{ [key: string]: any }> {
    // Empty Buffer for Raw HTML Navigation Bar Object
    let buff: { [key: string]: any } = {};

    // Read and parse the YAML file.
    const file = fs.readFileSync(names_yaml, 'utf8');
    const customNames = YAML.parse(file);

    return new Promise(async (resolve) => {
        setTimeout(async function () {
            for (const file of queue) {
                // Initiate Key based off PATH
                let path: string = file[0];
                if (path == '.') {
                    path = 'index';
                } else {
                    path = path.match(/^(\w+)\\\\|^(\w+)/g)![0]; // TODO: grab error here
                }
                // Initiate SubPath Value if empty
                if (!buff[path]) {
                    buff[path] = '<nav>';
                }

                // Extract the file name and extension from the filename.
                let fileRegEx: any = String(file[1]).match(/([^\\]*)\.(\w+)$/);
                let fileName = fileRegEx[1];

                // Look up the custom name in the config.
                let customName =
                    customNames[`${file[0]}\\${file[1]}`] || fileName;

                // Construct a navigation link for the Markdown file using its title.
                // Goes through each iteration
                buff[
                    path
                ] += `<a href="${file[0]}\\${fileName}.html"> ${customName}</a> `;
            }

            // Add Secondary Page to Primary NavBar
            for (const i in buff) {
                // Add Main File of Secondary Section to NavBar
                if (i == 'index') {
                    for (const file of queue) {
                        // Initiate Key based off PATH
                        let path: string = file[0];
                        if (path == '.' || path.includes('\\')) {
                            continue;
                        } else {
                            path = path.match(/^(\w+)\\\\|^(\w+)/g)![0]; // TODO: grab error here
                        }

                        let fileRegEx: any = String(file[1]).match(
                            /([^\\]*)\.(\w+)$/
                        );
                        let fileName = fileRegEx[1];

                        // Look up the custom name in the config.
                        let customName =
                            customNames[`${file[0]}\\${file[1]}`] || fileName;

                        buff[
                            'index' // for whatever reason this wouldn't work without specifying it is index
                        ] += `<a href="${file[0]}\\${fileName}.html"> ${customName}</a> `;
                    }
                }

                // Close <nav> initialization per key
                buff[i] += '</nav>';
            }
            // Add Index NavBar to Secondary NavBar
            // TODO: Add Support for NavBars below Secondary
            for (const i in buff) {
                if (i != 'index') {
                    buff[i] = buff['index'] + buff[i];
                }
            }

            // Resolve the Promise with the generated navigation bar string.
            resolve(buff);
        });
    });
}
