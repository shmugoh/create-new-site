#!/usr/bin/env node

import { READ_DIRECTORY } from './utils/osBindings.mjs';
import { createProdEnv, parseMarkdown } from './scripts/build.mjs';
import { copyTemplate } from './scripts/template.mjs';
import { processNavBar } from './scripts/navbar.mjs';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

let flags = {
    src: null || `${process.cwd()}\\dev`, // Development Folder
    dst: null || `${process.cwd()}\\prod`, // Compiled Folder
};
// This self-invoking async function is the entry point of the program.
// It goes through the following steps:
// 1. Create the production environment (copy static files and minify CSS).
// 2. Retrieve a list of Markdown files in the './markdown' directory.
// 3. Generate a navigation bar based on the first line of each Markdown file.
// 4. Iterate through each Markdown file, parse it into HTML, and save it in the 'prod' directory.
(async () => {
    // Step 0: Extract Template Environment from Module
    let dirFiles = await READ_DIRECTORY('.');

    // Checks if Template Folders are not in the same directory
    if (
        !dirFiles.includes('css') &&
        !dirFiles.includes('markdown') &&
        !dirFiles.includes('static')
    ) {
        // Gets Template Folder from Module Directory
        // and copies to -dst parameter

        // Get the current filename and directory of this module
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        await copyTemplate(`${__dirname}\\template`, `${flags['src']}`);
    } else {
        console.log(
            `Template already exists. Proceeding to compile in ${flags['dst']}...`
        );
    }

    // Step 1: Create the production environment
    await createProdEnv(flags['src'], flags['dst']);

    // Step 2: Get a list of Markdown files in the './markdown' directory
    let files = await READ_DIRECTORY(`${flags['src']}\\markdown`);

    // Step 3: Generate the navigation bar
    let navbar = await processNavBar(`${flags['src']}\\markdown`);

    // Step 4: Iterate through each Markdown file, parse it, and save as HTML
    files.forEach(async (file) => {
        await parseMarkdown(
            `${flags['src']}`,
            `${flags['src']}\\markdown\\${file}`,
            `${flags['dst']}`,
            'template',
            navbar
        );
    });
})();
