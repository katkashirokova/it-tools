#!/usr/bin/env node
import readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

function parseCurl(command: string) {

  const methodMatch = command.match(/-X\s+(\w+)/);

  const urlMatch = command.match(/https?:\/\/[^\s'"]+/);

  const headers = [...command.matchAll(/-H\s+["']([^"']+)["']/g)];

  const bodyMatch = command.match(/-d\s+(['"])(.*?)\1/);

  const method = methodMatch ? methodMatch[1] : "GET";

  const url = urlMatch ? urlMatch[0] : "";

  return {
    method,
    url,
    headers: headers.map(h => h[1]),
    body: bodyMatch ? bodyMatch[2] : ""
  };
}

function printRequest(parsed: any) {
  console.log("\n=== Parsed HTTP Request ===\n");

  console.log(`Method: ${parsed.method}`);
  console.log(`URL: ${parsed.url}`);

  console.log("\nHeaders:");

  if (parsed.headers.length === 0) {
    console.log("None");
  } else {
    parsed.headers.forEach((h: string) => console.log(h));
  }

  console.log("\nBody:");

  if (parsed.body) {
    console.log(parsed.body);
  } else {
    console.log("None");
  }
}

async function main() {
  console.log("=== CURL Parser ===\n");

  const input = await ask("Paste curl command:\n\n");

  const parsed = parseCurl(input);

  printRequest(parsed);

  rl.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});