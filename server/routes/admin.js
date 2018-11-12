const mongoose = require('mongoose')
const {
  post,
  get,
  auth,
  admin,
  del,
  controller,
  required
} = require('../lib/decorators')
const {
  checkPassword
} = require('../service/admin')
const {
  getAllMovies,
  findAndRemove
} = require('../service/movie')


@controller('/admin')
export class adminController {
  
  @post('/login')
  @required({
    body: ['email', 'password']
  })
  async login(ctx, next) {
    const {
      email,
      password
    } = ctx.request.body
    const matchData = await checkPassword(email, password)

    // 如果用户不存在
    if (!matchData.user) {
      return ctx.body = {
        success: false,
        error: '用户不存在'
      }
    }

    // 如果用户的密码正确
    if (matchData.match) {
      ctx.session.user = {
        _id: matchData.user._id,
        email: matchData.user.email,
        role: matchData.user.role,
        username: matchData.user.username
      }
      return ctx.body = {
        success: true
      }
    }
    // 用户密码不正确
    ctx.body = {
      success: false,
      error: '用户密码不正确'
    }
  }

  @get('/movie/list')
  @auth
  @admin('admin')
  async getMovieList (ctx, next) {
    console.log('admin movie list')
    const movies = await getAllMovies()

    ctx.body = {
      success: true,
      data: movies
    }
  }

  @del('/movies')
  @required({
    query: ['id']
  })
  async remove (ctx, next) {
    const id = ctx.query.id

    await findAndRemove(id)

    const movies = await getAllMovies()

    ctx.body = {
      data: movies,
      success: true
    }
  }
}
