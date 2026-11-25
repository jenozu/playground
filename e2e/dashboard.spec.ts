import { test, expect } from '@playwright/test'

test('dashboard shows recent completion, recommends next, continue resumes', async ({ page }) => {
  await page.goto('/courses/sql-fundamentals/lessons/lesson-02')
  const code = page.getByLabel('Code')
  await code.click()
  await page.keyboard.press('Control+a')
  await page.keyboard.press('Delete')
  await page.keyboard.type('SELECT name FROM employees WHERE salary > 60000;')
  await page.getByRole('button', { name: 'Submit', exact: true }).click()
  await expect(page.getByText('Lesson 100%')).toBeVisible()
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Recently completed' })).toBeVisible()
  await expect(page.getByRole('link', { name: /^Continue:/ })).toBeVisible()
  await page.getByRole('link', { name: /^Continue:/ }).click()
  await expect(page).toHaveURL(/\/courses\/sql-fundamentals\/lessons\//)
})
