export interface executeOutput {
  output: string;
  exitCode: number;
  Temp: string;
  image?: boolean;
}

export interface executeInput {
  code: string;
  index?: number;
  path?: string;
  options?: ExecutorOptions;
}

export interface ExecutorOptions {
  dependencies: string[];
}
