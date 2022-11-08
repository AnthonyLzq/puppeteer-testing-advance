import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import puppeteer from 'puppeteer'

describe('Performance', () => {
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

  test('Measure performance automation', async () => {
    await page.waitForSelector('img')

    const automationPerformanceMetrics = await page.metrics()
    console.log('automationPerformanceMetrics', automationPerformanceMetrics)
  }, 20_000)

  test('Measure page performance', async () => {
    await page.waitForSelector('img')

    const pagePerformanceMetrics = await page.evaluate(() =>
      JSON.parse(JSON.stringify(window.performance))
    )
    console.log('pagePerformanceMetrics', pagePerformanceMetrics)
  }, 20_000)

  test('Measure first load page performance', async () => {
    await page.tracing.start({
      path: join(__dirname, './performance/profile.json')
    })
    await page.goto(process.env.SITE_URL as string, {
      waitUntil: 'networkidle2'
    })
    await page.tracing.stop()
  }, 20_000)

  test('Measure first load page performance with screenshots', async () => {
    await page.tracing.start({
      path: join(__dirname, './performance/profile.json'),
      screenshots: true
    })
    await page.goto(process.env.SITE_URL as string, {
      waitUntil: 'networkidle2'
    })
    await page.tracing.stop()

    const tracing = JSON.parse(
      readFileSync(join(__dirname, './performance/profile.json'), 'utf-8')
    )
    const traceScreenshots = tracing.traceEvents.filter(
      (event: any) =>
        Boolean(event.args) &&
        Boolean(event.args.snapshot) &&
        event.cat === 'disabled-by-default-devtools.screenshot' &&
        event.name === 'Screenshot'
    )

    traceScreenshots.forEach((ss: any, index: number) => {
      writeFileSync(
        join(__dirname, `./performance/ss/trace-screenshot-${index}.png`),
        ss.args.snapshot,
        'base64'
      )
    })
  }, 20_000)

  test('Measure first paint and first contentful paint', async () => {
    const navigationPromise = page.waitForNavigation()
    await page.goto(process.env.SITE_URL as string, {
      waitUntil: 'networkidle2'
    })
    await navigationPromise

    const firstPaint = JSON.parse(
      await page.evaluate(() =>
        JSON.stringify(performance.getEntriesByName('first-paint'))
      )
    )
    console.log('firstPaint', firstPaint)
    const firstContentfulPaint = JSON.parse(
      await page.evaluate(() =>
        JSON.stringify(performance.getEntriesByName('first-contentful-paint'))
      )
    )
    console.log('firstContentfulPaint', firstContentfulPaint)
  }, 20_000)

  test('Measure FPS', async () => {
    const devtoolsProtocolClient = await page.target().createCDPSession()

    await devtoolsProtocolClient.send('Overlay.setShowFPSCounter', {
      show: true
    })
    await page.goto(process.env.SITE_URL as string, {
      waitUntil: 'networkidle2'
    })
    await page.screenshot({
      path: join(__dirname, './performance/ss/fps.png')
    })
  }, 20_000)
})
