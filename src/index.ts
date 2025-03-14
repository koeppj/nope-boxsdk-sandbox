import { parser } from './parser';

// Main function for the CLI
async function main() {
    await parser.parseAsync(process.argv);
}

// Execute the main function
main().then(() => {
    console.log("Done!");
    process.exit(0); // Exit the process successfully
}).catch((error) => {
    console.error("Unhandled error:", error);
    process.exit(1); // Exit with an error code
});
