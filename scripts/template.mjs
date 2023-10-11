import fs from 'node:fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { readDir } from './build.mjs';

export async function copyTemplate(dst) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    let templateSource = `${__dirname}\\..\\template`;

    let srcFiles = await readDir(templateSource);

    srcFiles.forEach((file) => {
        fs.cpSync(
            `${templateSource}\\${file}`,
            `${dst}\\${file}`,
            { recursive: true },
            (err) => {
                if (err) {
                    console.error(err);
                }
            }
        );
    });
}
