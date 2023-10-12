import showdown from 'showdown';
import htmlMinifyModule from 'html-minifier';
import CleanCSS from 'clean-css';
import ejs from 'ejs';

import {
    COPY_FILE,
    CREATE_DIRECTORY,
    READ_DIRECTORY,
    READ_FILE,
    WRITE_FILE,
} from '../utils/osBindings.mjs';
import { fixBracketPreview } from '../utils/markdownPreviewFix.mjs';

const minify = htmlMinifyModule.minify;
let converter = new showdown.Converter();

/*
 * Creates a production environment by copying static files and minifying CSS.
 */
export async function createProdEnv() {
    // Create necessary directories in the 'prod' environment
    CREATE_DIRECTORY('prod');
    // Read the list of static and CSS files
    let staticFiles = await READ_DIRECTORY('./static');
    let cssFiles = await READ_DIRECTORY('./css');

    // Copy all static files to the 'prod' directory
    CREATE_DIRECTORY('prod/static');
    staticFiles.forEach((file) => {
        // Checks if static file isn't .ejs
        if (file != String(file).match('.*.ejs$')) {
            COPY_FILE(`./static/${file}`, `./prod/static/${file}`);
        }
    });

    // Minify CSS files and save them in the 'prod' directory
    CREATE_DIRECTORY('prod/css');
    cssFiles.forEach((file) => {
        if (file == String(file).match('.*.css$')) {
            // Reads CSS
            let data = READ_FILE(`./css/${file}`);

            // Minifies CSS
            let output = new CleanCSS({
                compatibility: 'ie8',
                level: 2,
                inline: false,
                rebase: false,
                keepBreaks: false,
                aggressiveMerging: true,
                processImport: false,
                specialComments: 'none',
            }).minify(data);

            // Saves CSS to Directory
            WRITE_FILE(`./prod/css${file}`, output['styles']);
        }
    });
}

/**
 * Parses Markdown to HTML and saves the result in the 'prod' directory.
 *
 * @param {string} src - Source file path for Markdown content.
 * @param {string} mode - Mode for processing (e.g., 'template').
 * @param {string} navbar - Raw HTML Navigation Bar String.
 */
export async function parseMarkdown(
    src = './markdown/index.md',
    mode = 'template',
    navbar
) {
    // Extract file name and format from the source file path
    let fileRegEx = src.match(/\/.*\/([^\\]*)\.(\w+)$/);
    let fileName = fileRegEx[1];
    let fileFormat = fileRegEx[2];

    // Check if the source file is a Markdown file
    if (fileFormat != 'md') {
        console.error(
            `${fileName}.${fileFormat} in /markdown/ is not a .md file. Proceeding to skip.`
        );
        return;
    }

    // Read Markdown content from the source file
    let markdownContent = await READ_FILE(src);
    markdownContent = fixBracketPreview(markdownContent);

    // Convert Markdown content to HTML
    converter.setOption('tables', true);
    var htmlContent = converter.makeHtml(markdownContent);

    // Render an HTML template using EJS, minify it, and save in the 'prod' directory
    ejs.renderFile(
        `./static/${mode}.ejs`,
        { navbar: navbar, markdownContent: htmlContent },
        (err, html) => {
            if (err) {
                console.error(err);
            }

            // Minfies HTML
            html = minify(html, {
                removeAttributeQuotes: true,
                caseSensitive: true,
                collapseWhitespace: true,
                removeComments: true,
                quoteCharacter: `'`,
            });

            // Writes HTML
            WRITE_FILE(`./prod/${fileName}.html`, html);
        }
    );
}
