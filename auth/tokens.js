const jwt = require('jsonwebtoken')
const helper = require('../helpers/serialize')
const _ = require('lodash')
const models = require('../models')
const dotenv = require('dotenv')
dotenv.config({path:  process.cwd() + '/.env'})

const secret = process.env.SECRET

const createTokens = async (user) => {
  const createToken = await jwt.sign(
    {
      user: _.pick(user, 'id'),
    },
    secret,
    {
      expiresIn: '5m',
    },
  )

  const createRefreshToken = await jwt.sign(
    {
      user: _.pick(user, 'id'),
    },
    secret,
    {
      expiresIn: '2h',
    },
  )

  const verifyToken = jwt.decode(createToken, secret)
  const verifyRefresh = jwt.decode(createRefreshToken, secret)

  return {
    accessToken: createToken,
    refreshToken: createRefreshToken,
    accessTokenExpiredAt: verifyToken.exp*1000,
    refreshTokenExpiredAt: verifyRefresh.exp*1000
  }
}

const refreshTokens = async (refreshToken) => {
  const user = await getUserByToken(refreshToken)
  if (user) {
    return {
      ...helper.serializeUser(user),
      ...(await createTokens(user, secret)),
    }
  } else {
      return {}
  }
}

const getUserByToken = async (token) => {
  let userId = -1 
  try {
    userId = jwt.verify(token, secret).user.id
  } catch (error) {
    return {}
  }
  const user = await models.getUserById(userId)
  return user
}

module.exports = {
  createTokens,
  refreshTokens,
  getUserByToken
}