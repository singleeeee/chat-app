import { useState } from "react"
import { useAuthStore } from "../store/useAuthStore"
import { MessagesSquare, User, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react"
import { Link } from "react-router-dom"
import AuthImagePattern from "../components/AuthImagePattern"
import toast,{ Toaster } from 'react-hot-toast'
import type { User as UserType } from "../types/User"

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState<UserType & { password: string }>({
    fullName: '',
    email: '',
    password: '',
  })

  const { isSigningUp, signup } = useAuthStore()
  const validateForm = () => {
    if(!formData.fullName.trim()) toast.error('请输入姓名')
    if(!formData.email.trim()) toast.error('请输入邮箱')
    if(!/^\S+@\S+$/.test(formData.email)) toast.error('请输入有效的邮箱')
    if(!formData.password?.trim()) toast.error('请输入密码')
    if(formData.password!.length < 6) toast.error('密码长度至少为6位')

    return true
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validateForm()) return
    signup(formData)
  }
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">

        <div className="w-full max-w-md space-y-8">
          {/* logo and title */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300"
              >
                <MessagesSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 mt-2">
                创建你的账户
              </h1>
              <p className="text-base-content/60">以免费账号开始</p>

            </div>

            {/* form */}
            <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">姓名</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">邮箱</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">密码</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full pl-10`}
                  placeholder="••••••••"
                  autoComplete="off"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "创建账号"
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-base-content/60">
             已有账号?{" "}
              <Link to="/login" className="link link-primary">
                点击登录
              </Link>
            </p>
          </div>
          </div>
        </div>
      </div>

      {/* right side */}
      <AuthImagePattern title="加入我们" subtitle="分享喜悦，分享幸福，尽情享受聊天吧。" />

      <Toaster />
    </div>

  )
}

export default SignupPage
