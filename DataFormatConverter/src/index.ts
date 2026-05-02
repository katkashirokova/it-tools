#!/usr/bin/env node
import readline = require("readline");
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

async function askMultilineInput(): Promise<string> {
  console.log("\nPaste your input below.");
  console.log("When finished, type END on a new line and press Enter.\n");

  const lines: string[] = [];

  return new Promise((resolve) => {
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

async function offerClipboard(value: string): Promise<void> {
  const answer = await ask("\nCopy result to clipboard? y/n: ");

  if (answer.trim().toLowerCase() === "y") {
    copyToClipboard(value);
  }
}

function printResult(result: string): void {
  console.log("\n=== Result ===\n");
  console.log(result);
}

async function runConverter(): Promise<void> {
  console.log("\n=== Data Format Converter ===");
  console.log("1) JSON -> pretty JSON");
  console.log("2) JSON -> minified JSON");
  console.log("3) Text -> Base64");
  console.log("4) Base64 -> Text");
  console.log("5) Text -> URL encoded");
  console.log("6) URL encoded -> Text");

  const choice = await ask("Choose option: ");
  const input = await askMultilineInput();

  let result = "";

  try {
    if (choice === "1") {
      const parsed = JSON.parse(input);
      result = JSON.stringify(parsed, null, 2);
    } else if (choice === "2") {
      const parsed = JSON.parse(input);
      result = JSON.stringify(parsed);
    } else if (choice === "3") {
      result = Buffer.from(input, "utf8").toString("base64");
    } else if (choice === "4") {
      result = Buffer.from(input, "base64").toString("utf8");
    } else if (choice === "5") {
      result = encodeURIComponent(input);
    } else if (choice === "6") {
      result = decodeURIComponent(input);
    } else {
      console.log("Unknown option.");
      return;
    }

    printResult(result);
    await offerClipboard(result);
  } catch (error) {
    if (error instanceof Error) {
      console.log("\nError:");
      console.log(error.message);
    } else {
      console.log("\nUnknown error.");
    }
  }
}

async function main(): Promise<void> {
  while (true) {
    await runConverter();

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