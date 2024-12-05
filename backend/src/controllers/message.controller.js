import User from '../models/user.model.js'
import Message from '../models/message.model.js'
import { successResponse, errorResponse } from '../lib/responseHandler.js'


export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id
    const filteredUsers = await User.find({_id: { $ne: loggedInUserId}}).select('-password')

    res.status(200).json(successResponse(filteredUsers))
  } catch (error) {
    console.error('获取用户侧边栏信息错误', error)
    res.status(500).json(errorResponse(500, '服务器内部错误'))
  }
}

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params
    const myId = req.user._id

    if (!userToChatId || !userToChatId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json(errorResponse(400, '无效的用户ID格式'))
    }

    const messages = await Message.find({
      $or: [
        {senderId: myId, receiverId: userToChatId},
        {senderId: userToChatId, receiverId: myId}
      ]
    }).sort({createdAt: 1})

    res.status(200).json(successResponse(messages))
  } catch (error) {
    console.error('获取消息错误', error)
    res.status(500).json(errorResponse(500, '服务器内部错误'))
  }
}

export const sendMessage = async (req, res) => {
  try {
    const { id: receiverId } = req.params
    const senderId = req.user._id
    const { text, image } = req.body

    let imgUrl = ''
    if (image) {
      imgUrl = await uploadImageToCloudinary(image)
    }

    const newMessage = new Message({senderId, receiverId, text, image: imgUrl})
    await newMessage.save()

    //todo: socket.io

    res.status(201).json(newMessage)
  } catch (error) {
    console.error('发送消息错误', error)
    res.status(500).json(errorResponse(500, '服务器内部错误'))
  }
}