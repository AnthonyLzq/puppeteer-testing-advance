import { join } from 'path'
import puppeteer from 'puppeteer'

describe('PDF generation', () => {
  let browser: puppeteer.Browser
  let page: puppeteer.Page
  const css = `<style>h1 { font-size: 10px; margin-left: 30px; }</style>`

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

  test('Full size PDF', async () => {
    await page.pdf({
      path: join(__dirname, './pdf/full.pdf'),
      format: 'A4',
      displayHeaderFooter: true,
      headerTemplate: `${css} <h1>My first pdf with puppeteer</h1>`,
      footerTemplate: `${css} <h1>Page <span class="pageNumber"></span> of <span class="totalPages"></span></h1>`,
      margin: {
        top: '100px',
        bottom: '150px',
        right: '30px',
        left: '30px'
      }
    })
  })

  test('Full size PDF in landscape', async () => {
    await page.pdf({
      path: join(__dirname, './pdf/fullLandscape.pdf'),
      format: 'A4',
      displayHeaderFooter: true,
      headerTemplate: `${css} <h1>My first pdf with puppeteer</h1>`,
      footerTemplate: `${css} <h1>Page <span class="pageNumber"></span> of <span class="totalPages"></span></h1>`,
      margin: {
        top: '100px',
        bottom: '150px',
        right: '30px',
        left: '30px'
      },
      landscape: true
    })
  })
})
