import { create } from 'zustand'
import { User } from '../types/User.ts'
import { signupApi, loginApi, checkAuthStatusApi, logoutApi, updateProfileApi } from "../api/auth"
import toast from 'react-hot-toast'

interface AuthStore {
  authUser: User | null
  isLoggingIn: boolean,
  isSigningUp: boolean,
  isCheckingAuth: boolean,
  isUpdatingProfile: boolean,
  checkAuthStatus: () => Promise<void>,
  signup: (user: User & { password: string }) => Promise<void>,
  login: (email: string, password: string) => Promise<void>,
  logout: () => Promise<void>,
  updateProfile: (profilePic: string) => Promise<void>,
}

export const useAuthStore = create<AuthStore>((set) => ({
  authUser: null, 
  isLoggingIn: false,
  isSigningUp: false,
  isCheckingAuth: true,
  isUpdatingProfile: false,

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
    } else {
      toast.error(res.message)
    }

    set({ isLoggingIn: false })
  },
  logout: async () => {
    const res = await logoutApi()
    if(res.success){
      set({ authUser: null })
      toast.success('退出登录成功')
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
  }
}))

