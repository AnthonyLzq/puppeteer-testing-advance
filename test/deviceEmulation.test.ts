import puppeteer, { KnownDevices } from 'puppeteer'

describe('Device emulation', () => {
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
  }, 10_000)

  afterAll(async () => {
    await browser.close()
  })

  test('Manual emulation', async () => {
    await page.emulate({
      viewport: {
        width: 375,
        height: 667,
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
        isLandscape: true
      },
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 '
    })
  }, 20_000)

  test('Desktop emulation', async () => {
    await page.setViewport({
      width: 1560,
      height: 800
    })
    await page.waitForTimeout(3000)
  }, 20_000)

  test('Tablet emulation using puppeteer devices', async () => {
    const tablet = KnownDevices['iPad Pro']

    await page.emulate(tablet)
    await page.waitForTimeout(3000)
  }, 20_000)

  test('Phone emulation using puppeteer devices', async () => {
    const iPhone = KnownDevices['iPhone 12 Pro Max']

    await page.emulate(iPhone)
    await page.waitForTimeout(3000)
  }, 20_000)
})
