import { Command } from 'commander';
import { CREATE_DIRECTORY, READ_DIRECTORY } from '../lib/osBindings';
import { copyTemplate } from '../core/template';

export default async function createNewCommand() {
    const newCommand = new Command()
        .command('new')
        .description('create new site')
        .argument('[name]', 'name for new site')
        .action(async (str, options) => {
            // Reads Directory
            let dirFiles: any = await READ_DIRECTORY(str);
            if (dirFiles.code == 'ENOENT') {
                // creates Directory if non-existant
                await CREATE_DIRECTORY(str).then(async () => {
                    // allocate template files into new directory
                    await copyTemplate(str);
                });
            } else {
                console.log('Directory Exists...'); // change this later this sucks
            }
        });

    return newCommand;
}
