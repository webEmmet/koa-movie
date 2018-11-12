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
  // require('./tasks/movie')
  // require('./tasks/api.js')
  // require('./tasks/trailer')
  // require('./tasks/qiniu')
  const app = new Koa()
  app.use(cors())
  await useMiddlewares(app)
  app.listen(3000)
})()