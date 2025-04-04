import fs from "node:fs";
import path from "node:path";
import { afterEach, beforeEach, test } from "vitest";
import { CliBuilder } from "./invoke-cli";

const testRoot = path.join(__dirname, "temp");

beforeEach(() => {
  fs.mkdirSync(testRoot, { recursive: true });
});

afterEach(() => {
  fs.rmSync(testRoot, { recursive: true, force: true });
});

test("prompts for the project name if none supplied", async () => {
  const [_, logs] = CliBuilder().setCwd(testRoot).invoke();
  logs.should.contain("Project name:");
});

test("asks to overwrite non-empty target directory", () => {
  const projectName = "test-app";
  const projectDirectory = path.join(testRoot, projectName);
  fs.mkdirSync(projectDirectory, { recursive: true });
  fs.writeFileSync(path.join(projectDirectory, "test.txt"), "test", "utf-8");

  const [_, logs] = CliBuilder().setCwd(testRoot).invoke([projectName]);

  logs.should.contain(
    `Target directory "${projectName}" is not empty. Please choose how to proceed:`
  );
});

test("asks to overwrite non-empty current directory", () => {
  fs.writeFileSync(path.join(testRoot, "test.txt"), "test", "utf-8");

  const [_, logs] = CliBuilder().setCwd(testRoot).invoke(["."]);

  logs.should.contain(
    `Current directory is not empty. Please choose how to proceed:`
  );
});
