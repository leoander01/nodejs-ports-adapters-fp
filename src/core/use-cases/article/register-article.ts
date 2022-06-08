import { pipe } from 'fp-ts/function'
import * as E from 'fp-ts/Either'
import * as TE from 'fp-ts/TaskEither'
import { CreateArticle } from '@/core/types/article'
import { validateArticle } from './validate-article'

export type OutsideRegister<A> = (data: CreateArticle) => Promise<A>

export type RegisterArticle = <A>(outsideRegister: OutsideRegister<A>) =>
  (data: CreateArticle) => TE.TaskEither<Error, A>

export const registerArticle: RegisterArticle = (outsideRegister) => (data) => {
  return pipe(
    data,
    validateArticle,
    TE.fromEither,
    TE.chain((data) => TE.tryCatch(
      () => outsideRegister(data),
      E.toError,
    )),
  )
}
