import * as jwt from '@/ports/jwt/jose'

export const generateToken = (payload) => {
  return jwt.createJWT(payload)
}
