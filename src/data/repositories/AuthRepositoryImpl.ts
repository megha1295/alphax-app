import { AuthRepository, LoginCredentials, LoginResult } from '@/domain/repositories/AuthRepository'
import { User } from '@/domain/entities/User'
import { loginRequest, getCurrentUserRequest } from '../api/authApi'

export class AuthRepositoryImpl implements AuthRepository {
  async login(credentials: LoginCredentials): Promise<LoginResult> {
    const result = await loginRequest(credentials.username, credentials.password)
    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    }
  }

  async getCurrentUser(accessToken: string): Promise<User> {
    const result = await getCurrentUserRequest(accessToken)
    return {
      id: result.id,
      firstName: result.firstName,
      lastName: result.lastName,
      email: result.email,
      gender: result.gender,
      image: result.image,
    }
  }
}