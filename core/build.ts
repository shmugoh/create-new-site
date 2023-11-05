import showdown from 'showdown';
import htmlMinifyModule from 'html-minifier';
import CleanCSS from 'clean-css';
import ejs from 'ejs';

import {
    COPY_FILE,
    CREATE_DIRECTORY,
    READ_DIRECTORY,
    REMOVE_DIRECTORY,
    READ_FILE,
    WRITE_FILE,
} from '../lib/osBindings';

import { processNavBar } from './navbar';
import { fixBracketPreview } from '../lib/markdownPreviewFix';
import { bind_config } from '../lib/parseConfig';

const minify = htmlMinifyModule.minify;
let converter = new showdown.Converter();

/*
 * Creates a production environment by copying static files and minifying CSS.
 */
export async function setupStaticResources(
    src: string,
    dst: string,
    config: any
) {
    // Allocates Folder Variables
    const theme = config['theme'];
    const themeFolder = `themes\\${theme}`;

    // Create necessary directory for destination
    console.log('Removing destination folder...'); // may deprecate for live-editing
    REMOVE_DIRECTORY(dst);
    console.log('Creating new destination folder...');
    CREATE_DIRECTORY(dst);

    // Read the list of static and CSS files
    const cssFiles: any = await READ_DIRECTORY(`${src}\\${themeFolder}`);
    const staticFiles: any = await READ_DIRECTORY(`${src}\\static`);

    // Minifies CSS Files & saves them in destination directory
    CREATE_DIRECTORY(`${dst}\\css`);
    cssFiles.forEach(async (file: string) => {
        if (file.endsWith('.css')) {
            // Reads CSS
            let data = await READ_FILE(`${src}\\${themeFolder}\\${file}`);

            // Minifies CSS
            let output: any = new CleanCSS({
                compatibility: 'ie8',
                level: 2,
                inline: false,
                rebase: false,
                // keepBreaks: false,
                // aggressiveMerging: true,
                // processImport: false,
                // specialComments: 'none',
            }).minify(data);

            // Saves CSS to Destination Directory
            WRITE_FILE(`${dst}\\css\\${file}`, output['styles']);
        }
    });

    // Copy all static files to destinationd directory
    CREATE_DIRECTORY(`${dst}\\static`);
    staticFiles.forEach((file: string) => {
        // Checks if static file isn't .ejs
        COPY_FILE(`${src}\\static\\${file}`, `${dst}\\static\\${file}`);
    });
}

/**
 * Parses Markdown to HTML and saves the result in destination directory.
 *
 * @param {string} source - Source file path for Markdown content.
 * @param {string} config - Configuration Object to Process within HTML
 */
// export async function compileMarkdown(source, config) {
//     // Extract file name and format from the source file path
//     console.log(markdownSrc);
//     let fileRegEx: any = markdownSrc.match(/.+\/([^//]*)\.(\w+)$/);
//     let fileName: string = fileRegEx[1];
//     let fileFormat: string = fileRegEx[2];

//     // Check if the source file is a Markdown file
//     if (fileFormat != 'md') {
//         console.error(
//             `${fileName}.${fileFormat} in /markdown/ is not a .md file. Proceeding to skip.`
//         );
//         return;
//     }

//     // Read Markdown content from the source file
//     let markdownContent: any = await READ_FILE(markdownSrc);
//     markdownContent = fixBracketPreview(markdownContent);

//     // Convert Markdown content to HTML
//     converter.setOption('tables', true);
//     var htmlContent = converter.makeHtml(markdownContent);

//     // Render an HTML template using EJS, minify it,
//     // and save in destination directory
//     ejs.renderFile(
//         `${folderSrc}//static//${mode}.ejs`,
//         {
//             // Configuration Bindings
//             title: bind_config('title', config['title']),
//             favicon: bind_config('favicon', config['favicon']),
//             css: bind_config('css', config['css']),
//             cache: bind_config('cache', config['cache']),
//             head: bind_config('head', config['head']),
//             embed: bind_config('embed', config['embed']),

//             navbar: navbar,
//             markdownContent: htmlContent,
//         },
//         (err: any, html: string) => {
//             if (err) {
//                 throw err;
//             }

//             // Minfies HTML
//             html = minify(html, {
//                 removeAttributeQuotes: true,
//                 caseSensitive: true,
//                 collapseWhitespace: true,
//                 removeComments: true,
//                 quoteCharacter: `'`,
//             });

//             // Writes HTML
//             WRITE_FILE(`${dst}//${fileName}.html`, html);
//         }
//     );
// }
