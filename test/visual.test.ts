import puppeteer, { KnownDevices } from 'puppeteer'
import { toMatchImageSnapshot } from 'jest-image-snapshot'

expect.extend({ toMatchImageSnapshot })

describe('Visual test', () => {
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

  test('All page snapshot', async () => {
    await page.waitForSelector('img')

    const ss = await page.screenshot()

    expect(ss).toMatchImageSnapshot({
      failureThreshold: 0.12,
      failureThresholdType: 'percent'
    })
  })

  test('One element snapshot', async () => {
    const title = await page.waitForSelector(
      'body > div > div > div > div > div > div'
    )
    const ss = await title?.screenshot()

    expect(ss).toMatchImageSnapshot({
      failureThreshold: 0.12,
      failureThresholdType: 'percent'
    })
  })

  test('Snapshot in tablet', async () => {
    const tablet = KnownDevices['iPad Pro']

    await page.emulate(tablet)
    await page.waitForSelector('img')

    const ss = await page.screenshot()

    expect(ss).toMatchImageSnapshot({
      failureThreshold: 0.12,
      failureThresholdType: 'percent'
    })
  }, 20_000)

  test('Remove element before snapshot', async () => {
    await page.waitForSelector('canvas')
    await page.evaluate(() => document.querySelector('canvas')?.remove())

    const ss = await page.screenshot()

    expect(ss).toMatchImageSnapshot()
  })
})
