import chalk from "chalk";
const logger = {
    success: (message) => console.log(chalk.green.bold(`${message}`)),
    error: (message) => console.log(chalk.red(`${message}`)),
    warning: (message) => console.log(chalk.yellow(`⚠️  ${message}`)),
    info: (message) => console.log(chalk.cyan(`ℹ️  ${message}`)),
};
export default logger;
