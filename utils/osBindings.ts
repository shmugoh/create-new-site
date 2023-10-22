import fs from 'node:fs';

/**
 * Creates a directory at the specified path.
 * @param {string} path - The path where the directory will be created.
 */
export function CREATE_DIRECTORY(path: string): void | Error {
    fs.mkdir(path, (err) => {
        if (err) {
            return err;
        }
    });
}

/**
 * Reads a directory and returns a list of available files.
 * @param {string} path - The path of the directory to read.
 * @returns {Promise<string[]>} - A Promise that resolves with an array of file names in the directory.
 */
export async function READ_DIRECTORY(path: string) {
    let files: Array<string> = [];

    return new Promise((resolve) => {
        setTimeout(function () {
            fs.readdir(path, (err, data) => {
                if (err) {
                    resolve(err);
                    return;
                }
                data.forEach((file) => {
                    files.push(file);
                });
                resolve(files);
            });
        }, 250);
    });
}

/**
 * Removes directory at the specified path.
 * @param {string} path - The path where the directory will be removed.
 */
export function REMOVE_DIRECTORY(path: string): void | Error {
    try {
        fs.rmSync(path, { recursive: true, force: true });
    } catch (err) {
        return err as Error;
    }
}

/**
 * Reads the content of a file and returns it as a string.
 * @param {string} path - The path of the file to read.
 * @returns {Promise<string>} - A Promise that resolves with the content of the file as a string.
 */
export async function READ_FILE(path: string): Promise<string> {
    return new Promise((resolve) => {
        setTimeout(function () {
            fs.readFile(path, 'utf8', (err, data) => {
                if (err) {
                    throw err;
                }
                resolve(data);
            });
        }, 250);
    });
}

/**
 * Writes content to a file at the specified path.
 * @param {string} pathSrc - The path where the file will be created or overwritten.
 * @param {string} content - The content to write to the file.
 */
export function WRITE_FILE(pathSrc: string, content: string): void | Error {
    fs.writeFile(pathSrc, content, (err) => {
        if (err) {
            throw err;
        }
    });
}

/**
 * Copies a file from the source path to the destination path.
 * @param {string} pathSrc - The path of the source file.
 * @param {string} pathDst - The path where the file will be copied to.
 */
export function COPY_FILE(pathSrc: string, pathDst: string): void | Error {
    fs.copyFile(pathSrc, pathDst, (err) => {
        if (err) {
            throw err;
        }
    });
}
