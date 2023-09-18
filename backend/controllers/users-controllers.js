const { v4: uuidv4 } = require('uuid')
const { validationResult } = require('express-validator')

const HttpError = require('../models/http-error')
const User = require('../models/userSchema')

const DUMMY_USERS = [
  {
    id: 'u1',
    name: 'Piotr',
    email: 'a@a.a',
    password: '123456',
  },
]

const getAllUsers = (req, res, next) => {
  const users = DUMMY_USERS

  if (!users || users.length === 0) {
    throw new HttpError('Could not find any user', 404)
  }

  res.json({ users })
}

const signup = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const error = new HttpError(
      'Invalid inputs passed, please check your data.',
      422
    )
    return next(error)
  }

  const { name, email, password, places } = req.body

  let existingUser

  try {
    existingUser = await User.findOne({ email: email })
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    )
    return next(error)
  }

  if (existingUser) {
    const error = new HttpError(
      'User exist already, please login instead.',
      422
    )
    return next(error)
  }

  const newUser = new User({
    name,
    email,
    password,
    image:
      'https://static.vecteezy.com/system/resources/thumbnails/002/002/403/small/man-with-beard-avatar-character-isolated-icon-free-vector.jpg',
    places,
  })

  try {
    await newUser.save()
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    )
    return next(error)
  }

  res.status(201).json({ user: newUser.toObject({ getters: true }) })
}

const login = async (req, res, next) => {
  const { email, password } = req.body

  let existingUser

  try {
    existingUser = await User.findOne({ email: email })
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    )
    return next(error)
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError('Invalid credentials, Could not log in.', 401)
    return next(error)
  }

  res.status(200).json({ message: 'Logged in' })
}

exports.getAllUsers = getAllUsers
exports.signup = signup
exports.login = login
