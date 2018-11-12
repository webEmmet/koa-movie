const chalk = require('chalk')
const mongoose = require('mongoose')
const {resolve} = require('path')
const db = 'mongodb://127.0.0.1:27017/movie'
const glob = require('glob')

mongoose.Promise = global.Promise

exports.initSchemas = () => {
  glob.sync(resolve(__dirname, './schema', '**/*.js')).forEach(require)
}

exports.initAdmin = async () => {
  const User = mongoose.model('User')
  let user = await User.findOne({
    username: 'admin'
  })

  if (!user) {
    const user = new User({
      username: 'admin',
      email: 'admin@admin.com',
      password: 'admin',
      role: 'admin'
    })

    await user.save()
  }
}

exports.connect = () => {

  let maxConnectTimes = 0
  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV !== 'production') {
      mongoose.set('debug', true)
    }
    toConnect()

    mongoose.connection.on('disconnected', () => {
      maxConnectTimes++
      if (maxConnectTimes < 5) {
        toConnect()
      } else {
        throw new Error('数据库挂了吧，快去修吧骚年')
      }
    })

    mongoose.connection.on('error', err => {
      maxConnectTimes++
      if (maxConnectTimes < 5) {
        toConnect()
      } else {
        throw new Error('数据库挂了吧，快去修吧骚年')
      }
    })

    mongoose.connection.once('open', () => {
      resolve()
      console.info(`${chalk.green('MongoDB Connected successfully!')}`)
    })
  })

}
/**
 * 数据库连接以及配置
 */
function toConnect() {
  return mongoose.connect(db, {
    useNewUrlParser: true
  })
}