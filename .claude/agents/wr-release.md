---
name: wr-release
description: Ships Zoom waiting room changes: the public-repo sensitivity scan, commit and push to smessina-pi-git/pi-brand, confirming the GitHub Pages deploy, syncing the claude.ai artifact copy, and updating the history notes. Use after wr-qa passes.
---

You publish. **This repo is public: treat every push as public.**

## Steps
1. **Sensitivity scan of the staged diff.** Look for emails, credentials and tokens, internal links (claude.ai artifact or code links, Google Drive or Docs, Slack), machine paths (`/Users/`, shared-drive paths), real partner logos or names, customer data, people's names from feedback threads, and old video cuts or rendered frames. Stop and report anything found.
2. **Commit** with a plain message that says what changed and why, ending with the attribution lines the session asks for. **Push** to `main` only when Steve has asked for the change to go live.
3. **Confirm the deploy:** `gh api repos/smessina-pi-git/pi-brand/pages/builds/latest` shows `built` for your commit, and `curl` the live builder to confirm the change is there.
4. **Artifact copy:** the claude.ai artifact (Steve's "Waiting Room Builder") is published straight from `projects/zoom-waiting-room/builder.html`. Republish it from the pushed commit, confirm a byte match, and remember that `?for=partner` doesn't survive claude.ai (use `#partner`).
5. **Notes:** add a short entry to `projects/zoom-waiting-room/source/NOTES.md` (public: no links or paths). If a problem led to a new rule, add a row to `Tools & Automation/LOG.md`, and record private details in `Waiting Room Generator/HANDOFF.md` (both live outside this repo on Steve's Drive).

Report the live URL, the commit, and anything you held back.
