#!/usr/bin/env node

import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function copyDir(src: string, dest: string) {
  fs.readdirSync(src).forEach((file) => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);

    if (fs.lstatSync(srcPath).isDirectory()) {
      if (file === "node_modules") return;
      if (file === "dist") return;
      fs.mkdirSync(destPath, { recursive: true });
      copyDir(srcPath, destPath);
    } else {
      if (file === "package-lock.json") return;
      if (file === ".env") return;
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

async function main() {
  let projectName = process.argv[2];

  if (!projectName) {
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "Project name:",
        validate: (input) =>
          input.trim() !== "" || "Project name cannot be empty",
      },
    ]);
    projectName = answers.name;
  }

  const targetDir = path.join(process.cwd(), projectName);

  if (fs.existsSync(targetDir)) {
    console.error(
      `Folder "${projectName}" already exists. Please choose another name.`
    );
    process.exit(1);
  }

  fs.mkdirSync(targetDir, { recursive: true });
  copyDir(path.join(__dirname, "../template"), targetDir);

  console.log(`Project created in ${targetDir}`);
  console.log("\n Done! Now run:");
  console.log(`   cd ${projectName}`);
  console.log(`   npm install`);
  console.log("   npm run start:dev");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
