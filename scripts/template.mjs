const fs = require('fs');
import { readDir } from './build.mjs';

export async function copyTemplate(dst) {
    let templateSource = `${__dirname}\\template`;
    let srcFiles = await readDir(templateSource);

    srcFiles.forEach((file) => {
        fs.copyFile(`${templateSource}\\${file}`, dst);
    });
}
