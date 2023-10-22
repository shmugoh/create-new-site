import { promises as fsPromises } from 'fs';

import { READ_DIRECTORY } from '../utils/osBindings.mjs';

/**
 * Asynchronous function to copy files from a template directory to a destination directory.
 *
 * @param {string} src - The source directory where the template files are located.
 * @param {string} dst - The destination directory where the template files will be copied to.
 */
export async function copyTemplate(src: string, dst: string) {
    try {
        // Read the contents of the template source directory
        let srcFiles: string[] = (await READ_DIRECTORY(src)) as string[]; // man

        // Iterate through the source files and copy them to the destination directory
        for (const file of srcFiles) {
            // Synchronously copy each file from source to destination
            fsPromises.copyFile(`${src}//${file}`, `${dst}//${file}`);
        }
    } catch (err) {
        console.error(err);
    }
}
