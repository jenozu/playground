import { test, expect } from '@playwright/test'

test('type in editor, undo restores previous text', async ({ page }) => {
  await page.goto('/courses/c1/lessons/l1')
  const code = page.getByLabel('Code')
  await expect(code).toHaveText('print("hello")')
  await expect(page.getByRole('tab', { name: 'main.py' })).toHaveAttribute('aria-selected', 'true')

  await code.click()
  await page.keyboard.press('Control+End')
  await page.keyboard.type('\nx = 1')
  await expect(code).toContainText('x = 1')

  await page.keyboard.press('Control+z')
  await expect(code).toHaveText('print("hello")')
  await page.keyboard.press('Control+y')
  await expect(code).toContainText('x = 1')
})
