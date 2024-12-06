import { create } from 'zustand'
import { User } from '../types/User.ts'
import { signupApi, loginApi, checkAuthStatusApi, logoutApi, updateProfileApi } from "../api/auth"
import toast from 'react-hot-toast'
import { Socket, io } from 'socket.io-client'

const BASE_URL = import.meta.env.VITE_SOCKET_URL

interface AuthStore {
  authUser: User | null
  isLoggingIn: boolean,
  isSigningUp: boolean,
  isCheckingAuth: boolean,
  isUpdatingProfile: boolean,
  onlineUsers: string[],
  socket: Socket | null,
  checkAuthStatus: () => Promise<void>,
  signup: (user: User & { password: string }) => Promise<void>,
  login: (email: string, password: string) => Promise<void>,
  logout: () => Promise<void>,
  updateProfile: (profilePic: string) => Promise<void>,
  connectSocket: () => void,
  disConnectSocket: () => void
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  authUser: null, 
  isLoggingIn: false,
  isSigningUp: false,
  isCheckingAuth: true,
  isUpdatingProfile: false,
  onlineUsers: [],
  socket: null,
  checkAuthStatus: async () => {
      set({ isCheckingAuth: true })
      const res = await checkAuthStatusApi();
      if(res.success){
      set({ authUser: res.data });
      } else {
        console.error(res, '检查认证状态失败');
      } 

    set({ isCheckingAuth: false })
  },
  signup: async (user: User & { password: string }) => {
      set({ isSigningUp: true })
      const res = await signupApi(user)
      if(res.success){
        set({ authUser: res.data })
        toast.success('注册成功')
        get().connectSocket() 
      } else {
        toast.error(res.message)
      } 

    set({ isSigningUp: false })
  },
  login: async (email: string, password: string) => {
    set({ isLoggingIn: true })
    const res = await loginApi({email, password})
    if(res.success){
      set({ authUser: res.data })
      toast.success('登录成功')
      get().connectSocket()
    } else {
      toast.error(res.message)
    }

    set({ isLoggingIn: false });
  },
  logout: async () => {
    const res = await logoutApi()
    if(res.success){
      set({ authUser: null })
      toast.success('退出登录成功')
      get().disConnectSocket()
    } else {
      toast.error(res.message)
    }
  },
  updateProfile: async (profilePic: string) => {
    set({ isUpdatingProfile: true })
    const res = await updateProfileApi(profilePic)
    if(res.success){
      set({ authUser: res.data })
      toast.success('更新成功')
    } else {
      toast.error(res.message)
    }

    set({ isUpdatingProfile: false })
  },
  connectSocket: () => {
    const { authUser } = get();
    if(!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id
      },
      withCredentials: true,
    });
    socket.connect()
    console.log(BASE_URL, 'socket')
    console.log('连接成功')
    set({ socket })

    socket.on('getOnlineUsers', (userIds: string[]) => {
      set({ onlineUsers: userIds })
    })
  },
  disConnectSocket: () =>{
    console.log('断开连接')
    if(get().socket?.connected) get().socket?.disconnect()
  }
}))

