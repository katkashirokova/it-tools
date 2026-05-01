import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

function formatDate(date: Date): string {
  return date.toISOString().replace("T", " ").replace("Z", " UTC");
}

async function main() {
  console.log("=== Timestamp Converter ===");
  console.log("1) Current timestamp");
  console.log("2) Timestamp to date");
  console.log("3) Date to timestamp");

  const choice = await ask("Choose option: ");

  if (choice === "1") {
    const now = new Date();

    console.log("\nCurrent date:");
    console.log(formatDate(now));

    console.log("\nUnix timestamp:");
    console.log(Math.floor(now.getTime() / 1000));

    console.log("\nMilliseconds:");
    console.log(now.getTime());
  }

  if (choice === "2") {
    const input = await ask("Enter timestamp: ");
    const value = Number(input.trim());

    if (Number.isNaN(value)) {
      console.log("Invalid timestamp");
    } else {
      const date = value.toString().length === 10
        ? new Date(value * 1000)
        : new Date(value);

      console.log("\nDate:");
      console.log(formatDate(date));

      console.log("\nLocal:");
      console.log(date.toString());
    }
  }

  if (choice === "3") {
    const input = await ask("Enter date, for example 2026-05-01 15:30:00: ");
    const date = new Date(input);

    if (Number.isNaN(date.getTime())) {
      console.log("Invalid date");
    } else {
      console.log("\nUnix timestamp:");
      console.log(Math.floor(date.getTime() / 1000));

      console.log("\nMilliseconds:");
      console.log(date.getTime());
    }
  }

  rl.close();
}

main();