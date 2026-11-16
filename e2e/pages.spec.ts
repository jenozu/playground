import { test, expect } from '@playwright/test'

for (const [path, h] of [['/', 'Dashboard'], ['/courses', 'My Courses']]) {
  test(`${h} renders without console errors`, async ({ page }) => {
    const errors: string[] = []
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
    page.on('pageerror', (e) => errors.push(e.message))
    await page.goto(path)
    await expect(page.getByRole('heading', { level: 1, name: h })).toBeVisible()
    expect(errors).toEqual([])
  })
}

test('My Courses lists the bundled sample courses', async ({ page }) => {
  await page.goto('/courses')
  await expect(page.getByText('SQL Fundamentals')).toBeVisible()
  await expect(page.getByText('Python Fundamentals')).toBeVisible()
})
