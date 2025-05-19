import { Elysia } from 'elysia'
import swagger from '@elysiajs/swagger'
import { note } from './note'
import { user } from './user'

const app = new Elysia()
  .use(swagger())
  .use(user)
  .use(note)
  .get('/', () => 'Hello Elysia')
  .listen(3000)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
