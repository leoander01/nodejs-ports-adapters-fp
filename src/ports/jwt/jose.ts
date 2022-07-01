import * as jose from 'jose'
import { env } from '@/helpers/env'

const JWT_SECRET = env('JWT_SECRET')

if (JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be at least 32 chars long')
}

// export { jose.JWTPayload }

export async function createJWT (
  payload: jose.JWTPayload,
  expirationTime: string = '10m',
) {
  const secret = Buffer.from(JWT_SECRET)
  return new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(expirationTime)
    .sign(secret)
}

export function verifyJWT (token: string) {
  const secret = Buffer.from(JWT_SECRET)
  return jose.jwtVerify(token, secret)
}
