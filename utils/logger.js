import chalk from 'chalk';

const logger = {
  info: (message) => {
    console.log(chalk.blue(`[INFO] ${new Date().toLocaleTimeString()} - ${message}`));
  },

  success: (message) => {
    console.log(chalk.green(`[SUCCESS] ${new Date().toLocaleTimeString()} - ${message}`));
  },

  warn: (message) => {
    console.log(chalk.yellow(`[WARN] ${new Date().toLocaleTimeString()} - ${message}`));
  },

  error: (message) => {
    console.log(chalk.red(`[ERROR] ${new Date().toLocaleTimeString()} - ${message}`));
  },

  debug: (message) => {
    console.log(chalk.magenta(`[DEBUG] ${new Date().toLocaleTimeString()} - ${message}`));
  }
};

export default logger;
