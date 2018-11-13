const Koa = require('koa')
const { resolve } = require('path')
const cors = require('koa2-cors')
const R = require('ramda')
const MIDDLEWARES = ['common', 'router']

const useMiddlewares = (app) => {
  R.map(
    R.compose(
      R.forEachObjIndexed(
        initWith => initWith(app)
      ),
      require,
      name => resolve(__dirname, `./middlewares/${name}`)
  ))(MIDDLEWARES)
}

const {
  connect,
  initSchemas,
  initAdmin
} = require('./database/init')

;
(async () => {
  await connect()
  await initSchemas()
  await initAdmin()
  await require('./tasks/movie')
  await require('./tasks/api.js')
  await require('./tasks/trailer')
  await require('./tasks/qiniu')
  const app = new Koa()
  app.use(cors())
  await useMiddlewares(app)
  app.listen(4000)
})()