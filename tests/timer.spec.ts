import { test, expect } from '@playwright/test';

test('has expected retro timer title and looks correct', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Analog Audio Timer');

  // Visual regression test
  await expect(page).toHaveScreenshot('retro-timer-default.png');
});

test('timer updates when preset is clicked', async ({ page }) => {
  await page.goto('/');

  // By default it should be 25:00
  const timerDisplay = page.locator('.font-mono.text-6xl');
  await expect(timerDisplay).toHaveText('25:00');

  // Click 15m preset
  const preset15 = page.getByRole('button', { name: /15m/ });
  await preset15.click();

  // Assert time changed to 15:00
  await expect(timerDisplay).toHaveText('15:00');
});

test('timer starts when play is clicked', async ({ page }) => {
  await page.goto('/');

  const playButton = page.getByRole('button', { name: /PLAY|PAUSE/ }).first();
  await expect(playButton).toContainText('PLAY');
  await playButton.click();

  // The button text should change to PAUSE
  await expect(playButton).toContainText('PAUSE');

  // Wait for 1s and check if time decremented (it starts at 25:00 -> 24:59)
  await page.waitForTimeout(1100);

  const timerDisplay = page.locator('.font-mono.text-6xl');
  await expect(timerDisplay).toHaveText('24:59');
});
