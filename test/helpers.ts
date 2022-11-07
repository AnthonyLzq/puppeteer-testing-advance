import { MouseButton, Page } from 'puppeteer'

type ClickOptions = {
  delay?: number
  button?: MouseButton
  clickCount?: number
}

type TypeOptions = {
  delay: number
}

const click = async ({
  page,
  selector,
  opt
}: {
  page: Page
  selector: string
  opt: ClickOptions
}): Promise<void> => {
  await page.waitForSelector(selector)
  await page.click(selector, opt)
}

const doubleClick = async ({
  page,
  selector,
  opt = {}
}: {
  page: Page
  selector: string
  opt: ClickOptions
}): Promise<void> => {
  await page.waitForSelector(selector)
  await page.click(selector, {
    ...opt,
    clickCount: 2
  })
}

const getText = async (
  page: Page,
  selector: string
): Promise<string | null> => {
  await page.waitForSelector(selector)

  return page.$eval(selector, element => element.textContent)
}

const type = async ({
  page,
  selector,
  text,
  opt = { delay: 350 }
}: {
  page: Page
  selector: string
  text: string
  opt?: TypeOptions
}): Promise<void> => {
  await page.waitForSelector(selector)
  await page.type(selector, text, opt)
}

const getCount = async (page: Page, selector: string): Promise<number> => {
  await page.waitForSelector(selector)

  return page.$$eval(selector, element => element.length)
}

const waitForTimeout = async (timeout: number): Promise<void> => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), timeout))
}

export { click, doubleClick, getText, type, getCount, waitForTimeout }
