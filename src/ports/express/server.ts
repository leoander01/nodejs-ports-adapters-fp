import express, { Request, Response } from 'express'
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
import * as jose from 'jose'
// import { SignJWT } from 'jose/jwt/sign'
// import { generateKeyPair } from 'jose/util/generate_key_pair'

async function createJWT () {
  const secret = await jose.generateSecret('HS256')

  const jwt = await new jose.SignJWT({ id: '123' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('10m')
    .sign(secret)

  console.log('jwt:', jwt)
}

createJWT()

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
