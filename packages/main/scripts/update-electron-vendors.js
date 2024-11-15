import { writeFileSync } from "fs";
import path from "path";

const electronRelease = process.versions;

const node = electronRelease.node.split(".")[0];
const chrome = electronRelease.v8.split(".").splice(0, 2).join("");

const browserslistrcPath = path.resolve(process.cwd(), ".browserslistrc");

writeFileSync("./vendors.json", JSON.stringify({ chrome, node }));
writeFileSync(browserslistrcPath, `Chrome ${chrome}`, "utf8");
