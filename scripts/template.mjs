import fs from 'node:fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { READ_DIRECTORY } from '../utils/osBindings.mjs';

/**
 * Asynchronous function to copy files from a template directory to a destination directory.
 *
 * @param {string} dst - The destination directory where the template files will be copied to.
 */
export async function copyTemplate(dst) {
    // Get the current filename and directory of this module
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    // Define the source directory path for the template
    let templateSource = `${__dirname}\\..\\template`;

    // Read the contents of the template source directory
    let srcFiles = await READ_DIRECTORY(templateSource);

    // Iterate through the source files and copy them to the destination directory
    srcFiles.forEach((file) => {
        // Synchronously copy each file from source to destination
        fs.cpSync(
            `${templateSource}\\${file}`,
            `${dst}\\${file}`,
            { recursive: true },
            (err) => {
                if (err) {
                    // Log an error if the copy operation fails
                    console.error(err);
                }
            }
        );
    });
}
