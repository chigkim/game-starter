# game-starter

A starting point for parents who want to make small browser games for their young children with an AI coding agent, such as Claude Code, Codex or Gemini CLI. You describe the game in plain words, and the agent builds it.

The games run in any web browser and are made for phones and tablets, especially Safari on iPhone and iPad. There is nothing to install for the child to play.

What's inside:

- `CLAUDE.md`: the instructions the agent follows, covering child safety, saves that survive every update, iPad tips, and an animation and art guide. `AGENTS.md` points other agents to it.
- `libs/`: game, sound, animation and speech libraries, with their licenses.
- `docs/free-assets.md`: when to use each library, plus free art, icons, fonts and animated emoji, and the license each one needs.
- `index.html`: the home page that lists your games, newest first.
- `tests/`: automatic checks that the games load and play without errors.

## Start a game

Open your AI coding agent in an empty folder on your computer, then paste this, with your own idea at the end:

```text
Clone https://github.com/chigkim/game-starter into this folder, read its CLAUDE.md, and follow it. Then help me make a game: <your idea>
```

The agent will:

1. Copy the starter into the folder.
2. Ask you a few questions about your child and the game.
3. Build the game, test it, and add it to the home page.
4. Offer to put it online so your child can play it on a tablet (see [Play on an iPad](#play-on-an-ipad)).

For your next game or an update, open the agent in the same folder and just describe what you want.

## Ideas to paste

Use one of these as `<your idea>`, or write your own. The more you say about your child, the better the game fits.

- A counting game for my 4-year-old who loves trucks. Trucks drive in with blocks, and she taps to count them.
- A letter-sound game for my 5-year-old. A friendly owl says a sound, and he taps the matching letter. He can't read yet, so everything should be spoken.
- A dress-up game where my 3-year-old picks hats, shirts and shoes for a puppy. No reading, no losing, lots of silly animations.
- A gentle space game for my 6-year-old. Steer a little rocket with a finger, collect stars and visit planets. Nothing scary and no game over.
- A shape-sorting game for my 2-year-old with big shapes to drag into holes, bright colors and happy sounds.
- A times-tables practice game for my 8-year-old who loves dinosaurs. She earns dinosaur stickers and her progress is saved.

Good things to tell the agent:

- Your child's age, and whether they can read.
- What they love right now: animals, vehicles, a color, a favorite toy.
- What should happen when they get something wrong.
- Whether the game should save progress or rewards.
- Anything to avoid, such as loud sounds, timers or scary things.

## Play on an iPad

The free way to put your games online is GitHub Pages. The agent can do most of this for you.

1. Make a free account at [github.com](https://github.com), if you don't have one.
2. Install the GitHub command-line tool from [cli.github.com](https://cli.github.com) and run `gh auth login` once.
3. Ask the agent: "Put my games on GitHub and turn on GitHub Pages." It creates a public repo under your account and pushes the games.
4. On GitHub, open the repo, then go to Settings, then Pages. Under "Build and deployment," choose "Deploy from a branch," pick `main` and `/ (root)`, and save. The agent can do this with `gh` too.
5. After a minute or two, your games are at `https://<your-user-name>.github.io/<repo-name>/`.

On the iPad, open that link in Safari, tap the Share button, then "Add to Home Screen." The game opens like an app, and Safari is less likely to clear its saved progress.

A few things to know:

- A public repo means anyone with the link can play. The games don't collect any data, but don't put your child's full name or photos in them.
- The Home Screen app and Safari keep separate saves. Pick one and stick with it.
- Don't rename a game file after your child starts playing. A new name starts with an empty save.
- After an update, GitHub Pages can take a few minutes to show the new version. Closing and reopening the game helps.

## Libraries

Each game is one HTML file with its CSS and JavaScript inline. The libraries it uses are in `libs/`:

| File | Purpose |
|------|---------|
| `phaser-4.2.1.min.js` | Canvas game engine (rendering, input, physics) |
| `tone-15.1.22.js` | Synthesized music and sound effects |
| `zzfx-1.4.0.micro.min.js` | Tiny arcade-style sound effects |
| `nipplejs-1.0.4.min.js` | On-screen joystick for touch controls |
| `lz-string-1.5.0.min.js` | Compresses saved data |
| `gsap-3.15.0.min.js` | Smooth animation of SVG and HTML (GreenSock's free Standard license, see `gsap-3.15.0-LICENSE.md`) |
| `gsap-3.15.0-MorphSVGPlugin.min.js` | GSAP plugin that smoothly reshapes one SVG path into another, such as a bud opening. Load after `gsap-3.15.0.min.js` |
| `gsap-3.15.0-MotionPathPlugin.min.js` | GSAP plugin that moves things along a curved SVG path |
| `gsap-3.15.0-Physics2DPlugin.min.js` | GSAP plugin for thrown, falling and bouncing pieces such as confetti |
| `gsap-3.15.0-CustomEase.min.js` | GSAP plugin for hand-made easing curves. Load it before `CustomBounce` and `CustomWiggle` |
| `gsap-3.15.0-CustomBounce.min.js` | GSAP plugin for bounces with matching squash and stretch. Needs `CustomEase` |
| `gsap-3.15.0-CustomWiggle.min.js` | GSAP plugin for wobbles and shakes. Needs `CustomEase` |
| `easy-speech-2.4.0.js` | Fixes browser bugs in the built-in text-to-speech voices |
| `speech.js` | A shared narrator voice built on EasySpeech. Load `easy-speech-2.4.0.js` first, then call `Speech.speak(text)`, `Speech.speak(text, { after: true })` (waits for the line being said to finish), `Speech.stop()` and `Speech.setMuted(on)`. It reads math symbols as words and skips emoji. `Speech.setup({ sample })` sets what the picker says. `Speech.openPicker()` opens a voice and speed picker; the choice is saved in localStorage (`narratorVoice`) and shared by every game |

## Games

| File | Built with | Description |
|------|------------|-------------|

The agent adds a row here for each new game.

## Running locally

There is no build step. Open any HTML file in a browser, or serve the folder with any static file server:

```sh
npx serve .
# or
python -m http.server 8080
```

Sound and speech work best from a server, not from a file opened directly.

## Testing

The games are tested with [Playwright](https://playwright.dev) in headless Chromium. You only need this if you or the agent want to run the tests. The agent normally sets it up on its own.

- `tests/games.spec.js` checks the home page (every card has a version and date, and games are listed newest first) and runs the same smoke tests on every game: it loads without errors, starts and plays for a moment, draws on its canvas (Phaser games), and shows the same version as its card. Add an entry to its `GAMES` list for each game.
- `tests/libs.spec.js` checks that every library loads, and that the narrator's voice choice is saved in localStorage and sets no cookie.

Tests always run with speech off. Each test file removes `speechSynthesis` with `context.addInitScript` before the page loads. A new test file must do the same.

### Requirements

- Node.js 18 or newer (`node --version`)
- npm (comes with Node)
- About 550 MB of free disk space for the browsers

### 1. Install dependencies

From the repo root:

```sh
npm install
```

### 2. Install the browsers

```sh
npx playwright install chromium
```

This downloads two browsers into the Playwright cache (`~/Library/Caches/ms-playwright` on macOS, `~/.cache/ms-playwright` on Linux, `%LOCALAPPDATA%\ms-playwright` on Windows):

| Browser | Folder | Used for |
|---------|--------|----------|
| Chrome for Testing | `chromium-<rev>` | `--headed` runs |
| Chrome Headless Shell | `chromium_headless_shell-<rev>` | default headless runs |

If it finishes, go to step 3. If it freezes, see [Troubleshooting](#troubleshooting-browser-install-freezes).

### 3. Run the tests

```sh
npx playwright test                     # all tests, headless
npx playwright test tests/games.spec.js # one file
npx playwright test --headed            # show the browser
```

You don't need to start a server first. The config starts `npx serve . -l 8788` on its own, or reuses one already running on port 8788.

### Troubleshooting: browser install freezes

**Symptom:** `npx playwright install` downloads to 100% and then stops responding. The browser folder stays at about 448 KB and the `oopDownloadBrowserMain.js` process uses 0% CPU.

**Cause:** Playwright's built-in unzip step can hang on very new Node versions. This happened with Playwright 1.59.1 on Node 26.10 and was fixed by upgrading to Playwright 1.63.0. If you hit it on another version, try upgrading Playwright first (`npm install -D @playwright/test@latest playwright@latest`). The download itself is fine.

**Fix (macOS and Linux):** download and unzip the browsers yourself. On Linux, use `~/.cache/ms-playwright` instead of `~/Library/Caches/ms-playwright`.

1. Stop the stuck install and remove leftovers:

   ```sh
   pkill -f oopDownloadBrowserMain; pkill -f "playwright install"
   C=~/Library/Caches/ms-playwright
   rm -rf $C/__dirlock $C/chromium-* $C/chromium_headless_shell-* "$TMPDIR"/playwright-download-*
   ```

2. Get the exact folder names and download URLs for your Playwright version:

   ```sh
   npx playwright install --dry-run chromium
   ```

   For each browser, note the **Install location** and **Download url**. For Playwright 1.63.0 on Apple Silicon they are:

   | Install location | Download url |
   |------------------|--------------|
   | `chromium-1243` | `https://cdn.playwright.dev/builds/cft/153.0.8010.12/mac-arm64/chrome-mac-arm64.zip` |
   | `chromium_headless_shell-1243` | `https://cdn.playwright.dev/builds/cft/153.0.8010.12/mac-arm64/chrome-headless-shell-mac-arm64.zip` |

3. Download, check and unzip each one. Then create the two marker files Playwright looks for to know the install is finished:

   ```sh
   install_browser() {   # usage: install_browser <install-location> <download-url>
     curl -fL -o /tmp/pw-browser.zip "$2" &&
     unzip -tq /tmp/pw-browser.zip &&
     rm -rf "$1" && mkdir -p "$1" &&
     (cd "$1" && unzip -q /tmp/pw-browser.zip && touch INSTALLATION_COMPLETE DEPENDENCIES_VALIDATED) &&
     rm /tmp/pw-browser.zip
   }

   C=~/Library/Caches/ms-playwright
   install_browser $C/chromium-1243 \
     https://cdn.playwright.dev/builds/cft/153.0.8010.12/mac-arm64/chrome-mac-arm64.zip
   install_browser $C/chromium_headless_shell-1243 \
     https://cdn.playwright.dev/builds/cft/153.0.8010.12/mac-arm64/chrome-headless-shell-mac-arm64.zip
   ```

   Use the paths and URLs from step 2 if they differ from these.

4. Check the result:

   ```sh
   du -sh ~/Library/Caches/ms-playwright/*   # roughly 360 MB and 195 MB
   npx playwright test
   ```

If you upgrade Playwright, the revision number (for example `1243`) changes. Repeat these steps with the new values from `--dry-run`.

### Other common errors

| Error | Fix |
|-------|-----|
| `Cannot find module '@playwright/test'` | Run `npm install` (step 1). |
| `Executable doesn't exist at .../chromium_headless_shell-<rev>/...` | The headless shell is missing. Install it (step 2, or the manual fix above). |
| `Error: listen EADDRINUSE :::8788` | Something else is using port 8788. Stop it, or change the port in `playwright.config.js`. |
| `DeprecationWarning: module.register() is deprecated` | Harmless warning on new Node versions. You can ignore it. |

## License

The starter is MIT licensed (see `LICENSE`). Each library in `libs/` keeps its own license, in the file next to it.
