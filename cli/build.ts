import { Command } from 'commander';

import { setupStaticResources, compileMarkdown } from '../core/build';
import { processNavBar } from '../core/navbar';

import {
    CREATE_DIRECTORY,
    READ_DIRECTORY,
    READ_TREE_DIRECTORY,
} from '../lib/osBindings';
import { parse_yaml } from '../lib/parseConfig';

export default async function createBuildCommand() {
    const buildCommand = new Command()
        .command('build')
        .description('build site')
        .option('-s, --source <string>', 'folder path of jago site', '.')
        .action(async (opts) => {
            // Checks if config.yaml present
            await READ_DIRECTORY(opts.source).then(async (files: any) => {
                if (!files.includes('config.yaml')) {
                    throw new Error('Project does not have config.yaml file');
                }
            });

            // Allocates PATH Variables
            const src = `${opts.source}`;
            const dst = `${src}\\content`;

            // // Copy CSS & Static Files
            const config: any = await parse_yaml(`${src}\\config.yaml`);
            await setupStaticResources(src, dst, config);

            // Creates Subdirectory Queue
            var subQueue = [];
            const TREE_DIR = READ_TREE_DIRECTORY(src);
            const subdirPattern = /[^\\]+/g;
            const filePattern = /\w+\.\w+/g;
            // Scans Directory for Ignored Files
            for (const path of TREE_DIR) {
                const root = path.match(subdirPattern);
                if (root !== null) {
                    if (
                        !config.ignore.includes(root[0]) &&
                        path.endsWith('.md')
                    ) {
                        subQueue.push(path); // Pushes PATH of Markdown to Subdirectory Queue
                    }
                }
            }

            // Create Build Queue
            var buildQueue: any = [];
            for (const file of subQueue) {
                const path = file.match(subdirPattern);
                var root = '';
                if (path !== null) {
                    for (const sub of path) {
                        if (path.indexOf(sub) == 0) {
                            if (sub.endsWith('.md')) {
                                // compile markdown in index
                                root = '.';
                                buildQueue.push([root, sub]);
                            } else {
                                // create directory
                                root = sub;
                                try {
                                    await CREATE_DIRECTORY(`${dst}\\${root}`);
                                } catch (err) {
                                    continue;
                                }
                            }
                        } else if (!sub.match(filePattern)) {
                            // create SUB directory
                            root += `\\${sub}`;
                            try {
                                await CREATE_DIRECTORY(`${dst}\\${root}`);
                            } catch (err) {
                                continue;
                            }
                        } else if (sub.match(filePattern)) {
                            // COMPILE markdown
                            buildQueue.push([root, sub]);
                        }
                    }
                }
            }
            // im sorry

            // Build NavBar per Queue
            await processNavBar(buildQueue).then(async (navbar) => {
                // Build Markdown per Queue
                await compileMarkdown(src, dst, buildQueue, config, navbar);
            });
        });

    return buildCommand;
}
