import { execaSync } from "execa";
import fs from "node:fs";
import path from "node:path";
import { afterEach, beforeEach, expect, test } from "vitest";

const testRoot = path.join(__dirname, "temp");

const command = `${path.join(__dirname, "cli.ts")}`;

beforeEach(() => {
  fs.mkdirSync(testRoot, { recursive: true });
});

afterEach(() => {
  fs.rmSync(testRoot, { recursive: true, force: true });
});

test("prompts for the project name if none supplied", async () => {
  const proc = execaSync(command, { cwd: testRoot });

  expect(proc.stdout).toContain("Project name:");
});

test("asks to overwrite non-empty target directory", () => {
  const targetDir = "test-app";
  fs.mkdirSync(path.join(testRoot, targetDir), { recursive: true });
  const proc = execaSync(command, ["test-app"], { cwd: testRoot });

  expect(proc.stdout).toContain(
    `Target directory "${targetDir}" is not empty. Please choose how to proceed:`
  );
});

test("asks to overwrite non-empty current directory", () => {
  const targetDir = "test-app";
  fs.mkdirSync(path.join(testRoot, targetDir), { recursive: true });
  const proc = execaSync(command, ["."], { cwd: testRoot });

  expect(proc.stdout).toContain(
    `Current directory is not empty. Please choose how to proceed:`
  );
});
