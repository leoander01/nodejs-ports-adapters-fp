import * as jose from 'jose'
import { env } from '@/helpers/env'

const JWT_SECRET = env('JWT_SECRET')

export async function createJWT (payload: jose.JWTPayload) {
  const secret = Buffer.from(JWT_SECRET)
  return new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('10m')
    .sign(secret)
}

export function verifyJWT (token: string) {
  const secret = Buffer.from(JWT_SECRET)
  return jose.jwtVerify(token, secret)
}
