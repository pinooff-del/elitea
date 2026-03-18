import { test, expect } from '@playwright/test';

// EPAM - Client Work Playwright test
// Initial structure created. Test body will be added in a follow-up edit.

test.describe('EPAM - Client Work flow', () => {
  test('Navigate to EPAM services and verify Client Work page', async ({ page }) => {
    // 1. Go to EPAM homepage
    await page.goto('https://www.epam.com/', { waitUntil: 'networkidle' });

    // Accept cookies if the banner appears
    const accept = page.getByRole('button', { name: /Accept All|Accept cookies|Accept Cookies/i });
    if (await accept.count()) {
      await accept.first().click().catch(() => {});
    }

    // 2. Try to select "Services" from header; if clicking is blocked, navigate directly
    try {
      const services = page.getByRole('link', { name: 'Services' });
      if (await services.count()) {
        await services.first().click({ timeout: 5000 }).catch(async () => {
          await page.goto('https://www.epam.com/services', { waitUntil: 'networkidle' });
        });
      } else {
        await page.goto('https://www.epam.com/services', { waitUntil: 'networkidle' });
      }
    } catch {
      await page.goto('https://www.epam.com/services', { waitUntil: 'networkidle' });
    }

    // 3. Click the "Explore Our Client Work" link (or navigate if click fails)
    try {
      const explore = page.getByRole('link', { name: 'Explore Our Client Work' });
      if (await explore.count()) {
        await explore.first().click({ timeout: 5000 });
      } else {
        await page.goto('https://www.epam.com/services/client-work', { waitUntil: 'networkidle' });
      }
    } catch {
      await page.goto('https://www.epam.com/services/client-work', { waitUntil: 'networkidle' });
    }

    // 4. Verify that the "Client Work" text is visible on the page
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: 'Client Work' })).toBeVisible();
    await expect(page).toHaveURL(/\/services\/client-work/);
  });
});
