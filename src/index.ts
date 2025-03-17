import { parser } from './parser';

// Main function for the CLI
async function main() {
    await parser.parseAsync(process.argv);
}

// Execute the main function
main().then(() => {
    process.exit(0); // Exit the process successfully
}).catch((error) => {
    console.error("Error", error);
    process.exit(1); // Exit with an error code
});
