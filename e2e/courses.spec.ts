import { test, expect } from '@playwright/test'

test('sql lesson 1 shows markdown and starter; next crosses modules', async ({ page }) => {
  await page.goto('/courses/sql-fundamentals/lessons/lesson-01')
  await expect(page.getByRole('heading', { level: 1, name: 'SELECT basics' }).first()).toBeVisible()
  await expect(page.getByTestId('panel-lesson')).toContainText('A database stores data in')
  await page.getByRole('button', { name: 'Next' }).click() // lesson-02, coding
  await expect(page).toHaveURL(/lesson-02$/)
  await expect(page.getByLabel('Code')).toContainText('SELECT name FROM employees')
  await page.getByRole('button', { name: 'Next' }).click()
  await page.getByRole('button', { name: 'Next' }).click() // module 2
  await expect(page).not.toHaveURL(/lesson-0[123]$/)
  await page.getByRole('button', { name: 'Previous' }).click()
  await expect(page).toHaveURL(/lesson-03$/)
})

test('unknown ids show not-found; filter hides the other course', async ({ page }) => {
  await page.goto('/courses/sql-fundamentals/lessons/nope')
  await expect(page.getByRole('heading', { name: 'Lesson not found' })).toBeVisible()
  await page.goto('/courses')
  await expect(page.getByText('Python Fundamentals')).toBeVisible()
  await page.getByLabel('Language').selectOption('sql')
  await expect(page.getByText('Python Fundamentals')).toBeHidden()
  await expect(page.getByText('SQL Fundamentals')).toBeVisible()
  await page.getByRole('link', { name: 'SQL Fundamentals' }).click()
  await expect(page.getByRole('link', { name: 'SELECT basics' })).toBeVisible()
})
