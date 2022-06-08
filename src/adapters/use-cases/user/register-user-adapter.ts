import {
  OutsideRegister,
  registerUser as registerUserCore,
  RegisterUser,
} from '@/core/use-cases/user/register-user'
import { User } from '@/core/types/user'

export type OutsideRegisterType = OutsideRegister<{ user: User }>

export const registerUser: RegisterUser = (outsideRegister) => (data) => registerUserCore(outsideRegister)(data)
