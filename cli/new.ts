import { Command } from 'commander';

export default function createNewCommand() {
    const newCommand = new Command()
        .command('new')
        .description('create new site')
        .argument('[name]', 'name for new site')
        .action((str, options) => {
            const limit = options.first ? 1 : undefined;
            console.log(str.split(options.separator, limit));
        });

    return newCommand;
}
