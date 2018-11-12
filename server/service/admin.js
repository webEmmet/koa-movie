const mongoose = require('mongoose')
const User = mongoose.model('User')


/**
 * 检查用户的密码是否正确
 * @param {email} email 
 * @param {password} password 
 */
export const checkPassword = async (email, password) => {
  let match = false
  const user = await User.findOne({
    email
  })

  if (user) {
    match = user.comparePassword(password, user.password)
  }
  return {
    match,
    user
  }
}