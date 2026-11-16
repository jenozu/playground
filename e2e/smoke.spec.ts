import { test, expect } from '@playwright/test'

test('app loads with no console errors', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto('/')
  await expect(page.locator('#root')).not.toBeEmpty()
  expect(errors).toEqual([])
})
