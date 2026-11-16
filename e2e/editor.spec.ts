import { test, expect } from '@playwright/test'

test('type in editor, undo restores previous text', async ({ page }) => {
  await page.goto('/courses/python-fundamentals/lessons/lesson-01')
  const code = page.getByLabel('Code')
  await expect(code).toHaveText('# Print Hello, World!')
  await expect(page.getByRole('tab', { name: 'lesson-01.py' })).toHaveAttribute('aria-selected', 'true')

  await code.click()
  await page.keyboard.press('Control+End')
  await page.keyboard.type('\nx = 1')
  await expect(code).toContainText('x = 1')

  await page.keyboard.press('Control+z')
  await expect(code).toHaveText('# Print Hello, World!')
  await page.keyboard.press('Control+y')
  await expect(code).toContainText('x = 1')
})
