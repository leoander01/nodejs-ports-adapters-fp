import { pipe } from 'fp-ts/function'
import { registerUser, OutsideRegisterUser } from './register-user'
import { CreateUser } from '@/core/types/user'
import { mapAll, unsafe } from '@/config/tests/fixtures'
import { Email, Password, Slug } from '@/core/types/scalar'

const unsafeEmail = (value: unknown) => unsafe<Email>(value)
const unsafePassword = (value: unknown) => unsafe<Password>(value)
const unsafeSlug = (value: unknown) => unsafe<Slug>(value)

const registerOk: OutsideRegisterUser<string> = async (data) => {
  return `Usuário ${data.username} cadastrado com sucesso!`
}

const registerFail: OutsideRegisterUser<never> = async () => {
  throw new Error('External error!')
}

const data: CreateUser = {
  username: unsafeSlug('john'),
  email: unsafeEmail('john@doe.com'),
  password: unsafePassword('john123!'),
}

const dataWithWrongUsername: CreateUser = {
  username: unsafeSlug('a'),
  email: unsafeEmail('john@doe.com'),
  password: unsafePassword('john123!'),
}

const dataWithWrongEmailAndPassword: CreateUser = {
  username: unsafeSlug('john'),
  email: unsafeEmail('john'),
  password: unsafePassword('j'),
}

it('Should register a user properly', async () => {
  return pipe(
    data,
    registerUser(registerOk),
    mapAll(result => expect(result).toBe(`Usuário ${data.username} cadastrado com sucesso!`)),
  )()
})

it('Should not accept a register from a user with invalid username', async () => {
  return pipe(
    dataWithWrongUsername,
    registerUser(registerOk),
    mapAll(error => expect(error).toEqual(new Error('Invalid slug. Please, use alphanumeric characters, dash and/or numbers'))),
  )()
})

it('Should not accept a register from a user with invalid email and/or password', async () => {
  return pipe(
    dataWithWrongEmailAndPassword,
    registerUser(registerOk),
    mapAll(error => expect(error).toEqual(new Error('Invalid email:::Password should be at least 8 characters long'))),
  )()
})

it('Should return a Left if register function throws an error', async () => {
  return pipe(
    data,
    registerUser(registerFail),
    mapAll(error => expect(error).toEqual(new Error('External error!'))),
  )()
})
