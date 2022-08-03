import { pipe } from 'fp-ts/function'
import * as E from 'fp-ts/Either'
import * as TE from 'fp-ts/TaskEither'
import { CreateArticle, ArticleOutput } from '@/core/article/types'
import { CreateComment, CommentOutput } from '@/core/comment/types'
import * as db from '@/ports/adapters/db'
import * as article from '@/core/article/use-cases'
import { DBArticle } from '@/ports/adapters/db/types'
import { getError } from '@/ports/adapters/http/http'
import { ArticlesFilter } from '../types'

export function registerArticle (data: CreateArticle) {
  return pipe(
    data,
    article.registerArticle(db.createArticleInDB),
    TE.map(getArticleResponse),
    TE.mapLeft(getError),
  )
}

export function fetchArticles (filter: ArticlesFilter) {
  return pipe(
    TE.tryCatch(
      () => db.getArticlesFromDB(filter),
      E.toError,
    ),
    TE.map(getArticlesResponse),
    TE.mapLeft(getError),
  )
}

type FavoriteArticleInput = {
  slug: string
  userId: string
}

export function favoriteArticle (data: FavoriteArticleInput) {
  return pipe(
    TE.tryCatch(
      () => db.favoriteArticleInDB(data),
      E.toError,
    ),
    TE.mapLeft(getError),
  )
}

export function unfavoriteArticle (data: FavoriteArticleInput) {
  return pipe(
    TE.tryCatch(
      () => db.unfavoriteArticleInDB(data),
      E.toError,
    ),
    TE.mapLeft(getError),
  )
}

function getArticlesResponse (articles: DBArticle[]) {
  return {
    articles,
    articlesCount: articles.length,
  }
}

export function addCommentToAnArticle (data: CreateComment) {
  return pipe(
    data,
    article.addCommentToAnArticle(db.addCommentToAnArticleInDB),
    TE.map(getCommentResponse),
    TE.mapLeft(getError),
  )
}

type GetArticleREsponseInput = Omit<ArticleOutput, 'favorited'> & {
  authorId: string
}

const getArticleResponse = (article: GetArticleREsponseInput) => {
  const { authorId, ...articleResponse } = article
  return {
    article: {
      ...articleResponse,
      favorited: false,
    },
  }
}

const getCommentResponse = (comment: CommentOutput) => {
  return {
    comment,
  }
}
