import { test, expect } from '@playwright/test'

test('edited code is restored after reload; Reset brings back starter', async ({ page }) => {
  page.on('dialog', (d) => void d.accept())
  await page.goto('/courses/sql-fundamentals/lessons/lesson-02')
  const code = page.getByLabel('Code')
  await code.click()
  await page.keyboard.press('Control+a')
  await page.keyboard.type('SELECT 42 AS answer;')
  await page.getByRole('button', { name: 'Save', exact: true }).click()
  await expect(page.getByRole('status')).toHaveText('Saved')
  await page.reload()
  await expect(page.getByLabel('Code')).toContainText('SELECT 42 AS answer;')
  await page.getByRole('button', { name: 'Reset', exact: true }).click()
  await expect(page.getByLabel('Code')).not.toContainText('SELECT 42 AS answer;')
})
