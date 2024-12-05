export interface SignupData {
  fullName: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  _id: string;
  fullName: string;
  email: string;
  profilePic: string;
}

export interface LoginData {
  email: string;
  password: string;
}
