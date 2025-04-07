import { Command } from 'commander';
import { GetPath, GetId, GetHoldPolicies, GetUserByLogin } from './commands';

const parser = new Command();

parser
    .name("boxutils")
    .description("Simple Command Line Box SDK Sandbox")
    .version("0.0.1")

parser.command("getpath")
    .description("print the path of a given box file or folder")
    .argument("<id>", "The Box file or folder ID")
    .option("-f, --folder", "The ID is a Folder (default is File)")
    .option("-u, --user <login>", "User ID to run command under.  Defaults to custom app user")
    .action((id, options) => {
        return GetPath(id, options);
    });

parser.command("getid")
    .description("print the ID(s) of a given box file or folder")
    .argument("<path>", "The Box file or folder path")
    .option("-u, --user <id>", "User ID to run command under.  Defaults to custom app user")
    .action((path,options) => {
        return GetId(path,options);
    });

parser.command("getholdpolicies")
    .description("List all legal hold policies for the enterprise")
    .option("-u, --user <id>", "User ID to run command under.  Defaults to custom app user")
    .action((options) => {
        return GetHoldPolicies(options);
    });

parser.command("getuser")
    .description("Get user by login")
    .argument("<login>", "The Box user login")
    .option("-u, --user <id>", "User ID to run command under.  Defaults to custom app user")
    .action((login, options) => {
        return GetUserByLogin(login, options);
    });

export { parser }