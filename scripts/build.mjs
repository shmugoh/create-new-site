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
import { bind_config } from '../utils/parseConfig.mjs';

const minify = htmlMinifyModule.minify;
let converter = new showdown.Converter();

/*
 * Creates a production environment by copying static files and minifying CSS.
 */
export async function createProdEnv(src, dst) {
    // Create necessary directories for destination
    CREATE_DIRECTORY(dst);
    // Read the list of static and CSS files
    let staticFiles = await READ_DIRECTORY(`${src}\\static`);
    let cssFiles = await READ_DIRECTORY(`${src}\\css`);

    // Copy all static files to destinationd directory
    CREATE_DIRECTORY(`${dst}\\static`);
    staticFiles.forEach((file) => {
        // Checks if static file isn't .ejs
        if (file != String(file).match('.*.ejs$')) {
            COPY_FILE(`${src}\\static\\${file}`, `${dst}\\static\\${file}`);
        }
    });

    // Minify CSS files and save them in destination directory
    CREATE_DIRECTORY(`${dst}\\css`);
    cssFiles.forEach((file) => {
        if (file == String(file).match('.*.css$')) {
            // Reads CSS
            let data = READ_FILE(`${src}\\css\\${file}`);

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

            // Saves CSS to Destination Directory
            WRITE_FILE(`${dst}\\css\\${file}`, output['styles']);
        }
    });
}

/**
 * Parses Markdown to HTML and saves the result in destination directory.
 *
 * @param {string} folderSrc - Source file path for Development content. Required to obtain .EJS Template.
 * @param {string} markdownSrc - Source file path for Markdown content.
 * @param {string} dst - Destination for Compiled HTML.
 * @param {string} mode - Mode for processing (e.g., 'template').
 * @param {string} navbar - Raw HTML Navigation Bar String.
 * @param {string} config - Configuration Object to Process within HTML
 */
export async function parseMarkdown(
    folderSrc = './src',
    markdownSrc = './markdown/index.md',
    dst = './prod',
    mode = 'template',
    navbar,
    config
) {
    // Extract file name and format from the source file path
    let fileRegEx = markdownSrc.match(/.+\\([^\\]*)\.(\w+)$/);
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
    let markdownContent = await READ_FILE(markdownSrc);
    markdownContent = fixBracketPreview(markdownContent);

    // Convert Markdown content to HTML
    converter.setOption('tables', true);
    var htmlContent = converter.makeHtml(markdownContent);

    // Render an HTML template using EJS, minify it,
    // and save in destination directory
    ejs.renderFile(
        `${folderSrc}\\static\\${mode}.ejs`,
        {
            // Configuration Bindings
            title: bind_config('title', config['title']),
            favicon: bind_config('favicon', config['favicon']),
            css: bind_config('css', config['css']),
            cache: bind_config('cache', config['cache']),
            head: bind_config('head', config['head']),
            embed: bind_config('embed', config['embed']),

            navbar: navbar,
            markdownContent: htmlContent,
        },
        (err, html) => {
            if (err) {
                console.error(err);
            }

            // Minfies HTML
            // html = minify(html, {
            //     removeAttributeQuotes: true,
            //     caseSensitive: true,
            //     collapseWhitespace: true,
            //     removeComments: true,
            //     quoteCharacter: `'`,
            // });

            // Writes HTML
            WRITE_FILE(`${dst}\\${fileName}.html`, html);
        }
    );
}
