const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')

/**
 * 获取到所有的电影
 * @param {*} type 电影的类型
 * @param {*} year 电影的年份
 */
export const getAllMovies = async (type, year) => {
  let query = {}
  if (type) {
    query.movieTypes = {
      $in: [type]
    }
  }
  if (year) {
    query.year = year
  }
  const movies = await Movie.find(query)
  return movies
}

/**
 * 获取到某个电影
 * @param {id} id 电影的唯一标识_id
 */
export const getMovieDetail = async (id) => {
  const movie = await Movie.findOne({
    _id: id
  })
  return movie
}

/**
 * 根据电影的movieTypes信息获取到相关的电影
 * @param {movie} movie 电影的具体信息
 */
export const getRelativeMoview = async (movie) => {
  const movies = await Movie.find({
    movieTypes: {
      $in: movie.movieTypes
    }
  })
  return movies
}

export const findAndRemove = async (id) => {
  const movie = await Movie.findOne({_id: id})

  if (movie) {
    await movie.remove()
  }
}

