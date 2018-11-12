const mongoose = require('mongoose')

const Schema = mongoose.Schema
const {Mixed, ObjectId} = Schema.Types

const movieSchema = new Schema({
  doubanId: {
    unique: true,
    type: String
  },
  category: [{
    type: ObjectId,
    ref: 'Category'
  }],
  poster: String,
  title: String,
  rate: Number,
  summary: String,
  video: String,
  cover: String,

  videoKey: String,
  coverKey: String,
  posterKey: String,

  rawTitle: String,
  movieTypes: [String],
  pubdate: Mixed,
  year: Number,

  tags: [String],
  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  }
})
/**
 * 在保存之前判断此数据是否存在，根据存在与否修改meta时间
 */
movieSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()
})

module.expoerts = mongoose.model('Movie', movieSchema)