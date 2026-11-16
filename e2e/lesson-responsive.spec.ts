import { test, expect, type Page } from '@playwright/test'

const URL = '/courses/python-fundamentals/lessons/lesson-01'
const SQL_URL = '/courses/sql-fundamentals/lessons/lesson-02'
const noHScroll = async (page: Page) =>
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)

test.describe('phone', () => {
  test.use({ viewport: { width: 390, height: 844 } })
  test('python lesson: run shows output in Output tab, no h-scroll', async ({ page }) => {
    test.setTimeout(150_000)
    await page.goto(URL)
    await page.getByRole('tab', { name: 'Code' }).click()
    const code = page.getByLabel('Code')
    await code.click()
    await page.keyboard.press('Control+a')
    await page.keyboard.press('Delete')
    await page.keyboard.type("print('hi')")
    await page.getByRole('button', { name: 'Run', exact: true }).click()
    await page.getByRole('tab', { name: 'Output' }).click()
    await expect(page.getByTestId('output-text')).toHaveText('hi', { timeout: 120_000 })
    await noHScroll(page)
  })
  test('sql lesson: tabs switch, editor text survives, no h-scroll', async ({ page }) => {
    await page.goto(SQL_URL)
    await page.getByRole('tab', { name: 'Code' }).click()
    await expect(page.getByTestId('panel-editor')).toBeVisible()
    await expect(page.getByTestId('panel-lesson')).toBeHidden()
    const code = page.getByLabel('Code')
    await code.click()
    await page.keyboard.press('Control+End')
    await page.keyboard.type('\n-- x = 1')
    await noHScroll(page)
    await page.getByRole('tab', { name: 'Lesson', exact: true }).click()
    await expect(page.getByTestId('panel-lesson')).toBeVisible()
    await expect(page.getByTestId('panel-editor')).toBeHidden()
    await noHScroll(page)
    await page.getByRole('tab', { name: 'Code' }).click()
    await expect(code).toContainText('-- x = 1')
    await page.getByRole('button', { name: 'Run', exact: true }).click()
    await page.getByRole('tab', { name: 'Output' }).click()
    await expect(page.getByTestId('output-text')).toHaveText('6 row(s)')
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
