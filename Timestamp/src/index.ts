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

function formatUtc(date: Date): string {
  return date.toISOString().replace("T", " ").replace("Z", " UTC");
}

function formatInTimezone(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZoneName: "short",
  }).format(date);
}

function parseTimestamp(input: string): Date | null {
  const value = Number(input.trim());

  if (Number.isNaN(value)) {
    return null;
  }

  const isSeconds = input.trim().length === 10;
  return new Date(isSeconds ? value * 1000 : value);
}

async function offerClipboard(value: string): Promise<void> {
  const answer = await ask("Copy result to clipboard? y/n: ");

  if (answer.trim().toLowerCase() === "y") {
    copyToClipboard(value);
  }
}

async function main(): Promise<void> {
  console.log("=== Timestamp Converter ===");
  console.log("1) Current timestamp");
  console.log("2) Timestamp to date");
  console.log("3) Date to timestamp");
  console.log("4) Timestamp to specific timezone");

  const choice = await ask("Choose option: ");

  if (choice === "1") {
    const now = new Date();

    const result = [
      `UTC: ${formatUtc(now)}`,
      `Local: ${now.toString()}`,
      `Unix timestamp: ${Math.floor(now.getTime() / 1000)}`,
      `Milliseconds: ${now.getTime()}`,
    ].join("\n");

    console.log("\n" + result);
    await offerClipboard(String(Math.floor(now.getTime() / 1000)));
  } else if (choice === "2") {
    const input = await ask("Enter timestamp in seconds or milliseconds: ");
    const date = parseTimestamp(input);

    if (!date || Number.isNaN(date.getTime())) {
      console.log("Invalid timestamp.");
    } else {
      const result = [
        `UTC: ${formatUtc(date)}`,
        `Local: ${date.toString()}`,
        `ISO: ${date.toISOString()}`,
      ].join("\n");

      console.log("\n" + result);
      await offerClipboard(date.toISOString());
    }
  } else if (choice === "3") {
    const input = await ask("Enter date, for example 2026-05-01 15:30:00: ");
    const date = new Date(input);

    if (Number.isNaN(date.getTime())) {
      console.log("Invalid date.");
    } else {
      const unix = Math.floor(date.getTime() / 1000);
      const ms = date.getTime();

      const result = [
        `Unix timestamp: ${unix}`,
        `Milliseconds: ${ms}`,
        `UTC: ${formatUtc(date)}`,
      ].join("\n");

      console.log("\n" + result);
      await offerClipboard(String(unix));
    }
  } else if (choice === "4") {
    const timestamp = await ask("Enter timestamp in seconds or milliseconds: ");
    const timeZone = await ask("Enter timezone, for example Europe/Sofia or America/New_York: ");

    const date = parseTimestamp(timestamp);

    if (!date || Number.isNaN(date.getTime())) {
      console.log("Invalid timestamp.");
    } else {
      try {
        const formatted = formatInTimezone(date, timeZone.trim());

        const result = [
          `Timezone: ${timeZone.trim()}`,
          `Date: ${formatted}`,
          `UTC: ${formatUtc(date)}`,
        ].join("\n");

        console.log("\n" + result);
        await offerClipboard(formatted);
      } catch {
        console.log("Invalid timezone.");
        console.log("Examples: Europe/Sofia, UTC, America/New_York, Asia/Tokyo");
      }
    }
  } else {
    console.log("Unknown option.");
  }

  rl.close();
}

main();