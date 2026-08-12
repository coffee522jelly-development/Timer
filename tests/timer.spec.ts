import { test, expect } from '@playwright/test';

test('has expected retro timer title and looks correct', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('STEEP TIMER');

  // Visual regression test
  await expect(page).toHaveScreenshot('retro-timer-default.png');
});

test('timer updates when preset mode knob is rotated', async ({ page }) => {
  await page.goto('/');

  // First toggle into preset mode because it defaults to normal mode now
  const modeButton = page.locator('button[aria-label="Toggle Preset Mode"]');
  await modeButton.click();

  // Wait for presets to load (default is POMODORO 25m)
  const timerDisplay = page.locator('.font-mono.text-7xl');
  await expect(timerDisplay).toHaveText('025:00', { timeout: 10000 });

  // Grab the knob bounding box
  const knob = page.locator('div[role="slider"]');
  const box = await knob.boundingBox();
  expect(box).not.toBeNull();
  if (!box) return;

  // Calculate center
  const centerX = box.x + box.width / 2;
  const centerY = box.y + box.height / 2;

  // Start dragging from top-left quadrant of knob
  await page.mouse.move(centerX - 50, centerY - 50);
  await page.mouse.down();

  // Drag to right to increase value
  await page.mouse.move(centerX + 50, centerY + 50, { steps: 10 });
  await page.mouse.up();

  // The time should change since it selects the next preset (e.g. LONG 30m)
  await expect(timerDisplay).not.toHaveText('025:00');
});

test('timer starts when play is clicked', async ({ page }) => {
  await page.goto('/');

  const playButton = page.getByRole('button', { name: 'Play or Pause' });
  await expect(playButton).toContainText('PLAY');
  await playButton.click();

  // The button text should change to PAUSE
  await expect(playButton).toContainText('PAUSE');

  // Wait for 1s and check if time decremented (starts at 25:00 -> 24:59)
  await page.waitForTimeout(1100);

  const timerDisplay = page.locator('.font-mono.text-7xl');
  await expect(timerDisplay).toHaveText('024:59');
});
