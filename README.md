# Learning through Anthropic AI SDK

## Basic Setup

1. Anthropic SDK Package
2. Anthropic SDK API Key
3. Plain JS Setup

## Basic API Response

### Project 1 (Commit Message Generator)

| Code | Concept |
| -------- | -------- |
| execSync('git diff --staged')   | Getting real context to feed the model   |
| client.messages.create({...})   | The core API call you'll use everywhere   |
|  model: 'claude-haiku-4-5-20251001'   | Picking the right model  |
| max_tokens: 256   |  Controlling output length    |
| messages: [{ role: 'user', content: '...' }]   | The message format Claude expects   |
| response.content[0].text   | How to extract the actual text from the response   |

### How it works