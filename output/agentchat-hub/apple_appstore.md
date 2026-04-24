# App Store Listing — AgentChat Hub

---

## App Name (30 chars max)
AgentChat Hub
_(13 chars)_

---

## Subtitle (30 chars max)
Chat with every AI agent you own
_(33 chars — trim to:)_

**Chat with any AI agent you own**
_(30 chars)_

---

## Promotional Text (170 chars max)
Your agents are live. Now talk to them — from your phone, iPad, Mac, or Vision Pro. No account. No tracking. Free forever.
_(123 chars)_

---

## Description (4000 chars max)

You built the agent. You deployed it. Now you need a way to actually talk to it.

AgentChat Hub is the native iOS, iPad, Mac, and Vision Pro client for any A2A-compatible AI agent. Paste an endpoint URL and you're in a conversation — no SDK, no API key, no custom frontend to build. Just your agent, and a chat window.

ANY ENDPOINT, INSTANTLY

Paste your agent's URL. The app reads the Agent Card and connects in seconds. It doesn't matter where your agent lives — Railway, Vercel, Fly.io, Render, Cloudflare Workers, a local server. If it exposes an A2A endpoint, AgentChat Hub connects to it.

No approval process. No marketplace. No waiting. The open web is the directory.

WATCH YOUR AGENT THINK

Every response streams token by token over SSE. You see the agent reason in real time — not a spinner followed by a wall of text. Catch a wrong turn early. Redirect mid-thought. Know exactly what your agent is doing and when.

SEND FILES, NOT DESCRIPTIONS

Drop photos and files directly into the conversation. Your agent sees exactly what you're looking at — no upload flows, no copy-pasting context into a text field. Multi-modal from day one.

ORGANIZED AROUND HOW YOU WORK

Create custom groups for any workflow — Work, Marketing, Research, Content Creation, Data Extraction, or anything you name. Your agents, your structure. The right one is always one tap away, never buried in a list.

ALL YOUR AGENTS, ONE PLACE

Every agent you build, discover, or run — one app, one roster. No juggling tabs, no hunting through bookmarks. AgentChat Hub is the single place you go to talk to any agent, for any purpose, hosted anywhere.

ZERO DATA COLLECTION

AgentChat Hub has no backend, no telemetry, and no analytics. Messages travel directly from your device to your chosen agent. Conversations are stored on-device and nowhere else. We never see what you send, who you talk to, or what your agents say back.

No account required. No subscription. No in-app purchases. Free forever.

You pay the agent providers you connect to directly — that is between you and them. AgentChat Hub is just the client.

Chat with every AI agent you deploy, wherever it lives.

---

## Keywords (100 chars max, comma-separated)
AI,agent,A2A,LLM,chat,assistant,developer,API,streaming,SSE,automation,workflow,local,Claude,GPT
_(96 chars)_

---

## Support URL
https://agent-chat-hub.com/support

---

## Privacy Policy URL
https://agent-chat-hub.com/privacy-policy

---

## Category
- **Primary:** Productivity
- **Secondary:** Developer Tools / Utilities

---

## Age Rating
4+

---

## Privacy — Data Collection

No data collected. AgentChat Hub has no backend, no telemetry, and no analytics. The app does not collect, transmit, or share any user data. Messages travel directly from your device to your chosen agent endpoint. All conversations are stored on-device only.

---

## Message to App Review (4000 chars max)

Thank you for reviewing AgentChat Hub.

WHAT THE APP DOES

AgentChat Hub is a native iOS, iPad, Mac, and Vision Pro client for AI agents that implement the A2A (Agent-to-Agent) open protocol. Users paste the URL of any A2A-compatible AI agent endpoint and the app connects instantly — reading the Agent Card from /.well-known/agent.json, establishing a conversation, and streaming responses token by token over SSE (Server-Sent Events). There is no account, no login, and no backend.

HOW TO TEST ALL FEATURES

No login required. All features are accessible from first launch.

1. Launch the app. You will see an empty agent roster with a prompt to add your first agent.

2. Tap the "+" button (top right) to add a new agent. You will be prompted for an Agent Card URL. Enter any A2A-compatible endpoint — for example:
   https://demo.agent-chat-hub.com/.well-known/agent.json
   (This is a read-only demo agent we host for review and testing purposes. It accepts any message and responds with a short generated reply streamed token by token.)

3. The app fetches the Agent Card JSON, displays the agent's name and description, and saves it to your roster. Tap the agent to open a chat window.

4. Type any message and send. You will see the response stream in token by token in real time (not a spinner followed by a complete reply — each token appears as it is generated).

5. To test file attachments: tap the paperclip icon in the message input bar. Select a photo from your photo library. Send the message. The attachment is included in the multi-part payload sent to the agent.

6. To test agent groups: tap "Groups" in the sidebar (or bottom tab on iPhone). Tap "New Group", give it a name (e.g. "Work"), and drag an agent into it. Groups persist across sessions.

7. To test multi-agent roster: add a second agent by tapping "+" again. The roster supports unlimited agents across unlimited groups.

8. All conversations are stored locally on the device. To clear history, swipe left on a conversation and tap "Delete".

SPECIAL NOTES

• No network permissions beyond connecting to the user-provided agent endpoint URLs. The app makes no other outbound network calls.
• No camera or microphone access is requested.
• Photo library access is requested only when the user taps the attachment button — it is not requested at launch.
• The app is a web-view-free native SwiftUI binary on all platforms (iPhone, iPad, Mac Catalyst, visionOS).
• If the demo endpoint above is unavailable during review, please reach out via the support URL and we will provide an alternative or a test video.

Please reach out via https://agent-chat-hub.com/support if anything is unclear.

---

## What's New — Version 1.1

• Streaming is smoother — responses now render token by token with no layout jumps.
• Agent groups: organize your roster into named tabs for any workflow.
• File attachments: drop photos and documents directly into the conversation.
• Light and dark mode, following your system preference.
• Native on iPhone, iPad, Mac, and Apple Vision Pro.
