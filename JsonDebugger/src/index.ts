#!/usr/bin/env node
import readline = require("readline");
import child_process = require("child_process");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question: string): Promise<string> {
  return new Promise(resolve => rl.question(question, resolve));
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

async function readMultiline(): Promise<string> {
  console.log("\nPaste JSON below.");
  console.log("Finish with END on a new line.\n");

  const lines: string[] = [];

  return new Promise(resolve => {
    const handler = (line: string) => {
      if (line.trim() === "END") {
        rl.removeListener("line", handler);
        resolve(lines.join("\n"));
      } else {
        lines.push(line);
      }
    };

    rl.on("line", handler);
  });
}

function getJsonErrorPosition(input: string, errorMessage: string): string {
  const match = errorMessage.match(/position (\d+)/);

  if (!match) {
    return "";
  }

  const position = Number(match[1]);
  const beforeError = input.slice(0, position);

  const lines = beforeError.split("\n");
  const line = lines.length;
  const lastLine = lines[lines.length - 1] ?? "";
const column = lastLine.length + 1;

  const inputLines = input.split("\n");
  const errorLine = inputLines[line - 1] ?? "";

  return [
    `Line: ${line}`,
    `Column: ${column}`,
    "",
    errorLine,
    `${" ".repeat(Math.max(column - 1, 0))}^`
  ].join("\n");
}

function buildStructure(obj: unknown, indent = 0): string {
  const space = " ".repeat(indent);
  const lines: string[] = [];

  if (Array.isArray(obj)) {
    lines.push(`${space}[array]`);

    obj.forEach((item, index) => {
      if (typeof item === "object" && item !== null) {
        lines.push(`${space}${index}:`);
        lines.push(buildStructure(item, indent + 2));
      } else {
        lines.push(`${space}${index}: ${typeof item}`);
      }
    });

    return lines.join("\n");
  }

  if (typeof obj === "object" && obj !== null) {
    Object.entries(obj).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        lines.push(`${space}${key}: array`);
        lines.push(buildStructure(value, indent + 2));
      } else if (typeof value === "object" && value !== null) {
        lines.push(`${space}${key}: object`);
        lines.push(buildStructure(value, indent + 2));
      } else {
        lines.push(`${space}${key}: ${typeof value}`);
      }
    });

    return lines.join("\n");
  }

  return `${space}${typeof obj}`;
}

function buildJsonPaths(value: unknown, path = "$"): string {
  const lines: string[] = [];

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return `${path}: empty array`;
    }

    value.forEach((item, index) => {
      lines.push(buildJsonPaths(item, `${path}[${index}]`));
    });

    return lines.join("\n");
  }

  if (typeof value === "object" && value !== null) {
    const entries = Object.entries(value);

    if (entries.length === 0) {
      return `${path}: empty object`;
    }

    entries.forEach(([key, item]) => {
      lines.push(buildJsonPaths(item, `${path}.${key}`));
    });

    return lines.join("\n");
  }

  return `${path}: ${typeof value}`;
}

async function runDebugger(): Promise<void> {
  console.log("\n=== JSON Debugger ===\n");

  console.log("1) Validate JSON");
  console.log("2) Pretty format JSON");
  console.log("3) Minify JSON");
  console.log("4) Show JSON structure");
  console.log("5) Show JSON paths");

  const option = await ask("\nChoose option: ");
  const input = await readMultiline();

  let result = "";

  try {
    const parsed = JSON.parse(input);

    if (option === "1") {
      result = "JSON is valid.";
    } else if (option === "2") {
      result = JSON.stringify(parsed, null, 2);
    } else if (option === "3") {
      result = JSON.stringify(parsed);
    } else if (option === "4") {
      result = buildStructure(parsed);
    } else if (option === "5") {
  result = buildJsonPaths(parsed);
    }     else {
      console.log("Unknown option.");
      return;
    }

    console.log("\n=== Result ===\n");
    console.log(result);

    await offerClipboard(result);
  } catch (err) {
    if (err instanceof Error) {
      const positionInfo = getJsonErrorPosition(input, err.message);

      result = [
        "Invalid JSON.",
        "",
        err.message,
        positionInfo ? `\n${positionInfo}` : ""
      ].join("\n");

      console.log("\n=== Error ===\n");
      console.log(result);

      await offerClipboard(result);
    } else {
      console.log("\nUnknown error.");
    }
  }
}

async function main(): Promise<void> {
  while (true) {
    await runDebugger();

    const again = await ask("\nDo you want to perform another operation? y/n: ");

    if (again.trim().toLowerCase() !== "y") {
      console.log("Goodbye!");
      break;
    }
  }

  rl.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});