#!/usr/bin/env node
import readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question: string): Promise<string> {
  return new Promise(resolve => rl.question(question, resolve));
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

function showStructure(obj: any, indent = 0): void {

  const space = " ".repeat(indent);

  if (Array.isArray(obj)) {

    console.log(`${space}[array]`);

    obj.forEach(item => {
      showStructure(item, indent + 2);
    });

  } else if (typeof obj === "object" && obj !== null) {

    Object.keys(obj).forEach(key => {

      const value = obj[key];

      if (typeof value === "object") {
        console.log(`${space}${key}:`);
        showStructure(value, indent + 2);
      } else {
        console.log(`${space}${key}: ${typeof value}`);
      }

    });

  }

}

async function main() {

  console.log("=== JSON Debugger ===\n");

  console.log("1) Validate JSON");
  console.log("2) Pretty format JSON");
  console.log("3) Minify JSON");
  console.log("4) Show JSON structure");

  const option = await ask("\nChoose option: ");

  const input = await readMultiline();

  try {

    const parsed = JSON.parse(input);

    if (option === "1") {

      console.log("\nJSON is valid.");

    }

    if (option === "2") {

      console.log("\nPretty JSON:\n");
      console.log(JSON.stringify(parsed, null, 2));

    }

    if (option === "3") {

      console.log("\nMinified JSON:\n");
      console.log(JSON.stringify(parsed));

    }

    if (option === "4") {

      console.log("\nJSON Structure:\n");
      showStructure(parsed);

    }

  } catch (err: any) {

    console.log("\nInvalid JSON:");
    console.log(err.message);

  }

  rl.close();

}

main().catch(err => {
  console.error(err);
  process.exit(1);
});