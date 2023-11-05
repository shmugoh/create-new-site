import fs from 'fs';

import { READ_DIRECTORY } from '../lib/osBindings';

/**
 * Asynchronous function to copy files from a template directory to a destination directory.
 *
 * @param {string} dst - The destination directory where the template files will be copied to.
 */
export async function copyTemplate(dst: string) {
    const src = `${__dirname}\\..\\template`;
    try {
        // Read the contents of the template source directory
        let srcFiles: string[] = (await READ_DIRECTORY(src)) as string[]; // man

        // Iterate through the source files and copy them to the destination directory
        for (const file of srcFiles) {
            // Synchronously copy each file from source to destination
            fs.cpSync(`${src}//${file}`, `${dst}//${file}`, {
                recursive: true,
            });
        }
    } catch (err) {
        throw err;
    }
}
