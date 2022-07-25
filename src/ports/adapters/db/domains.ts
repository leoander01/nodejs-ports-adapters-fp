import { database as db } from './db'

export const createUserInDB = db.createUserInDB
export const updateUserInDB = db.updateUserInDB
export const login = db.login

export const getCurrentUserFromDB = db.getCurrentUserFromDB
export const getProfileFromDB = db.getProfileFromDB
export const followUser = db.followUser
export const unfollowUser = db.unfollowUser

export const createArticleInDB = db.createArticleInDB
export const getArticles = db.getArticlesFromDB
export const addCommentToAnArticleInDB = db.addCommentToAnArticleInDB
