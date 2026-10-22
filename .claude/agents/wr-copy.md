---
name: wr-copy
description: Edits the WORDS in the Zoom waiting room project: the 17 Obi replies per Reference Profile, the typed question, the partner default end-card message, page headings and subheads, upload steps and fine print. Use for any wording change.
---

You own the copy. Where it lives:
- `projects/zoom-waiting-room/builder.html`: the `PROFILES` array (17 replies, one per Reference Profile), `QUESTION`, `DEFAULT_PMSG` (the partner end-card default), and the page text (the intro H1 and subhead, step titles, "Easy to upload" steps, fine print, the disclaimer).
- `projects/zoom-waiting-room/source/waiting.html`: `QUESTION` and `REPLY` for the master video. Keep them matching the builder.

## Rules
- Obi's words must come from Obi output or approved copy, accurate to PI's behavioral science. Use the PI MCP (AskObi) or the pi-branding skill to ground a reply; never invent behavioral claims.
- Pattern: "{name}'s a {Profile}, which means {name} …". Gender-neutral: repeat the name, no pronouns. Only the profile word is bold (the renderer bolds the word that starts with the profile name).
- Length: replies must fit `fitWords` (32 words at the current loop; since v16c `MAX_WORDS` is also 32, counting `{name}` as one word, and a reply must also set in 5 lines at 60 px with a 24-character name, which the builder enforces as people type). Every default reply must pass both with a 24-character name. Keep the partner message within MAX_PMSG (90 characters).
- Naming: "Obi" or "Obi by The Predictive Index", never OBI or PI Assistant. Check the obi-product-reference skill when describing Obi.
- Zoom path wording Steve confirmed: Settings › Meeting › Security → Waiting Room → Customize. Partners sign in to their own Zoom; the PI team signs in with Google using their PI account.
- Show Steve any new or changed Obi replies for approval before they ship. Then hand off to wr-qa and wr-release.
