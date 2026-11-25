import { test, expect } from '@playwright/test'

test('note persists after reload; bookmark shows on dashboard', async ({ page }) => {
  await page.goto('/courses/sql-fundamentals/lessons/lesson-02')
  await page.getByLabel('Notes', { exact: true }).fill('remember joins')
  await page.waitForTimeout(800)
  await page.getByRole('button', { name: 'Bookmark lesson' }).click()
  await expect(page.getByRole('button', { name: 'Bookmark lesson' })).toHaveAttribute('aria-pressed', 'true')
  await page.reload()
  await expect(page.getByLabel('Notes', { exact: true })).toHaveValue('remember joins')
  await page.goto('/')
  await expect(page.locator('section', { has: page.getByRole('heading', { name: 'Bookmarks' }) }).getByRole('link')).toHaveCount(1)
})
