/* eslint-disable @typescript-eslint/no-explicit-any */

export type LogFunction = (...args: Array<unknown>) => void;

export interface Logger {
  fatal: LogFunction;
  error: LogFunction;
  warn: LogFunction;
  info: LogFunction;
  debug: LogFunction;
  trace: LogFunction;
}

export class ScopedLogger implements Logger {
  private prefixes: string[];

  constructor(...prefixes: string[]) {
    this.prefixes = prefixes;
  }
  private getPrefixesString(): string {
    return this.prefixes.map((i) => `[${i}]`).join("");
  }
  public extendScope(prefix: string) {
    this.prefixes.push(prefix);

    return this;
  }
  fatal = (...args: any[]) => console.error(this.getPrefixesString(), ...args);
  error = (...args: any[]) => console.error(this.getPrefixesString(), ...args);
  warn = (...args: any[]) => console.warn(this.getPrefixesString(), ...args);
  info = (...args: any[]) => console.info(this.getPrefixesString(), ...args);
  debug = (...args: any[]) => console.debug(this.getPrefixesString(), ...args);
  trace = (...args: any[]) => console.log(this.getPrefixesString(), ...args);
}
