import chalk from "chalk";

const logger = {
  success: (message: string) => console.log(chalk.green.bold(`${message}`)),
  error: (message: string) => console.log(chalk.red(`${message}`)),
  warning: (message: string) => console.log(chalk.yellow(`⚠️  ${message}`)),
  info: (message: string) => console.log(chalk.cyan(`${message}`)),
};

export default logger;
