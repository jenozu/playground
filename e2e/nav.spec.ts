import { test, expect } from '@playwright/test'

const pages = [
  ['Dashboard', 'Dashboard'],
  ['My Courses', 'My Courses'],
  ['Practice', 'Practice'],
  ['Projects', 'Projects'],
  ['Progress', 'Progress'],
  ['Settings', 'Settings'],
]

for (const [name, w] of [['desktop', 1440], ['mobile', 390]] as const) {
  test(`each nav link opens its page (${name})`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: 900 })
    await page.goto('/')
    for (const [link, heading] of pages) {
      if (w < 768) await page.getByRole('button', { name: 'Menu' }).click()
      await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: link }).click()
      await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible()
      if (w < 768) await page.getByRole('button', { name: 'Menu' }).click()
      await expect(page.getByRole('link', { name: link })).toHaveAttribute('aria-current', 'page')
      if (w < 768) await page.getByRole('button', { name: 'Menu' }).click()
    }
  })
}

test('unknown route shows 404', async ({ page }) => {
  await page.goto('/nope')
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible()
})
