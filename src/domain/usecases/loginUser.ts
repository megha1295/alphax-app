import { AuthRepository, LoginCredentials, LoginResult } from '../repositories/AuthRepository'

export class ValidationError extends Error {}

function validateCredentials(credentials: LoginCredentials): void {
  if (!credentials.username.trim()) {
    throw new ValidationError('Username is required')
  }
  if (!credentials.password) {
    throw new ValidationError('Password is required')
  }
  if (credentials.password.length < 6) {
    throw new ValidationError('Password must be at least 6 characters')
  }
}

export async function loginUser(
  repository: AuthRepository,
  credentials: LoginCredentials
): Promise<LoginResult> {
  validateCredentials(credentials)
  return repository.login(credentials)
}
