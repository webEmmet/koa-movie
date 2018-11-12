const { Route } = require('../lib/decorators')
const { resolve } = require('path')

const router = app => {
  const apiPath = resolve(__dirname, '../routes')
  const router = new Route(app, apiPath)

  router.init()
}

module.exports = {
  router
}