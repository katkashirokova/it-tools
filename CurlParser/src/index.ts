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

function printRawHttpRequest(parsed: any): void {
  if (!parsed.url) {
    return;
  }

  const url = new URL(parsed.url);
  const path = `${url.pathname}${url.search}`;

  console.log("\n=== HTTP Request View ===\n");
  console.log(`${parsed.method} ${path} HTTP/1.1`);
  console.log(`Host: ${url.host}`);

  parsed.headers.forEach((header: string) => {
    console.log(header);
  });

  if (parsed.body) {
    console.log("");
    console.log(parsed.body);
  }
}

function printRequest(parsed: any) {
console.log("\nBody:");

if (!parsed.body) {
  console.log("None");
  return;
}

try {
  const json = JSON.parse(parsed.body);
  console.log("JSON:\n");
  console.log(JSON.stringify(json, null, 2));
} catch {
  console.log(parsed.body);
}
}

async function main() {
  console.log("=== CURL Parser ===\n");

  const input = await ask("Paste curl command:\n\n");

  const parsed = parseCurl(input);

  printRequest(parsed);
  printRawHttpRequest(parsed);
  
  rl.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});