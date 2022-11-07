import puppeteer from 'puppeteer'
import { getCount } from './helpers'

describe('Incognito mode', () => {
  let browser: puppeteer.Browser
  let page: puppeteer.Page

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null
    })
    const context = await browser.createIncognitoBrowserContext()
    page = await context.newPage()
    await page.goto(process.env.SITE_URL as string, {
      waitUntil: 'networkidle2'
    })
  }, 10_000)

  afterAll(async () => {
    await browser.close()
  })

  it('should have at least one image', async () => {
    const images = await getCount(page, 'img')

    expect(images).toBeGreaterThanOrEqual(1)
  }, 20_000)
})
