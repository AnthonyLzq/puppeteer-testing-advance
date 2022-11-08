import puppeteer from 'puppeteer'

import { waitForTimeout } from './helpers'

describe('Accessibility', () => {
  let browser: puppeteer.Browser
  let page: puppeteer.Page

  beforeAll(async () => {
    browser = await puppeteer.launch({
      ignoreHTTPSErrors: true,
      headless: false,
      defaultViewport: null,
      product: 'firefox'
    })
    page = await browser.newPage()
    await page.goto(process.env.SITE_URL as string)
  }, 45_000)

  afterAll(async () => {
    await browser.close()
  })

  test('Go to page with Firefox', async () => {
    await waitForTimeout(2000)
  }, 10_000)
})
