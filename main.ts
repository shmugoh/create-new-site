import { Command } from 'commander';
import { version } from './package.json';

import createNewCommand from './cli/new';
import createbuildCommand from './cli/build';
const commands = [createNewCommand(), createbuildCommand()];
// should make an index.ts file in cli that exports this array instead
// of parsing it here

// initiates command line interface
export const program = new Command();
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
