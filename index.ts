import Anthropic from "@anthropic-ai/sdk";
import 'dotenv/config';                                              
import { execSync } from 'child_process'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const diff = execSync('git diff --staged').toString()

async function main() {

  if(!diff){
    console.log("No staged commits, Run git add first...")
  }

  const msg = await anthropic.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 256,
    messages: [
      {
        role: "user",
content: `Write a git commit message for this diff.                                                                                                                                                                                    
  Use conventional commits format (fix/feat/chore/refactor).
  Be specific. No fluff.  

  Diff: ${diff}`
      }
    ]
  });
    console.log(msg.content[0].type);
}

main().catch(console.error);
