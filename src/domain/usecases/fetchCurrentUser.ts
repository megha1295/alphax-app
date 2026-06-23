import { AuthRepository } from '../repositories/AuthRepository'
import { User } from '../entities/User'

export async function fetchCurrentUser(
  repository: AuthRepository,
  accessToken: string
): Promise<User> {
  if (!accessToken) {
    throw new Error('No active session')
  }
  return repository.getCurrentUser(accessToken)
}
