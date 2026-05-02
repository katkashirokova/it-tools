#!/usr/bin/env node
import readline = require("readline");
import fs = require("fs");
import child_process = require("child_process");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

function copyToClipboard(text: string): void {
  try {
    if (process.platform === "win32") {
      child_process.execSync("clip", { input: text });
    } else if (process.platform === "darwin") {
      child_process.execSync("pbcopy", { input: text });
    } else {
      child_process.execSync("xclip -selection clipboard", { input: text });
    }

    console.log("Copied to clipboard.");
  } catch {
    console.log("Could not copy to clipboard.");
  }
}

async function offerClipboard(value: string): Promise<void> {
  const answer = await ask("\nCopy result to clipboard? y/n: ");

  if (answer.trim().toLowerCase() === "y") {
    copyToClipboard(value);
  }
}

function readLogFile(pathInput: string): string | null {

  const cleanPath = pathInput
    .trim()
    .replace(/^["']|["']$/g, "");

  const normalizedPath = cleanPath.replace(/\\/g, "/");

  try {

    const data = fs.readFileSync(normalizedPath, "utf8");

    return data;

  } catch (err) {

    console.log("READ ERROR:");
    console.log(err);

    return null;

  }

}

function analyzeLevels(lines: string[]): string {
  const levels = {
    ERROR: 0,
    WARN: 0,
    INFO: 0,
    DEBUG: 0,
  };

  for (const line of lines) {
    const upper = line.toUpperCase();

    if (upper.includes("ERROR")) levels.ERROR++;
    if (upper.includes("WARN")) levels.WARN++;
    if (upper.includes("INFO")) levels.INFO++;
    if (upper.includes("DEBUG")) levels.DEBUG++;
  }

  return [
    "Log level summary:",
    `ERROR: ${levels.ERROR}`,
    `WARN: ${levels.WARN}`,
    `INFO: ${levels.INFO}`,
    `DEBUG: ${levels.DEBUG}`,
  ].join("\n");
}

function findLines(lines: string[], keyword: string): string {
  const found = lines
    .map((line, index) => ({ line, number: index + 1 }))
    .filter((item) => item.line.toLowerCase().includes(keyword.toLowerCase()));

  if (found.length === 0) {
    return `No lines found for keyword: ${keyword}`;
  }

  return found
    .map((item) => `${item.number}: ${item.line}`)
    .join("\n");
}

function extractErrors(lines: string[]): string {
  const errors = lines
    .map((line, index) => ({ line, number: index + 1 }))
    .filter((item) => item.line.toUpperCase().includes("ERROR"));

  if (errors.length === 0) {
    return "No ERROR lines found.";
  }

  return errors
    .map((item) => `${item.number}: ${item.line}`)
    .join("\n");
}

async function runAnalyzer(): Promise<void> {
  console.log("\n=== Log Analyzer ===");
  console.log("1) Show log level summary");
  console.log("2) Show ERROR lines");
  console.log("3) Search keyword");
  console.log("4) Show first N lines");

  const choice = await ask("Choose option: ");
  const filePath = await ask("Enter log file path: ");

  const content = readLogFile(filePath);

  if (content === null)  {
    console.log("Could not read file. Check the path.");
    return;
  }

  const lines = content.split(/\r?\n/);
  let result = "";

  if (choice === "1") {
    result = analyzeLevels(lines);
  } else if (choice === "2") {
    result = extractErrors(lines);
  } else if (choice === "3") {
    const keyword = await ask("Enter keyword to search: ");
    result = findLines(lines, keyword);
  } else if (choice === "4") {
  const input = await ask("How many lines to show? (default 20, max 200): ");

  let count = Number(input.trim());

  if (Number.isNaN(count) || count <= 0) {
    count = 20;
  }

  if (count > 200) {
    count = 200;
  }

  result = lines
    .slice(0, count)
    .map((line, index) => `${index + 1}: ${line}`)
    .join("\n");
  } else {
    console.log("Unknown option.");
    return;
  }

  console.log("\n=== Result ===\n");
  console.log(result);

  await offerClipboard(result);
}

async function main(): Promise<void> {
  while (true) {
    await runAnalyzer();

    const again = await ask("\nDo you want to perform another operation? y/n: ");

    if (again.trim().toLowerCase() !== "y") {
      console.log("Goodbye!");
      break;
    }
  }

  rl.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});