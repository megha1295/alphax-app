import { User } from '../entities/User'

export interface LoginCredentials {
  username: string
  password: string
}

export interface LoginResult {
  accessToken: string
  refreshToken: string
}

export interface AuthRepository {
  login(credentials: LoginCredentials): Promise<LoginResult>
  getCurrentUser(accessToken: string): Promise<User>
}
