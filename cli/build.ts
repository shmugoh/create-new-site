import { Command } from 'commander';

export default function createBuildCommand() {
    const buildCommand = new Command()
        .command('build')
        .description('build site')
        .argument('[name]', 'name for new site')
        .action((str, options) => {
            const limit = options.first ? 1 : undefined;
            console.log(str.split(options.separator, limit));
        });

    return buildCommand;
}
