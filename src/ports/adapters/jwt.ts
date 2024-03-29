import * as jwt from '@/ports/jwt/jose'
import { AuthorId, AuthorIdOutput } from '@/core/profile/types'
import { ValidationError } from '@/helpers/errors'

export type JWTPayload = { id: AuthorId }

export type JWTPayloadInput = { id: AuthorIdOutput }

type ExpirationTime = string

export const generateToken = (...args: [JWTPayloadInput, ExpirationTime?]) => {
  return jwt.createJWT(...args)
}

export const verifyToken = async (token: string) => {
  const { payload } = await jwt.verifyJWT(token)

  if (isValidPayload(payload)) {
    return payload
  }

  throw new ValidationError('Invalid payload. Author ID is missing')
}

type Obj = {}

function isValidPayload (payload: Obj): payload is JWTPayload {
  return 'id' in payload
}
