import { pipe } from 'fp-ts/function'
import * as E from 'fp-ts/Either'
import * as TE from 'fp-ts/TaskEither'
import { verifyToken } from '@/ports/adapters/jwt'
import { AuthError, DefaultError } from '@/helpers/errors'

export * from '@/ports/express/server'

export function getError <E extends Error> (error: E) {
  return {
    code: error instanceof DefaultError ? error.code : 422,
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
