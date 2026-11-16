import { test, expect } from '@playwright/test'

test('passing Submit persists completion across reload', async ({ page }) => {
  await page.goto('/courses/sql-fundamentals/lessons/lesson-02')
  const code = page.getByLabel('Code')
  await code.click()
  await page.keyboard.press('Control+a')
  await page.keyboard.press('Delete')
  await page.keyboard.type('SELECT name FROM employees WHERE salary > 60000;')
  await expect(page.getByText('Lesson 0%')).toBeVisible()
  await page.getByRole('button', { name: 'Submit', exact: true }).click()
  await expect(page.getByText('Lesson 100%')).toBeVisible()
  await page.reload()
  await expect(page.getByText('Lesson 100%')).toBeVisible()
})
