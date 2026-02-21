---
name: funny-commit
description: Generate a funny, weird commit message based on the current staged or unstaged changes. Does NOT create the actual commit.
disable-model-invocation: true
argument-hint: [optional extra context]
---

Generate a funny commit message for the current changes. Do NOT actually commit anything.

## Steps

1. Run `git diff` and `git diff --cached` to see what changed
2. Run `git log --oneline -5` to see the existing commit message style for this repo (they tend to be funny/weird one-liners)
3. Generate THREE commit messages, one for each vibe level. Each must:
   - Actually reference what changed (don't be generic)
   - Match the chaotic energy of the existing commit history
   - Be SHORT — ideally under 50 characters, never over 72
   - Make someone snort-laugh when reading `git log`

If `$ARGUMENTS` is provided, incorporate that context into the messages.

## Output

Do NOT ask any questions. Do NOT run `git commit`. Return exactly three options as code blocks:

**Fun** — Playful pun, witty one-liner, dad joke energy:
```
favicon.svg ghosted us in prod, had to import it properly
```

**Weird** — Absurd, surreal, makes you tilt your head:
```
the logo said 404 and the install pointed to a stranger's house
```

**Weirdest** — Completely unhinged, fever dream energy:
```
( _ ) <-- that's the favicon after vite ate it. we gave it a name tag now
```
