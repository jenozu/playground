import { test, expect, type Page } from '@playwright/test'

const LESSON = '/courses/python-fundamentals/lessons/lesson-01'

async function setCode(page: Page, src: string) {
  const code = page.getByLabel('Code')
  await code.click()
  await page.keyboard.press('Control+a')
  await page.keyboard.press('Delete')
  await page.keyboard.type(src)
  await expect(code).toContainText(src.slice(0, 15))
}

test.describe('Python Run end-to-end', () => {
  // First run downloads and boots Pyodide (~10 MB); must also work on a cold Vite cache.
  test.setTimeout(150_000)

  test('print shows output, NameError is shown once, and a second run works', async ({ page }) => {
    await page.goto(LESSON)
    await expect(page.getByLabel('Code')).toContainText('Print Hello')
    const output = page.getByTestId('output-text')
    const runBtn = page.getByRole('button', { name: 'Run', exact: true })

    await setCode(page, "print('hi')")
    await runBtn.click()
    await expect(output).toHaveText('hi', { timeout: 120_000 })

    await setCode(page, 'print(undefined_name)')
    await runBtn.click()
    await expect(output).toContainText("NameError: name 'undefined_name' is not defined")
    await expect(output).toContainText('File "<exec>", line 1')
    expect((await output.innerText()).split('NameError').length).toBe(2)

    await setCode(page, "print('a', end='')\nx = 2\nprint(x * 21)")
    await runBtn.click()
    await expect(output).toHaveText('a42')

    // Fresh globals each run: x from the previous run is gone
    await setCode(page, 'print(x)')
    await runBtn.click()
    await expect(output).toContainText("NameError: name 'x' is not defined")
  })

  test('Stop ends an infinite loop, UI stays responsive, next run works; timeout also recovers', async ({ page }) => {
    await page.goto(LESSON)
    await expect(page.getByLabel('Code')).toContainText('Print Hello')
    const output = page.getByTestId('output-text')
    const runBtn = page.getByRole('button', { name: 'Run', exact: true })
    const stopBtn = page.getByRole('button', { name: 'Stop', exact: true })
    await expect(stopBtn).toBeDisabled()

    await setCode(page, 'while True: pass')
    await runBtn.click()
    await expect(output).toHaveText('Running...', { timeout: 120_000 })
    await expect(stopBtn).toBeEnabled()
    await stopBtn.click()
    await expect(output).toContainText('stopped', { timeout: 5_000 })
    // UI still responds
    const t0 = Date.now()
    await page.getByRole('button', { name: 'Clear output' }).click()
    await expect(output).not.toContainText('stopped', { timeout: 1_000 })
    expect(Date.now() - t0).toBeLessThan(1_000)

    await setCode(page, "print('after stop')")
    await runBtn.click()
    await expect(output).toHaveText('after stop', { timeout: 120_000 })

    // Default python timeout (10s) kills the loop too
    await setCode(page, 'while True: pass')
    await runBtn.click()
    await expect(output).toContainText('Timed out after 10s', { timeout: 30_000 })
    await setCode(page, "print('after timeout')")
    await runBtn.click()
    await expect(output).toHaveText('after timeout', { timeout: 120_000 })
  })
})
