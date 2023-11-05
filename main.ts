import { Command } from 'commander';
import { version } from './package.json';

import createNewCommand from './cli/new';
import createbuildCommand from './cli/build';

const createCommands = async () => {
    const newCommand = await createNewCommand();
    const buildCommand = await createbuildCommand();
    return [newCommand, buildCommand];
};

(async () => {
    const commands = await createCommands();

    // initiates the command line interface
    const program = new Command();
    program
        .name('jago')
        .description(
            'Static Markdown Site Generator with a strong focus on client performance and flexibility'
        )
        .version(version, '-v, --version');

    // adds all commands from ./cli folder
    for (const command of commands) {
        program.addCommand(command);
    }

    program.parse();
})();
