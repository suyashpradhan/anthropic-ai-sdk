import Anthropic from "@anthropic-ai/sdk";
import "dotenv/config";
import * as readline from "readline";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// this array is the "memory" — grows with every turn
const messages: Anthropic.MessageParam[] = [];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function chat(userMessage: string) {
  // 1. append user turn
  messages.push({ role: "user", content: userMessage });

  // 2. send entire history every time
  const stream = anthropic.messages.stream({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 256,
    system:
      "You are a helpful AI engineering tutor. Be concise. ignore if asked any other topic and be brutally rude and roast if ask any other topic.",
    messages,
  });

  // 3. stream response to terminal
  process.stdout.write("\nClaude: ");
  let assistantMessage = "";

  stream.on("text", (text) => {
    process.stdout.write(text);
    assistantMessage += text;
  });

  await stream.finalMessage();
  console.log("\n");

  // 4. append assistant turn so next call includes it
  messages.push({ role: "assistant", content: assistantMessage });

  const final = await stream.finalMessage();
  console.log(
    `[tokens: ${final.usage.input_tokens} in / ${final.usage.output_tokens} out]`,
  );
}

async function main() {
  console.log('Chat started. Type "exit" to quit.\n');

  while (true) {
    const input = await prompt("You: ");
    if (input.toLowerCase() === "exit") break;
    if (!input.trim()) continue;
    await chat(input);
  }

  rl.close();
}

main().catch(console.error);
