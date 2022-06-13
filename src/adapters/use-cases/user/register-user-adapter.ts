import * as user from '@/core/use-cases/user/register-user'
import { CreateUser, User } from '@/core/types/user'

export type OutsideRegisterUser = user.OutsideRegisterUser<{ user: User }>

export { CreateUser, User }

export const registerUser: user.RegisterUser = (outsideRegister) => (data) =>
  user.registerUser(outsideRegister)(data)
