// @ts-check
// Checks that every library in libs/ loads, and that the narrator's saved voice uses localStorage, not a cookie.
const { test, expect } = require('@playwright/test');

// Speech off: with no speechSynthesis, the narrator stays silent.
test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => Object.defineProperty(window, 'speechSynthesis', { value: undefined }));
});

const LIBS = [
  ['phaser-4.2.1.min.js', () => !!window.Phaser],
  ['tone-15.1.22.js', () => !!window.Tone],
  ['zzfx-1.4.0.micro.min.js', () => typeof zzfx === 'function'], // a top-level let, so not on window
  ['nipplejs-1.0.4.min.js', () => !!window.nipplejs],
  ['lz-string-1.5.0.min.js', () => !!window.LZString],
  ['gsap-3.15.0.min.js', () => !!window.gsap],
  ['gsap-3.15.0-MorphSVGPlugin.min.js', () => !!window.MorphSVGPlugin],
  ['gsap-3.15.0-MotionPathPlugin.min.js', () => !!window.MotionPathPlugin],
  ['gsap-3.15.0-Physics2DPlugin.min.js', () => !!window.Physics2DPlugin],
  ['gsap-3.15.0-CustomEase.min.js', () => !!window.CustomEase],
  ['gsap-3.15.0-CustomBounce.min.js', () => !!window.CustomBounce],
  ['gsap-3.15.0-CustomWiggle.min.js', () => !!window.CustomWiggle],
  ['easy-speech-2.4.0.js', () => !!window.EasySpeech],
  ['speech.js', () => !!window.Speech],
];

test('every library loads without errors', async ({ page }) => {
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  await page.goto('/index.html');
  for (const [file, check] of LIBS) {
    await page.addScriptTag({ url: '/libs/' + file });
    expect(await page.evaluate(check), file).toBe(true);
  }
  expect(errors).toEqual([]);
});

test('the voice picker saves to localStorage and sets no cookie', async ({ page }) => {
  await page.goto('/index.html');
  await page.addScriptTag({ url: '/libs/easy-speech-2.4.0.js' });
  await page.addScriptTag({ url: '/libs/speech.js' });
  await page.evaluate(() => window.Speech.openPicker());
  await page.locator('[data-speed="slow"]').click();
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('narratorVoice')));
  expect(saved.speed).toBe('slow');
  expect(await page.evaluate(() => document.cookie)).toBe('');

  await page.reload();
  await page.addScriptTag({ url: '/libs/easy-speech-2.4.0.js' });
  await page.addScriptTag({ url: '/libs/speech.js' });
  await page.evaluate(() => window.Speech.openPicker());
  await expect(page.locator('[data-speed="slow"]')).toHaveClass(/on/);
});
