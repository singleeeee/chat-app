import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'
import { errorResponse } from '../lib/responseHandler.js'

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.jwt

    if(!token) 
      return res.status(401).json(errorResponse(401, '未授权-请携带token'))

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    const user = await User.findById(decoded.userId).select("-password");

    if(!user) {
      return res.status(404).json(errorResponse(404, "找不到用户"))
    }

    req.user = user
    next()
  } catch (error) {
    console.log('token校验中间件出错了', error)
    return res.status(401).json(errorResponse(401, '未授权-无效的token'))
  }
}