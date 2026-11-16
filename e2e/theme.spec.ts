import { test, expect } from '@playwright/test'

test('dark theme persists across reload', async ({ page }) => {
  await page.goto('/settings')
  await page.getByLabel('Theme').selectOption('dark')
  await expect(page.locator('html')).toHaveClass(/dark/)
  await page.reload()
  await expect(page.locator('html')).toHaveClass(/dark/)
  await expect(page.getByLabel('Theme')).toHaveValue('dark')
})
