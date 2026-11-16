import { test, expect, type Page } from '@playwright/test'

const LESSON = '/courses/sql-fundamentals/lessons/lesson-02'
const WRONG = 'SELECT name FROM employees;'
const CORRECT = 'SELECT name FROM employees WHERE salary > 60000;'

async function setCode(page: Page, sql: string) {
  const code = page.getByLabel('Code')
  await code.click()
  await page.keyboard.press('Control+a')
  await page.keyboard.press('Delete')
  await page.keyboard.type(sql)
  await expect(code).toContainText(sql.slice(0, 20))
}

test.describe('SQL lesson end-to-end', () => {
  test('Run shows the query result and Submit grades wrong then correct', async ({ page }) => {
    await page.goto(LESSON)
    await expect(page.getByLabel('Code')).toContainText('SELECT name FROM employees')
    const output = page.getByTestId('output-text')

    // Run: the starter query returns all six employees
    await page.getByRole('button', { name: 'Run', exact: true }).click()
    await expect(output).toHaveText('6 row(s)')
    await expect(page.getByTestId('entry-table').locator('td').first()).not.toBeEmpty()
    await expect(page.getByTestId('entry-table').locator('tbody tr')).toHaveCount(6)

    // Submit a wrong query: failure details with expected and actual
    await setCode(page, WRONG)
    await page.getByRole('button', { name: 'Submit', exact: true }).click()
    await expect(output).toContainText('FAIL returns names with salary above 60000')
    await expect(output).toContainText('expected:')
    await expect(output).toContainText('actual:')
    await expect(output).not.toContainText('PASS')

    // Submit the correct query: pass
    await setCode(page, CORRECT)
    await page.getByRole('button', { name: 'Submit', exact: true }).click()
    await expect(output).toContainText('PASS returns names with salary above 60000')
    await expect(output).not.toContainText('FAIL')
  })

  test('Submit resets the database: a user-created table is gone afterwards', async ({ page }) => {
    await page.goto(LESSON)
    const output = page.getByTestId('output-text')
    const probe = "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'scratch';"

    await setCode(page, 'CREATE TABLE scratch (x INTEGER);')
    await page.getByRole('button', { name: 'Run', exact: true }).click()
    await expect(output).toHaveText('Query OK.')

    await setCode(page, probe)
    await page.getByRole('button', { name: 'Run', exact: true }).click()
    await expect(output).toHaveText('1 row(s)')

    // Submit resets the engine before grading, so the scratch table no longer exists
    await setCode(page, CORRECT)
    await page.getByRole('button', { name: 'Submit', exact: true }).click()
    await expect(output).toContainText('PASS')

    // sqlite error for a missing table; a zero-row result would only show "Query OK."
    await setCode(page, 'SELECT * FROM scratch;')
    await page.getByRole('button', { name: 'Run', exact: true }).click()
    await expect(output).toContainText('no such table: scratch')
  })
})
