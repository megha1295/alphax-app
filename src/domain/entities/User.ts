export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  gender: string
  image: string
}

export interface AuthSession {
  accessToken: string
  refreshToken: string
  isVerified: boolean
}
