import { test, expect, type Page } from '@playwright/test'

const URL = '/courses/c1/lessons/l1'
const noHScroll = async (page: Page) =>
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)

test.describe('phone', () => {
  test.use({ viewport: { width: 390, height: 844 } })
  test('tabs switch, editor text survives, no h-scroll', async ({ page }) => {
    await page.goto(URL)
    await page.getByRole('tab', { name: 'Code' }).click()
    await expect(page.getByTestId('panel-editor')).toBeVisible()
    await expect(page.getByTestId('panel-lesson')).toBeHidden()
    const code = page.getByLabel('Code')
    await code.click()
    await page.keyboard.press('Control+End')
    await page.keyboard.type('\nx = 1')
    await noHScroll(page)
    await page.getByRole('tab', { name: 'Lesson' }).click()
    await expect(page.getByTestId('panel-lesson')).toBeVisible()
    await expect(page.getByTestId('panel-editor')).toBeHidden()
    await noHScroll(page)
    await page.getByRole('tab', { name: 'Code' }).click()
    await expect(code).toContainText('x = 1')
    await page.getByRole('button', { name: 'Run', exact: true }).click()
    await page.getByRole('tab', { name: 'Output' }).click()
    await expect(page.getByTestId('output-text')).toContainText('x = 1')
    await noHScroll(page)
  })
})

test.describe('tablet', () => {
  test.use({ viewport: { width: 820, height: 1180 } })
  test('lesson collapsible, code/output switch, no h-scroll', async ({ page }) => {
    await page.goto(URL)
    await expect(page.getByTestId('panel-lesson')).toBeVisible()
    await page.getByRole('button', { name: 'Hide lesson' }).click()
    await expect(page.getByTestId('panel-lesson')).toBeHidden()
    const code = page.getByLabel('Code')
    await code.click()
    await page.keyboard.press('Control+End')
    await page.keyboard.type('\ny = 2')
    await page.getByRole('tab', { name: 'Output' }).click()
    await expect(page.getByTestId('panel-editor')).toBeHidden()
    await page.getByRole('tab', { name: 'Code' }).click()
    await expect(code).toContainText('y = 2')
    await noHScroll(page)
  })
})
