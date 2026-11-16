import { test, expect, type Page } from '@playwright/test'

const LESSON = '/courses/python-fundamentals/lessons/lesson-05'

async function setCode(page: Page, src: string) {
  const code = page.getByLabel('Code')
  await code.click()
  await page.keyboard.press('Control+a')
  await page.keyboard.press('Delete')
  await page.keyboard.type(src)
  await expect(code).toContainText(src.slice(0, 12))
}

test('python-fundamentals coding lesson: run, submit wrong, submit right', async ({ page }) => {
  test.setTimeout(150_000)
  await page.goto(LESSON)
  const output = page.getByTestId('output-text')
  const run = page.getByRole('button', { name: 'Run', exact: true })
  const submit = page.getByRole('button', { name: 'Submit', exact: true })

  await setCode(page, 'print(2 * 3)')
  await run.click()
  await expect(output).toHaveText('6', { timeout: 120_000 })

  await submit.click()
  await expect(output).toContainText('FAIL square(-2) is 4', { timeout: 60_000 })

  await setCode(page, 'def square(n):\n    return n * n\n')
  await submit.click()
  await expect(output).toContainText('PASS square(-2) is 4', { timeout: 60_000 })
  await expect(output).not.toContainText('FAIL')
})
