import express, { Request, Response, NextFunction } from 'express'
import { pipe } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import { registerUser } from '@/adapters/use-cases/user/register-user-adapter'
import { registerArticle } from '@/adapters/use-cases/article/register-article-adapter'
import { addCommentToAnArticle } from '@/adapters/use-cases/article/add-comment-to-an-article-adapter'
import {
  createUserInDB,
  createArticleInDB,
  addCommentToAnArticleInDB,
} from '@/adapters/ports/db'
import { env } from '@/helpers'

const app = express()

const PORT = env('PORT')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.disable('x-powered-by')
app.disable('etag')

// public
app.post('/api/users', async (req: Request, res: Response) => {
  return pipe(
    req.body.user,
    registerUser(createUserInDB),
    TE.map(result => res.json(result)),
    TE.mapLeft(error => res.status(400).json(getError(error.message))),
  )()
})

// function auth (req: Request, res: Response, next: NextFunction) {
//   res.json('parou')
// }

// private
app.post('/api/articles', async (req: Request, res: Response) => {
  return pipe(
    req.body.article,
    registerArticle(createArticleInDB),
    TE.map(result => res.json(result)),
    TE.mapLeft(error => res.status(422).json(getError(error.message))),
  )()
})

app.post('/api/articles/:slug/comments', async (req: Request, res: Response) => {
  return pipe(
    req.body.comment,
    addCommentToAnArticle(addCommentToAnArticleInDB),
    TE.map(result => res.json(result)),
    TE.mapLeft(error => res.status(422).json(getError(error.message))),
  )()
})

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})

function getError (errors: string) {
  return {
    errors: {
      body: errors.split(':::'),
    },
  }
}
