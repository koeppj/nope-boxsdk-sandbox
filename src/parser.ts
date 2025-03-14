import { Command } from 'commander';
import { GetPath } from './commands';

const parser = new Command();

parser
    .name("boxutils")
    .description("Simple Command Line Box SDK Sandbox")
    .version("0.0.1")
    .option("-v, --verbose", "Enable verbose logging")

parser.command("getpath")
    .description("print the path of a given box file or folder")
    .argument("<id>", "The Box file or folder ID")
    .option("-f, --folder", "The ID is a Folder (default is File)")
    .action((id, options) => {
        return GetPath(id, options);
    });


export { parser }