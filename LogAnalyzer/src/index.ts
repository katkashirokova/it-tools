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

function analyzeWebLog(lines: string[]): string {
  const methods: Record<string, number> = {};
  const statuses = {
    "2xx": 0,
    "3xx": 0,
    "4xx": 0,
    "5xx": 0,
  };

  const slowRequests: string[] = [];
  let totalRequests = 0;

  lines.forEach((line, index) => {
    const methodMatch = line.match(/\b(GET|POST|PUT|DELETE|PATCH|OPTIONS|HEAD)\b/i);
    const statusMatch = line.match(/\b([1-5]\d{2})\b/);
    const timeMatch = line.match(/\b(\d+)\s?ms\b/i);

    if (!methodMatch && !statusMatch) {
      return;
    }

    totalRequests++;

    if (methodMatch && methodMatch[1]) {
  const method = methodMatch[1].toUpperCase();
  methods[method] = (methods[method] ?? 0) + 1;
}

    if (statusMatch) {
      const status = Number(statusMatch[1]);

      if (status >= 200 && status < 300) statuses["2xx"]++;
      else if (status >= 300 && status < 400) statuses["3xx"]++;
      else if (status >= 400 && status < 500) statuses["4xx"]++;
      else if (status >= 500 && status < 600) statuses["5xx"]++;
    }

    if (timeMatch) {
      const time = Number(timeMatch[1]);

      if (time > 1000) {
        slowRequests.push(`${index + 1}: ${line}`);
      }
    }
  });

  const methodLines = Object.entries(methods)
    .map(([method, count]) => `${method}: ${count}`)
    .join("\n");

  return [
    "Web / Network log summary:",
    `Total requests: ${totalRequests}`,
    "",
    "HTTP status summary:",
    `2xx: ${statuses["2xx"]}`,
    `3xx: ${statuses["3xx"]}`,
    `4xx: ${statuses["4xx"]}`,
    `5xx: ${statuses["5xx"]}`,
    "",
    "Methods:",
    methodLines || "None detected",
    "",
    "Slow requests (>1000ms):",
    slowRequests.length > 0 ? slowRequests.join("\n") : "None detected",
  ].join("\n");
}


async function runAnalyzer(): Promise<void> {
  console.log("\n=== Log Analyzer ===");
  console.log("1) Show log level summary");
  console.log("2) Show ERROR lines");
  console.log("3) Search keyword");
  console.log("4) Show first N lines");
  console.log("5) Analyze web/network log");

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
  } else if (choice === "5") {
    result = analyzeWebLog(lines);
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