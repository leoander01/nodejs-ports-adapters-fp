import { pipe } from 'fp-ts/function'
import * as E from 'fp-ts/Either'
import * as TE from 'fp-ts/TaskEither'
import { verifyToken } from '@/ports/adapters/jwt'

export * from '@/ports/express/server'

export function getError (errors: string) {
  return {
    errors: {
      body: errors.split(':::'),
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
    TE.mapLeft(() => getError('Unauthorized')),
  )
}
