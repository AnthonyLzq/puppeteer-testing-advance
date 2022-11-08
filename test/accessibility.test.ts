import puppeteer from 'puppeteer'
import { AxePuppeteer } from '@axe-core/puppeteer'

describe('Accessibility', () => {
  let browser: puppeteer.Browser
  let page: puppeteer.Page

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null
    })
    page = await browser.newPage()
    await page.goto(process.env.SITE_URL as string, {
      waitUntil: 'networkidle2'
    })
  }, 15_000)

  afterAll(async () => {
    await browser.close()
  })

  test('Accessibility snapshot', async () => {
    await page.waitForSelector('img')
    const snapshot = await page.accessibility.snapshot()

    console.log('snapshot', snapshot)
  })

  test('Accessibility snapshot with axe', async () => {
    await page.setBypassCSP(true)
    await page.goto(process.env.SITE_URL as string, {
      waitUntil: 'networkidle2'
    })
    await page.waitForSelector('img')
    const result = await new AxePuppeteer(page).analyze()

    console.log('result.violations[0]', result.violations[0])
  })
})
