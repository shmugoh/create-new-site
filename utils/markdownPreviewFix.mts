/**
 * Fixes Bracket Previews in Markdown before compilation to HTML.
 *
 * During the development process, it's common for developers to include references to
 * static files, such as images, in Markdown files.
 * These static files are typically organized in a separate 'static' folder to keep
 * the project structure organized.
 *
 * Due to the relative paths used in `create-new-site`, developers must reference the
 * previous folder (as this `[../]`) to reference
 * and visualize these static resources within the Markdown content before compiling
 * to HTML. If this were not to be changed and be compiled, the webpage wouldn't be
 * able to find the static file.
 *
 * For instance, if you have an image in the 'static' folder and you want to preview
 * it in your Markdown file, you would typically write:
 *
 * `![Image Alt Text](../static/image.png)`
 *
 * For compilation, you would reference the current folder instead:
 *
 * `![Image Alt Text](./static/image.png)`
 *
 * Although it may not be a huge issue, this would heavily impact
 * the developer experience as they would have to keep changing
 * the reference to the static files back 'n forth.
 *
 * The program proceeds to automatically change the reference to the folder to
 * the current folder, instead of requiring the use of the previous folder.
 * When Markdown is compiled to HTML, the necessary path adjustments are
 * made automatically, reducing the complexity when workign with static files
 * and improving the developer experience.
 *
 * @param {string} markdown - Raw String Contents of Markdown.
 * @param {string} mode     - Mode for which Markdown is being used
 */
export function fixBracketPreview(markdown, mode = 'static') {
    switch (mode) {
        case 'static':
            return String(markdown).replace(/\]\(\.\.\//g, '](./');
    }
}
