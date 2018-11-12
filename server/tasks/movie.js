const cp = require('child_process')
const path = require('path')
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')

const script = path.resolve(__dirname, '../crawler/trailer-list.js')
  
;
(async () => {
  const child = cp.fork(script, [])
  let invoked = false

  child.on('error', err => {
    if (invoked) return
    invoked = true
    console.error(err)
  })

  child.on('exit', code => {
    if (invoked) return
    invoked = true
    let err = code === 0 ? null : new Error('exit code ' + data)
    console.info(err)
  })

  child.on('message', data => {
    let result = data.result
    result.forEach(async item => {
      let movie = await Movie.findOne({
        doubanId: item.doubanId
      })
      if (!movie) {
        movie = new Movie(item)
        await movie.save()
      }
    })
  })

})()