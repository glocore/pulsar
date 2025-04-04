// reference: https://www.lekoarts.de/garden/how-to-test-cli-output-in-jest-vitest/
import type { ExecaSyncError } from "execa";
import { execaSync } from "execa";
import { join } from "node:path";
import strip from "strip-ansi";
import { createLogsMatcher } from "./matcher";

const executablePath = join(__dirname, "cli.ts");

type CreateLogsMatcherReturn = ReturnType<typeof createLogsMatcher>;

export type InvokeResult = [
  exitCode: number,
  logsMatcher: CreateLogsMatcherReturn
];

export function CliBuilder() {
  let cwd = "";

  const self = {
    setCwd: (_cwd: string) => {
      cwd = _cwd;
      return self;
    },

    invoke: (args: Array<string> = []): InvokeResult => {
      const NODE_ENV = "production";
      try {
        const results = execaSync(executablePath, args, {
          cwd,
          env: { NODE_ENV },
        });

        return [
          results.exitCode as number,
          createLogsMatcher(
            strip(results.stderr.toString() + results.stdout.toString())
          ),
        ];
      } catch (e) {
        const execaError = e as ExecaSyncError;
        return [
          execaError.exitCode as number,
          createLogsMatcher(strip(execaError.stdout?.toString() || ``)),
        ];
      }
    },
  };

  return self;
}
