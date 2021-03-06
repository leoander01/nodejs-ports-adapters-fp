import * as TE from 'fp-ts/TaskEither'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import { updateUserCodec, UpdateUser } from '@/core/user/types'
import { validateCodec } from '@/helpers/validate-codec'

export type OutsideUpdateUser<A> = (data: UpdateUser) => Promise<A>

type UpdateUserUseCase = <A>(outsideRegister: OutsideUpdateUser<A>) => (data: UpdateUser) => TE.TaskEither<Error, A>

export const updateUser: UpdateUserUseCase = (outsideRegister) => (data) => {
  return pipe(
    data,
    validateCodec(updateUserCodec),
    TE.fromEither,
    TE.chain(() => TE.tryCatch(
      () => outsideRegister(data),
      E.toError,
    )),
  )
}
