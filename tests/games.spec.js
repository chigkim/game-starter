// @ts-check
// Smoke tests for every game: loads cleanly, starts, runs, draws, and its
// version badge matches the card on the home page. Also checks the home page.
const fs = require('fs');
const path = require('path');
const { test, expect } = require('@playwright/test');

// Speech off: with no speechSynthesis, the narrator stays silent. A new test file must do the same.
test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => Object.defineProperty(window, 'speechSynthesis', { value: undefined }));
});

// Browser-level passive-listener warning, not a game bug
const IGNORED = /preventDefault inside passive/;

// Add one entry per game. For example:
// {
//   file: 'dino-dig.html',
//   canvas: false,                     // true for Phaser games
//   start: async page => { await page.locator('#startBtn').click(); },
//   started: async page => { await expect(page.locator('#gameScreen')).toHaveClass(/active/); },
//   play: async page => { await page.locator('.dig-spot').first().click(); },
// },
const GAMES = [
];

function trackErrors(page) {
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  return () => errors.filter(e => !IGNORED.test(e));
}

// Reads "v{N} - Updated ..." from text, tolerating &nbsp; around the dash
function versionIn(text) {
  const m = text.replace(/\u00a0/g, ' ').match(/v(\d+)\s*-\s*Updated/);
  return m ? Number(m[1]) : null;
}

// Reads "Updated YYYY-MM-DD HH:MM" as a sortable string
function updatedIn(text) {
  const m = text.replace(/\u00a0/g, ' ').match(/Updated\s+(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})/);
  return m ? `${m[1]} ${m[2]}` : null;
}

test.describe('index.html', () => {
  test('loads without JS errors', async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto('/index.html');
    expect(errors()).toEqual([]);
  });

  test('every card links to a game file and has a version and date', async ({ page }) => {
    await page.goto('/index.html');
    for (const card of await page.locator('a.game-card').all()) {
      const href = await card.getAttribute('href');
      expect(fs.existsSync(path.join(__dirname, '..', href)), `${href} exists`).toBe(true);
      const title = await card.locator('h3').innerText();
      expect(versionIn(title), `${href} version`).not.toBeNull();
      expect(updatedIn(title), `${href} date`).not.toBeNull();
    }
  });

  test('games are listed newest first', async ({ page }) => {
    await page.goto('/index.html');
    const dates = (await page.locator('a.game-card h3').allInnerTexts()).map(updatedIn);
    expect(dates).toEqual([...dates].sort().reverse());
  });

  test('every game in GAMES has a card', async ({ page }) => {
    await page.goto('/index.html');
    for (const game of GAMES) await expect(page.locator(`a.game-card[href="${game.file}"]`)).toHaveCount(1);
  });
});

for (const game of GAMES) {
  test.describe(game.file, () => {
    test('loads without JS errors', async ({ page }) => {
      const errors = trackErrors(page);
      await page.goto('/' + game.file);
      await page.waitForLoadState('networkidle');
      expect(errors()).toEqual([]);
    });

    test('starts and plays for 1.5s without JS errors', async ({ page }) => {
      const errors = trackErrors(page);
      await page.goto('/' + game.file);
      await game.start(page);
      await game.started(page);
      await game.play(page);
      await page.waitForTimeout(1500);
      expect(errors()).toEqual([]);
    });

    if (game.canvas) {
      test('canvas is sized and draws a scene', async ({ page }) => {
        await page.goto('/' + game.file);
        await game.start(page);
        await page.waitForTimeout(500);
        const canvas = page.locator('canvas');
        await expect(canvas).toBeVisible();
        const box = await canvas.boundingBox();
        expect(box.width).toBeGreaterThan(100);
        expect(box.height).toBeGreaterThan(100);
        // A blank or single-color canvas compresses to a tiny PNG
        const png = await canvas.screenshot();
        expect(png.length).toBeGreaterThan(10000);
      });
    }

    test('version badge matches the home page card', async ({ page }) => {
      await page.goto('/index.html');
      const card = page.locator(`a.game-card[href="${game.file}"] h3`);
      const expected = versionIn(await card.innerText());
      expect(expected).not.toBeNull();

      await page.goto('/' + game.file);
      expect(versionIn(await page.locator('body').innerText())).toBe(expected);
    });
  });
}
