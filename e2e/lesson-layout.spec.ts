import { test, expect, type Page } from '@playwright/test'

const URL = '/courses/c1/lessons/l1'
const widths = async (page: Page) => {
  const w = await Promise.all(
    ['lesson', 'editor', 'output'].map(async (id) => (await page.getByTestId(`panel-${id}`).boundingBox())!.width),
  )
  const total = w.reduce((a, b) => a + b, 0)
  return w.map((x) => (x / total) * 100)
}
const near = (a: number[], b: number[]) => a.forEach((x, i) => expect(Math.abs(x - b[i])).toBeLessThan(3))

test.use({ viewport: { width: 1440, height: 900 } })

test('three panels, drag, persist, restore', async ({ page }) => {
  await page.goto(URL)
  await expect(page.getByTestId('panel-output')).toBeVisible()
  near(await widths(page), [33, 34, 33])

  const box = (await page.getByTestId('handle-0').boundingBox())!
  await page.mouse.move(box.x + box.width / 2, box.y + 100)
  await page.mouse.down()
  await page.mouse.move(box.x + 200, box.y + 100, { steps: 5 })
  await page.mouse.up()
  const dragged = await widths(page)
  expect(dragged[0]).toBeGreaterThan(40)

  await page.waitForTimeout(800)
  await page.reload()
  await expect(page.getByTestId('panel-output')).toBeVisible()
  near(await widths(page), dragged)

  await page.getByRole('button', { name: 'Restore default layout' }).click()
  near(await widths(page), [33, 34, 33])
})
