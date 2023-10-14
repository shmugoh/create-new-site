#!/usr/bin/env node

import { CREATE_DIRECTORY, READ_DIRECTORY } from './utils/osBindings.mjs';
import { parse_yaml } from './utils/parseConfig.mjs';

import { createProdEnv, parseMarkdown } from './scripts/build.mjs';
import { copyTemplate } from './scripts/template.mjs';
import { processNavBar } from './scripts/navbar.mjs';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

/**
 * Retrieves folder paths based on the parsed command-line flags.
 *
 * By default, the source folder is set to 'dev' and the destination folder is set to 'prod'.
 * Please note that these folder paths must be specified relative to the same directory,
 * as the program automatically converts the provided paths into absolute paths.
 */
function processFlags() {
    let flagIndex = {
        src: process.argv.indexOf('--src'),
        dst: process.argv.indexOf('--dst'),
    };

    Object.keys(flagIndex).forEach((i) => {
        if (flagIndex[i] > -1) {
            flagIndex[i] = `${process.cwd()}\\${
                process.argv[flagIndex[i] + 1]
            }`;
        } else {
            flagIndex[i] = null;
        }
    });

    return {
        src: flagIndex['src'] || `${process.cwd()}\\dev`, // Development Folder
        dst: flagIndex['dst'] || `${process.cwd()}\\prod`, // Compiled Folder
    };
}

/* This self-invoking async function is the entry point of the program.
 * It goes through the following steps:
 * 1. Processes Parsed Flags for Folder Destinations
 * 2. Obtains template files from module
 * 3. Create the production environment (copying static files and minify CSS).
 * 4. Retrieve a list of Markdown files in the './markdown' directory.
 * 5. Generate a navigation bar based on the first line of each Markdown file.
 * 6. Iterate through each Markdown file, parse it into HTML, and save it in the 'prod' directory.
 */
(async () => {
    // Step 1: Process Parsed Flags (for Folders)
    let flags = processFlags();

    // Step 2: Process Source Folder
    // Checks if Source Folder exists
    let dirFiles = await READ_DIRECTORY(`${flags['src']}`);
    if (dirFiles.code == 'ENOENT') {
        // Source Directory does not exist
        console.log(
            'Source Directory does not exist. Creating one right now...'
        );
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        await CREATE_DIRECTORY(flags['src']);
        await copyTemplate(`${__dirname}\\template`, `${flags['src']}`);
    } else {
        if (
            dirFiles.includes('css') &&
            dirFiles.includes('markdown') &&
            dirFiles.includes('static') &&
            dirFiles.includes('config.yaml')
        ) {
            console.log(
                `Template already exists. Proceeding to compile in ${flags['dst']}...`
            );
        } else {
            // in case if -src folder is empty or has an unmatching file
            console.error(
                'Source folder does not match with template. Please remove and try again'
            );
        }
    }

    // Step 3: Creates the production environment
    // Production environment is automatically removed
    await createProdEnv(flags['src'], flags['dst']);

    // Step 4: Get a list of Markdown files in the 'markdown' directory
    console.log('Reading Markdown Files...');
    let files = await READ_DIRECTORY(`${flags['src']}\\markdown`);

    // Step 5: Generate the navigation bar
    console.log('Generating Navigation Bar...');
    let navbar = await processNavBar(`${flags['src']}\\markdown`);

    // Step 6: Parse config.yaml to JavaScript Object
    console.log('Parsing Configuration...');
    let config = await parse_yaml(`${flags['src']}\\config.yaml`);

    // Step 7: Iterate through each Markdown file, parse it, and save as HTML
    files.forEach(async (file) => {
        console.log(`Processing ${file}...`);
        await parseMarkdown(
            `${flags['src']}`,
            `${flags['src']}\\markdown\\${file}`,
            `${flags['dst']}`,
            'template',
            navbar,
            config
        );
    });
})();
