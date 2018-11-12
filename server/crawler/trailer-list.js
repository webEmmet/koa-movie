const puppeteer = require('puppeteer')

const url = 'https://movie.douban.com/tag/#/?sort=U&range=6,10&tags='

;
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url)

  await page.waitForSelector('.more')
  for (let i = 0; i < 1; i++) {
    await page.click('.more')
  }
  const result = await page.evaluate(() => {
    const $ = window.$
    const items = Array.from($('.list-wp a'))
    let list = []

    items.forEach(item => {
      const it = $(item)
      const title = it.find('.title').text()
      const doubanId = it.find('div').data('id')
      const poster = it.find('img').attr('src').replace('s_ratio_poster', 'm_ratio_poster')
      const rate = it.find('.rate').text()

      list.push({
        doubanId,
        title,
        rate,
        poster
      })
    })

    return list
  })
  await browser.close()
  process.send({ result })
  process.exit(0)
})()