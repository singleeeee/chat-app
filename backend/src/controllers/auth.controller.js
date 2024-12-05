import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import { generateToken } from '../lib/utils.js'
import cloudinary from '../lib/cloudinary.js'
import { successResponse, errorResponse } from '../lib/responseHandler.js'

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body
  try {
    if (!fullName || !email || !password) return res.status(400).json(errorResponse(400, "所有字段都是必需的"))

    if (password.length < 6) {
      return res.status(400).json(errorResponse(400, "密码不少于六位字符"))
    }

    const user = await User.findOne({ email })

    if (user) return res.status(400).json(errorResponse(400, '邮箱已存在'))

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({ fullName, email, password: hashedPassword })

    if (newUser) {
      generateToken(newUser._id, res)
      await newUser.save();

      const userData = {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      }

      res.status(201).json(successResponse(userData, '注册成功'))

    } else {
      res.status(400).json(errorResponse(400, '注册失败'))
    }

  } catch (error) {
    console.log('注册报错了', error)
    res.status(500).json(errorResponse(500, '注册失败'))
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body
  try {
    if (!email || !password) return res.status(400).json(errorResponse(400, "所有字段都是必需的"))

    const user = await User.findOne({ email })

    if (!user) return res.status(400).json(errorResponse(400, "用户不存在"))

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) return res.status(400).json(errorResponse(400, "密码错误"))

    generateToken(user._id, res)

    const userData = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    }

    res.status(200).json(successResponse(userData, '登录成功'))
  } catch (error) {
    console.log('登录报错了', error)
    res.status(500).json(errorResponse(500, '登录失败'))
  }
}

export const logout = (req, res) => {
  try {
    res.cookie('jwt', '', { maxAge: 0 })
    res.status(200).json(successResponse(null, '登出成功'))
  } catch (error) {
    console.log('登出报错了', error)
    res.status(500).json(errorResponse(500, '登出失败'))
  }
}

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body
    const userId = req.user._id

    if(!profilePic) return res.status(400).json(errorResponse(400, "请上传头像"))

    const uploadResponse = await cloudinary.uploader.upload(profilePic)

    const updateUser = await User.findByIdAndUpdate(userId, {profilePic: uploadResponse.secure_url}, {new: true})

    res.status(200).json(successResponse(updateUser, '更新头像成功'))
  } catch (error) {
    console.log('更新头像报错了', error)
    res.status(500).json(errorResponse(500, "更新头像失败"))
  }
}

export const checkAuth = async (req,res) => {
  try {
    res.status(200).json(successResponse(req.user, '验证成功'))
  } catch (error) {
    console.log('检查授权报错了', error)
    res.status(500).json(errorResponse(500, '服务器内部错误'))
  }
}

