#!/usr/bin/env node
import readline = require("readline");
import crypto = require("crypto");
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

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateUuid(): string {
  return crypto.randomUUID();
}

function generateEmail(): string {
  const names = ["alex", "maria", "john", "katka", "test", "demo", "user"];
  const domains = ["example.com", "test.com", "demo.local", "mail.test"];

  const name = names[randomInt(0, names.length - 1)];
  const domain = domains[randomInt(0, domains.length - 1)];
  const suffix = randomInt(100, 999);

  return `${name}${suffix}@${domain}`;
}

function generateTimestamp(): string {
  const now = new Date();

  return [
    `ISO: ${now.toISOString()}`,
    `Unix timestamp: ${Math.floor(now.getTime() / 1000)}`,
    `Milliseconds: ${now.getTime()}`,
  ].join("\n");
}

function generateTestUser(): string {
  const firstNames = ["Alex", "Maria", "John", "Anna", "Peter", "Kate"];
  const lastNames = ["Ivanov", "Petrova", "Smith", "Brown", "Nikolov"];

  const firstName = firstNames[randomInt(0, firstNames.length - 1)];
  const lastName = lastNames[randomInt(0, lastNames.length - 1)];

  const user = {
    id: generateUuid(),
    firstName,
    lastName,
    email: generateEmail(),
    age: randomInt(18, 75),
    active: Math.random() > 0.3,
    createdAt: new Date().toISOString(),
  };

  return JSON.stringify(user, null, 2);
}

function generateApiPayload(): string {
  const payload = {
    requestId: generateUuid(),
    timestamp: new Date().toISOString(),
    user: {
      id: generateUuid(),
      email: generateEmail(),
    },
    items: [
      {
        id: generateUuid(),
        name: "Test item",
        quantity: randomInt(1, 10),
        price: randomInt(10, 500),
      },
    ],
    metadata: {
      source: "test-data-generator",
      environment: "test",
    },
  };

  return JSON.stringify(payload, null, 2);
}

function generateMultipleEmails(count: number): string {
  const emails: string[] = [];

  for (let i = 0; i < count; i++) {
    emails.push(generateEmail());
  }

  return emails.join("\n");
}

async function runGenerator(): Promise<void> {
  console.log("\n=== Test Data Generator ===");
  console.log("1) Generate UUID");
  console.log("2) Generate email");
  console.log("3) Generate timestamp");
  console.log("4) Generate test user JSON");
  console.log("5) Generate API payload JSON");
  console.log("6) Generate multiple emails");

  const choice = await ask("Choose option: ");

  let result = "";

  if (choice === "1") {
    result = generateUuid();
  } else if (choice === "2") {
    result = generateEmail();
  } else if (choice === "3") {
    result = generateTimestamp();
  } else if (choice === "4") {
    result = generateTestUser();
  } else if (choice === "5") {
    result = generateApiPayload();
  } else if (choice === "6") {
    const input = await ask("How many emails? (default 10, max 100): ");
    let count = Number(input.trim());

    if (Number.isNaN(count) || count <= 0) {
      count = 10;
    }

    if (count > 100) {
      count = 100;
    }

    result = generateMultipleEmails(count);
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
    await runGenerator();

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