import { join } from 'path'
import puppeteer from 'puppeteer'
import { waitForTimeout } from './helpers'

describe('Screenshots', () => {
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

  test('Full window screenshot', async () => {
    await page.screenshot({
      path: join(__dirname, './ss/full.png'),
      fullPage: true
    })
  }, 20_000)

  test('Screenshot in an area', async () => {
    await waitForTimeout(1000)
    await page.screenshot({
      clip: {
        x: 210,
        y: 270,
        width: 500,
        height: 175
      },
      path: join(__dirname, './ss/inAnArea.png')
    })
  }, 20_000)

  test('Screenshot with transparent background', async () => {
    await page.evaluate(() => {
      document.body.style.background = 'transparent'
    })
    await page.screenshot({
      omitBackground: true,
      path: join(__dirname, './ss/withoutBackground.png')
    })
  })

  test('Screenshot to an element', async () => {
    const title = await page.waitForSelector(
      'body > div > div > div > div > div > div'
    )

    await title?.screenshot({
      omitBackground: true,
      path: join(__dirname, './ss/ofAnElement.png')
    })
  })
})
