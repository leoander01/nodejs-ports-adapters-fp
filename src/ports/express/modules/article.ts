import { Response, Router } from 'express'
import { pipe } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import * as article from '@/ports/adapters/http/modules/article'
import { getPayload } from '@/ports/adapters/http/http'
import { auth, Request, tryAuth } from '../server'

const articleRoutes = Router()

articleRoutes.post('/api/articles', auth, async (req: Request, res: Response) => {
  const payload = getPayload(req.auth)

  const data = {
    ...req.body.article,
    authorId: payload.id,
  }

  return pipe(
    data,
    article.registerArticle,
    TE.map(result => res.json(result)),
    TE.mapLeft(result => res.status(result.code).json(result.error)),
  )()
})

articleRoutes.get('/api/articles', tryAuth, (req: Request, res: Response) => {
  const payload = getPayload(req.auth)

  pipe(
    article.fetchArticles({
      filter: req.query,
      userId: payload.id,
    }),
    TE.map(result => res.json(result)),
    TE.mapLeft(result => res.status(result.code).json(result.error)),
  )()
})

articleRoutes.post('/api/articles/:slug/favorite', auth, (req: Request, res: Response) => {
  const payload = getPayload(req.auth)
  const slugProp = 'slug'

  pipe(
    article.favoriteArticle({
      userId: payload.id,
      slug: req.params[slugProp] ?? '',
    }),
    TE.map(result => res.send(result)),
    TE.mapLeft(result => res.status(result.code).json(result.error)),
  )()
})

articleRoutes.delete('/api/articles/:slug/favorite', auth, (req: Request, res: Response) => {
  const payload = getPayload(req.auth)
  const slugProp = 'slug'

  pipe(
    article.unfavoriteArticle({
      userId: payload.id,
      slug: req.params[slugProp] ?? '',
    }),
    TE.map(result => res.send(result)),
    TE.mapLeft(result => res.status(result.code).json(result.error)),
  )()
})

articleRoutes.post('/api/articles/:slug/comments', auth, async (req: Request, res: Response) => {
  const payload = getPayload(req.auth)
  const slugProp = 'slug'

  const data = {
    ...req.body.comment,
    authorId: payload.id,
    articleSlug: req.params[slugProp],
  }

  return pipe(
    data,
    article.addCommentToAnArticle,
    TE.map(result => res.json(result)),
    TE.mapLeft(result => res.status(result.code).json(result.error)),
  )()
})

export { articleRoutes }
