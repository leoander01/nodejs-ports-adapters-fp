import { database as db } from './db'

export const createUserInDB = db.createUserInDB
export const updateUserInDB = db.updateUserInDB
export const login = db.login

export const getCurrentUserFromDB = db.getCurrentUserFromDB
export const getProfileFromDB = db.getProfileFromDB
export const followUserFromDB = db.getFollowUserFromDB

export const createArticleInDB = db.createArticleInDB
export const addCommentToAnArticleInDB = db.addCommentToAnArticleInDB
