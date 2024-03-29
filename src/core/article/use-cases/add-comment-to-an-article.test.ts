import { NonEmptyString } from 'io-ts-types'
import { pipe } from 'fp-ts/function'
import {
  addCommentToAnArticle,
  OutsideCreateComment,
} from './add-comment-to-an-article'
import { CreateComment } from '@/core/comment/types'
import { mapAll, unsafe } from '@/config/tests/fixtures'

const data: CreateComment = {
  authorId: '3d3cd71d-065d-47db-b276-15e06820b7ff',
  articleSlug: unsafe('article-slug'),
  body: unsafe<NonEmptyString>('Comment for an article'),
}

const dataWithInvalidBody: CreateComment = {
  authorId: '3d3cd71d-065d-47db-b276-15e06820b7ff',
  articleSlug: unsafe('article-slug'),
  body: unsafe<NonEmptyString>(''),
}

const dataWithInvalidArticleSlug: CreateComment = {
  authorId: '3d3cd71d-065d-47db-b276-15e06820b7ff',
  articleSlug: unsafe(''),
  body: unsafe('Comment for an article'),
}

const registerOk: OutsideCreateComment<string> = async (data) => {
  return `Comment added successfully: ${data.body}`
}

const registerFail: OutsideCreateComment<never> = async () => {
  throw new Error('External error!')
}

it('Should add comment to an article properly', async () => {
  return pipe(
    data,
    addCommentToAnArticle(registerOk),
    mapAll(result => expect(result).toBe(`Comment added successfully: ${data.body}`)),
  )()
})

it('Should not accept an empty comment', async () => {
  return pipe(
    dataWithInvalidBody,
    addCommentToAnArticle(registerOk),
    mapAll(result => expect(result).toEqual(new Error('The body of the comment must not be empty'))),
  )()
})

it('Should not accept an invalid article slug', async () => {
  return pipe(
    dataWithInvalidArticleSlug,
    addCommentToAnArticle(registerOk),
    mapAll(result => expect(result).toEqual(new Error('Invalid slug. Please, use alphanumeric characters, dash, underline and/or numbers'))),
  )()
})

it('Should not create comment if outsideCreateComment function throws an error', async () => {
  return pipe(
    data,
    addCommentToAnArticle(registerFail),
    mapAll(result => expect(result).toEqual(new Error('External error!'))),
  )()
})
