import chalk from "chalk";

export default class OrganizeLogger {
  private timestamp: string;

  private updateTimeStamp(): void {
    this.timestamp = new Date().toISOString();
  }

  constructor() {
    this.updateTimeStamp();
  }

  log(...args: any[]): void {
    this.updateTimeStamp();
    console.log(`[${chalk.gray(`[${this.timestamp}]`)}]`, ...args);
  }

  info(...args: any[]): void {
    this.updateTimeStamp();
    console.log(`${chalk.gray(`[${this.timestamp}]`)} ${chalk.bold.blue("INFO:")}`, ...args);
  }

  success(...args: any[]): void {
    this.updateTimeStamp();
    console.log(`${chalk.gray(`[${this.timestamp}]`)} ${chalk.bold.green("SUCCESS:")}`, ...args);
  }

  warning(...args: any[]): void {
    this.updateTimeStamp();
    console.log(`${chalk.gray(`[${this.timestamp}]`)} ${chalk.bold.yellow("WARNING:")}`, ...args);
  }

  error(...args: any[]): void {
    this.updateTimeStamp();
    console.log(`${chalk.gray(`[${this.timestamp}]`)} ${chalk.bold.red("ERROR:")}`, ...args);
  }
}
