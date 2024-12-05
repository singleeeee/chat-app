import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('数据库连接成功')
  } catch (error) {
    console.log('数据库连接失败', error)
  }
}
