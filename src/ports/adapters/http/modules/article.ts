import { pipe } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import { CreateArticle, ArticleOutput } from '@/core/article/types'
import { CommentOutput, CreateComment } from '@/core/comment/types'
import * as db from '@/ports/adapters/db'
import * as article from '@/core/article/use-cases'
import { getError } from '@/ports/adapters/http/http'

export function registerArticle (data: CreateArticle) {
  return pipe(
    data,
    article.registerArticle(db.createArticleInDB),
    TE.map(getArticleResponse),
    TE.mapLeft(getError),
  )
}

export function addCommentToAnArticle (data: CreateComment) {
  return pipe(
    data,
    article.addCommentToAnArticle(db.addCommentToAnArticleInDB),
    TE.map(getAddCommentToAnArticleResponse),
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

type GetAddCommentToAnArticleInput = CommentOutput & {
  authorId: string
  articleId: string
}

const getAddCommentToAnArticleResponse = (registeredComment: GetAddCommentToAnArticleInput) => {
  const { authorId, articleId, ...comment } = registeredComment
  return { comment }
}
