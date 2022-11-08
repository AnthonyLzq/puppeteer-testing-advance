import puppeteer from 'puppeteer'

import { click, getText, type, waitForTimeout } from './helpers'

describe('Full flow', () => {
  let browser: puppeteer.Browser
  let page: puppeteer.Page

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null
    })
    page = await browser.newPage()
    await page.goto('https://phptravels.net/login', {
      waitUntil: 'networkidle2'
    })
  }, 25_000)

  afterAll(async () => {
    await browser.close()
  })

  test('Login', async () => {
    await type({
      page,
      selector: 'input[name="email"]',
      text: 'user@phptravels.com'
    })
    await type({
      page,
      selector: 'input[name="password"]',
      text: 'demouser'
    })
    await click({ page, selector: 'button[type="submit"]' })
    await waitForTimeout(7_500)
  }, 25_000)

  test('Validate login', async () => {
    const title = await getText(page, 'h2')

    expect(title).toContain('Hi,')
  }, 25_000)

  test('Logout', async () => {
    await click({ page, selector: 'ul > li:nth-child(5) > a' })

    expect(page.url()).toBe('https://phptravels.net/visa')
  }, 25_000)
})
