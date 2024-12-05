import service from '../../axios'
import { SignupData, SignupResponse, LoginData } from './types'

export function signupApi(data: SignupData) {
  return service.post<SignupResponse>('/auth/signup', { data })
}

export function loginApi(data: LoginData) {
  return service.post<SignupResponse>('/auth/login', { data })
}

export function logoutApi() {
  return service.post('/auth/logout')
}

export function checkAuthStatusApi() {
  return service.get<SignupResponse>('/auth/check')
}

export function updateProfileApi(profilePic: string) {
  return service.put<SignupResponse>('/auth/update-profile', { data: {profilePic} })
}