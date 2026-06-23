export class InvalidOtpError extends Error {}

const BLOCKED_CODE = '000000'

export function verifyOtp(code: string): void {
  if (code.length !== 6 || !/^\d{6}$/.test(code)) {
    throw new InvalidOtpError('Enter all 6 digits')
  }
  if (code === BLOCKED_CODE) {
    throw new InvalidOtpError('Invalid code')
  }
}
