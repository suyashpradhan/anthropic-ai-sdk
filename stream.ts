import Anthropic from "@anthropic-ai/sdk";
import "dotenv/config";
import { execSync } from "child_process";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const diff = execSync("git diff --staged").toString();

async function main() {
  if (!diff) {
    console.log("No staged commits, Run git add first...");
  }

  const stream = await anthropic.messages.stream({
    model: "claude-haiku-4-5",
    max_tokens: 256,
    messages: [
      {
        role: "user",
        content: `Write a git commit message for this diff.                                                                                                                                                                                    
  Use conventional commits format (fix/feat/chore/refactor).
  Be specific. No fluff.  

  Diff: ${diff}`,
      },
    ],
  });
  stream.on("text", (text) => {
    process.stdout.write(text);
  });

  await stream.finalMessage();
  const final = await stream.finalMessage();
  console.log("\n--- usage ---");
  console.log(`Input tokens: ${final.usage.input_tokens}`);
  console.log(`Output tokens: ${final.usage.output_tokens}`);
}

main().catch(console.error);
