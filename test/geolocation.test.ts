import puppeteer from 'puppeteer'

import { waitForTimeout } from './helpers'

describe('Geolocation', () => {
  let browser: puppeteer.Browser
  let page: puppeteer.Page

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null
    })
    page = await browser.newPage()
  }, 15_000)

  afterAll(async () => {
    await browser.close()
  })

  test('Geolocation change', async () => {
    const context = browser.defaultBrowserContext()

    context.overridePermissions(
      'https://chercher.tech/practice/geo-location.html',
      ['geolocation']
    )
    await page.setGeolocation({
      latitude: 90,
      longitude: 20
    })
    await page.goto('https://chercher.tech/practice/geo-location.html', {
      waitUntil: 'networkidle2'
    })
    await waitForTimeout(2000)
  })
})
