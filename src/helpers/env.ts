import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import { failure } from 'io-ts/PathReporter'
import { withMessage, NonEmptyString } from 'io-ts-types'
import { ValidationError } from '@/helpers/errors'

export const env = (value: string) => {
  const envCodec = withMessage(
    NonEmptyString,
    () => `You must set the env var ${value}`,
  )

  return pipe(
    envCodec.decode(process.env[value]),
    E.fold(
      (errors) => { throw new ValidationError(failure(errors).join(':::')) },
      (value) => value,
    ),
  )
}
