import { createProdEnv, readDir, parseMarkdown } from './scripts/build.mjs';
import { copyTemplate } from './scripts/template.mjs';
import { processNavBar } from './scripts/navbar.mjs';

// This self-invoking async function is the entry point of the program.
// It orchestrates the following steps:
// 1. Create the production environment (copy static files and minify CSS).
// 2. Retrieve a list of Markdown files in the './markdown' directory.
// 3. Generate a navigation bar based on the first line of each Markdown file.
// 4. Iterate through each Markdown file, parse it into HTML, and save it in the 'prod' directory.
(async () => {
    // Step 0: Extract Template Environment from Module
    let dirFiles = await readDir('.');

    // Checks if Template Folders are not in the same directory
    if (
        !dirFiles.includes('css') &&
        !dirFiles.includes('markdown') &&
        !dirFiles.includes('static')
    ) {
        await copyTemplate(process.cwd());
    } else {
        console.log(
            'Template already exists. Proceeding to compile in /prod/...'
        );
    }

    // Step 1: Create the production environment
    await createProdEnv();

    // Step 2: Get a list of Markdown files in the './markdown' directory
    let files = await readDir('./markdown');

    // Step 3: Generate the navigation bar
    let navbar = await processNavBar();

    // Step 4: Iterate through each Markdown file, parse it, and save as HTML
    files.forEach(async (file) => {
        await parseMarkdown(`./markdown/${file}`, 'template', navbar);
    });
})();
