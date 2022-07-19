import { pipe } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import * as E from 'fp-ts/Either'
import * as db from '@/ports/adapters/db'
import * as jwt from '@/ports/adapters/jwt'
import { extractToken, getError } from '@/ports/adapters/http/http'
import { CreateUser, LoginUser, UserOutput } from '@/core/user/types'
import * as user from '@/core/user/use-cases/register-user-adapter'
import { JWTPayload } from '@/ports/adapters/jwt'
import { AuthorId } from '@/core/article/types'

export function registerUser (data: CreateUser) {
  return pipe(
    data,
    user.registerUser(db.createUserInDB),
    TE.chain(user => pipe(
      TE.tryCatch(
        () => jwt.generateToken({ id: user.id }),
        E.toError,
      ),
      TE.map(token => ({ user, token })),
    )),
    TE.map(getUserResponse),
    TE.mapLeft(error => getError(error.message)),
  )
}

export function login (data: LoginUser) {
  return pipe(
    TE.tryCatch(
      () => db.login(data),
      E.toError,
    ),
    TE.chain((user) => pipe(
      TE.tryCatch(
        () => jwt.generateToken({ id: user.id }),
        E.toError,
      ),
      TE.map(token => ({ user, token })),
    )),
    TE.map(getUserResponse),
    TE.mapLeft(error => getError(error.message)),
  )
}

type GetCurrentUserInput = {
  payload: JWTPayload
  authHeader?: string
}

export function getCurrentUser ({ payload, authHeader }: GetCurrentUserInput) {
  const propId = 'id'
  const userId = payload[propId] as AuthorId
  const token = extractToken(authHeader)

  return pipe(
    TE.tryCatch(
      () => db.getCurrentUser(userId),
      E.toError,
    ),
    TE.map(user => getUserResponse({ user, token })),
    TE.mapLeft(error => getError(error.message)),
  )
}

type GetUserResponseInput = {
  user: db.database.DBUser
  token: string
}

type UserResponse = {
  user: UserOutput
}

type GetUserResponse = (input: GetUserResponseInput) => UserResponse

const getUserResponse: GetUserResponse = ({ user, token }) => ({
  user: {
    email: user.email,
    token: token,
    username: user.username,
    bio: user.bio ?? '',
    image: user.image ?? '',
  },
})
