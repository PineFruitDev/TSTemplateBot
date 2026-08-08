# CLAUDE.md

Orientation for any Claude session working in this repo. Keep it tight; link out rather than inline.

## Project

TSTemplateBot, the TypeScript Discord bot template the other PineFruit bots are built from
(`VoiceLoungeBot`, `ServerTagRewardBot`). discord.js 14, Node 18+. Public repo under
`PineFruitDev`.

The value here is the architecture, not the features: a command class pattern with
`src/commands/index.ts` as the single source of truth registry, `src/core/` for the bot and command
manager, `src/services/` for logging, the Discord API helper, and environment validation.

**Because this is a template, changes here propagate by being copied.** A sloppy pattern added here
shows up in every bot built afterwards. Prefer clarity over cleverness, and keep the example
commands genuinely exemplary.

## Commands

- `npm run build` compiles TypeScript to `dist/`
- `npm run dev` builds then runs `dist/index.js`
- `npm start` runs the already-built `dist/index.js`
- `npm run register` builds then runs `dist/register.js`
- `npm run deploy` builds then registers

There is **no test script and no test directory**. If you add tests, follow VoiceLoungeBot's setup
(`node --test` against the compiled output in `test/`) rather than introducing a new runner.

## Deploy model, and how this template differs from its descendants

The bots built from this template run on Sparked Host / Pterodactyl, where the startup is locked to
`git pull`, `npm install --production`, then `node /home/container/${STARTUP_FILE}`. That means boot
does a `git pull`, so whatever is on `main` is what runs, and **secrets live only in the panel**
(Startup tab or `/home/container/.env`), never in the repo.

This template is **not** host-ready as written, and that is worth knowing before you assume it is:

- No root `index.js` launcher, so `STARTUP_FILE` would have to point into `dist/`.
- No `postinstall`, and `typescript` sits in `devDependencies`, which `npm install --production`
  skips. Nothing would compile on the host.
- Commands do **not** self-register on boot here. `src/core/Bot.ts` has no registration call;
  registration is the separate `npm run register` step.

`VoiceLoungeBot` added all three (root launcher, `postinstall`, `typescript` as a regular
dependency, plus boot-time registration) to make the locked startup work. If you are making this
template deploy-ready, copy that shape rather than inventing a fourth one. If you are not, leave it
alone and do not half-apply it.

## Licensing

Apache 2.0 **plus the Commons Clause**. Use it, fork it, contribute back, but do not sell the
library itself. Do not add code under a different license and do not relicense without Sky saying so.

Branch protection is expected on `main`: no direct pushes, PR required.

## House rules

- **Never commit to `main`.** Branch, open a PR, squash-merge with `--delete-branch`. This holds for
  one-line doc fixes too.
- **No em dashes** anywhere: code, comments, docs, commit messages, PR bodies, UI strings, embed
  copy. Use a comma, a colon, or parentheses.
- **No AI-collaboration tells.** No `Co-Authored-By` trailer, no "Generated with", no mention of
  Claude or any assistant in commit messages, PR bodies, code comments, or docs. This repo is public
  and part of Sky's portfolio; it reads as his own work.
- **Check the other repos before building something new.** `VoiceLoungeBot` and
  `ServerTagRewardBot` are downstream of this template and have often already solved the thing you
  are about to write. `PyTemplateBot` is the Python sibling; keep the two conceptually in step.
- Stage explicit paths. No `git add -A` and no `git add .`.

## Constraints

- Do not commit secrets. `.env.example` holds placeholder values only.
- Do not add product-specific features here. Anything that only one bot needs belongs in that bot.
