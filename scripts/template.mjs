import fs from 'node:fs';

import { READ_DIRECTORY } from '../utils/osBindings.mjs';

/**
 * Asynchronous function to copy files from a template directory to a destination directory.
 *
 * @param {string} dst - The destination directory where the template files will be copied to.
 */
export async function copyTemplate(src, dst) {
    // Read the contents of the template source directory
    let srcFiles = await READ_DIRECTORY(src);

    // Iterate through the source files and copy them to the destination directory
    srcFiles.forEach((file) => {
        // Synchronously copy each file from source to destination
        fs.cpSync(
            `${src}//${file}`,
            `${dst}//${file}`,
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
