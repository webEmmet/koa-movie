const Router = require('koa-router')
const glob = require('glob')
const {
  resolve
} = require('path')
const symbolPrefix = Symbol('prefix')
const _ = require('lodash')
const isArray = c => _.isArray(c) ? c : [c]
const routerMap = new Map()
const R = require('ramda')
export class Route {
  constructor(app, apiPath) {
    this.app = app
    this.apiPath = apiPath // routes文件夹的路径
    this.router = new Router()
  }
  init() {
    glob.sync(resolve(this.apiPath, './**/*.js')).forEach(require)
    for (let [conf, controller] of routerMap) {
      // conf是配置， target, method, path
      // controller 是挂载的目标类的方法
      const controllers = isArray(controller)
      let prefixPath = conf.target[symbolPrefix] // /api/v0/movies
      if (prefixPath) prefixPath = normalizePath(prefixPath) // 转换成标准的url格式
      const routerPath = prefixPath + conf.path // path = /api/v0/movies/ || /api/v0/movies/:id
      this.router[conf.method](routerPath, ...controllers) // router.get(path, cb)
    }

    this.app.use(this.router.routes())
    this.app.use(this.router.allowedMethods())
  }
}
const normalizePath = path => path.startsWith('/') ? path : `/${path}`


const router = conf => (target, key) => {
  conf.path = normalizePath(conf.path)
  routerMap.set({
    target, // 挂载的目标类
    ...conf // 方式方法
  }, target[key]) // 挂载的目标类的方法
  // routerMap的格式
  // {
  //   { 
  //     target: movieController { [Symbol(prefix)]: '/api/v0/movies' },
  //       method: 'get', 
  //     path: '/' 
  //     } => [Function: getMovies]
  // }
}
// 给装饰的类添加
export const controller = path => target => (target.prototype[symbolPrefix] = path)

export const get = path => router({
  method: 'get',
  path: path
})

export const post = path => router({
  method: 'post',
  path: path
})

export const put = path => router({
  method: 'put',
  path: path
})

export const del = path => router({
  method: 'delete',
  path: path
})

export const use = path => router({
  method: 'use',
  path: path
})

export const all = path => router({
  method: 'all',
  path: path
})


const decorate = (args, middleware) => {
  let [ target, key, descriptor ] = args

  target[key] = isArray(target[key])
  target[key].unshift(middleware)

  return descriptor
}

const convert = middleware => (...args) => decorate(args, middleware)

export const auth = convert(async (ctx, next) => {
  if (!ctx.session.user) {
    return (
      ctx.body = {
        success: false,
        code: 401,
        err: '登录信息失效，请重新登录'
      }
    )
    
  }
  await next()
})

export const required = rules => convert(async (ctx, next) => {
  let errors = []
  const checkRules = R.forEachObjIndexed(
    (value, key) => {
      errors = R.filter(i => !R.has(i, ctx, ctx.request[key]))(value)
    }
  )
  checkRules(rules)
  if (errors.length) {
    ctx.body = {
      success: false,
      code: 412,
      err: `${errors.join(',')} is required`
    }
  }
  
  await next()
})

export const admin = roleExpected => convert(async (ctx, next) => {
  const { role } = ctx.session.user

  if (!role || role !== roleExpected) {
    return (
      ctx.body = {
        success: false,
        code: 403,
        err: '你没有权限，来错地方了'
      }
    )
  }

  await next()
})