import { pipe } from 'fp-ts/function'
import * as E from 'fp-ts/Either'
import * as TE from 'fp-ts/TaskEither'
import { verifyToken, JWTPayload } from '@/ports/adapters/jwt'
import { AuthError, DefaultError } from '@/helpers/errors'

const COMMON_ERROR_CODE = 400

export function getError <E extends Error> (error: E) {
  return {
    code: error instanceof DefaultError ? error.code : COMMON_ERROR_CODE,
    error: {
      errors: {
        body: error.message.split(':::'),
      },
    },
  }
}

export function extractToken (authHeader: string = '') {
  return authHeader.replace('Token ', '')
}

export function authMiddleware (authHeader: string = '') {
  const token = extractToken(authHeader)

  return pipe(
    TE.tryCatch(
      () => verifyToken(token),
      E.toError,
    ),
    TE.mapLeft(() => getError(new AuthError())),
  )
}

export function getPayload (payload?: JWTPayload) {
  return payload ?? { id: '' }
}
