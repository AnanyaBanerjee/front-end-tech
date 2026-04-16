# Ananya's Build Room — Substack Posts

---
---

# POST 1 — Welcome

**TITLE:** Welcome to the Build Room

**SUBTITLE:** Three apps shipped. More in progress. Here's the story so far.

---

Hi, I'm Ananya.

Senior software engineer. Builder. The kind of person who has seventeen ideas open in a notes app and genuinely believes she'll get to all of them.

I'm here because I've been building things quietly for a while — shipping apps, solving problems I personally ran into, exploring ideas that wouldn't leave me alone — and I figured it was time to stop building in silence.

This newsletter is the Build Room. It's where I think out loud about what I'm making, why I'm making it, what broke, what shipped, and what I'm obsessing over next.

Not a highlight reel. Not thought leadership. Just an honest, nerdy account of what it actually looks like to build things that matter — one app at a time.

---

**What I've built so far.**

Three apps are already out in the world:

**Daily Vibes** — a daily quotes app for iOS. English, Hindi, or both. Beautiful typography, gentle reminders, no noise. Built because I wanted something calming to open in the morning that didn't feel like the rest of the internet.

**AgentChat Hub** — a universal client for AI agents that support Google's A2A protocol. Paste any agent URL, start chatting. No account, no subscription, no tracking. Built because AI agents are proliferating fast and there was no clean, private way to actually talk to them from your phone.

**ItMadeMyDay** — a private vault for moments that made you feel something good. A compliment. A photo. A message. Fully offline, no cloud, nothing leaves your device. Built because I kept forgetting the good things and I needed somewhere quiet to keep them.

Three very different apps. Same underlying question with all of them: *what would make someone's day slightly better, without getting in the way?*

---

**What's coming.**

More ideas are already in motion. I'll be writing about them as they take shape — the decisions, the dead ends, the moments where something clicks.

Each app I've built gets its own post too. The real story of how it came together, what was hard, what I'd do differently.

If you build things, want to build things, or just find the process of making something from nothing genuinely interesting — you're in the right place.

Glad you're here.

— Ananya

---
---

# POST 2 — Daily Vibes

**TITLE:** I built a quotes app. Here's why that was harder than it sounds.

**SUBTITLE:** Daily Vibes — the first thing I shipped, and what I learned from it.

---

The pitch for Daily Vibes is simple: a daily quotes app for iOS. Beautiful. Calming. English and Hindi. You set a reminder time, it shows you something worth reading.

Simple apps are never simple to build.

---

**Why I made it.**

I kept opening my phone first thing in the morning and immediately feeling behind. News, notifications, metrics — all of it before I'd even made coffee. I wanted something different. Something that asked nothing of me and just offered something good.

I couldn't find exactly what I wanted, so I built it.

**Daily Vibes** delivers one quote a day. You pick your language — English, हिंदी, or both. You pick your reminder time. That's it. The app gets out of your way.

---

**What made it interesting to build.**

The language support was the part I'm most proud of. Adding Hindi wasn't just a translation — it's a different script, different typographic rhythm, different emotional register for the same words. Getting it to feel right in both languages took real care.

The other interesting problem: iOS 26 broke push notifications for my original setup. `expo-notifications` became incompatible overnight with a system update. I had to rip out the notification infrastructure entirely and replace it with a UI-only reminder picker. Not ideal — but it shipped, it worked, and sometimes the pragmatic fix is the right one.

Multiple App Store submissions later (every change needs a version bump — one of Apple's more delightful rules), Daily Vibes is out.

---

**What I'd do differently.**

Ship faster. I spent too long making it perfect before letting anyone use it. The version that shipped is good. The version I kept polishing in my head was theoretical.

Done beats perfect. I know this. I keep having to re-learn it.

---

**What's next for it.**

More languages are the obvious next step. Hindi opened the door — I want to walk through it. There's also something to explore with audio, with different quote categories, with making the morning ritual more intentional.

But that's for a future post.

— Ananya

---
---

# POST 3 — AgentChat Hub

**TITLE:** 150 companies agreed on how AI agents should talk to each other. I built the app.

**SUBTITLE:** AgentChat Hub — what the A2A protocol is, why it matters, and why I had to build this.

---

Here's something that happened quietly while everyone was arguing about which AI model was better:

150 companies — Google, Microsoft, AWS, Salesforce, SAP, and more — agreed on a shared protocol for how AI agents should communicate with each other. They called it A2A. Agent-to-Agent. It hit v1.0 stable. The Linux Foundation took it over.

It's kind of a big deal. Gartner thinks 40% of enterprise apps will have AI agents built in by 2026. A2A is the layer that lets them all talk to each other.

And there was no clean way to actually *use* it from your phone.

So I built one.

---

**What AgentChat Hub does.**

Paste any A2A-compatible agent URL. Start chatting. That's the whole thing.

No account. No subscription. No platform lock-in. No tracking. Your conversations stay on your device.

It works on iPhone, iPad, Mac, and Vision Pro — because if you're going to build for the future of computing, you should probably build for all of it.

---

**The technical bit (skip if you want).**

The interesting engineering problem: browsers can't do cross-origin SSE directly. So web clients route through an Express CORS proxy I built. Native iOS calls the agent directly. Same experience, different paths under the hood.

Sessions are stored in the encrypted keychain on iOS via `expo-secure-store`. The app generates a UUID for your session and sends it with every request. Clean, simple, private.

One gotcha I'm proud of solving: if the app crashes mid-stream, any messages stuck as `isStreaming: true` persist to storage. On next boot, the app detects and resets these so you never open the app to a permanently spinning loading state. Small detail. Real annoyance if you miss it.

---

**Why I built it free.**

Because the goal right now isn't monetization. The goal is for people to actually use it, see what A2A can do, and build a mental model of a world where you're not locked into one AI provider forever.

I believe that world is coming. AgentChat Hub is a small bet on it arriving sooner.

---

**What's next.**

The A2A ecosystem is moving fast. As more agents appear that support the protocol, AgentChat Hub becomes more useful without me changing anything. That's the nature of building on open standards.

I'm watching it closely. You'll hear about it here first.

— Ananya
