const puppeteer = require('puppeteer')
const mongoose = require('mongoose')
const base = 'https://movie.douban.com/subject/'

process.on('message', async movies => {

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (let i = 0; i < movies.length; i++) {
    let doubanId = movies[i].doubanId
    await page.goto(base + doubanId)
    const result = await page.evaluate(() => {
      const $ = window.$
      const it = $('.related-pic-video')

      let data = {}
      if (it && it.length > 0) {
        const el = it[0]

        data.link = $(el).attr('href')
        data.cover = $(el).attr('style').slice(21, -2)
      }

      return data
    })
    let video;
    if (result.link) {
      await page.goto(result.link)
      video = await page.evaluate(() => {
        const $ = window.$
        const it = $('source')
        if (it && it.length > 0) {
          return it.attr('src')
        }
        return ''
      })
    }
    const data = {
      video,
      doubanId,
      cover: result.cover
    }
    process.send(data)
  }


  await browser.close()
  process.exit(0)
})