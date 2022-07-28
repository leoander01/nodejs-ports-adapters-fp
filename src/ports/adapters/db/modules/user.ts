import argon2 from 'argon2'
import { CreateUser } from '@/core/user/types'
import { database as db } from '../db'
import { DBUser } from '../types'

type CreateUserInDB = (data: CreateUser) => Promise<DBUser>

export const createUserInDB: CreateUserInDB = async (data) => {
  const password = await argon2.hash(data.password)

  return db.createUserInDB({
    ...data,
    password,
  })
}

// export const createUserInDB = db.createUserInDB
export const updateUserInDB = db.updateUserInDB
export const login = db.login

export const getCurrentUserFromDB = db.getCurrentUserFromDB
export const getProfileFromDB = db.getProfileFromDB
export const followUser = db.followUser
export const unfollowUser = db.unfollowUser
