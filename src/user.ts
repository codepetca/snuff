import Elysia, { t } from 'elysia'

export const userService = new Elysia({ name: 'user/service' })
  .state({
    user: {} as Record<string, string>,
    session: {} as Record<number, string>,
  })
  .model({
    signIn: t.Object({
      username: t.String({ minLength: 1 }),
      password: t.String({ minLength: 4 }),
    }),
    session: t.Cookie(
      {
        token: t.Number(),
      },
      {
        secrets: 'seia',
      }
    ),
    optionalSession: t.Cookie(
      {
        token: t.Optional(t.Number()),
      },
      {
        secrets: 'seia',
      }
    ),
  })
  .macro({
    isSignIn(enabled: boolean) {
      if (!enabled) return

      return {
        beforeHandle({ status, cookie: { token }, store: { session } }) {
          if (!token.value) {
            return status(401, {
              success: false,
              message: 'Unauthorized',
            })
          }

          const username = session[token.value as unknown as number]
          if (!username) {
            return status(401, {
              success: false,
              message: 'Unauthorized',
            })
          }
        },
      }
    },
  })

export const user = new Elysia({ prefix: '/user' })
  .use(userService)
  .put(
    '/sign-up',
    async ({ body: { username, password }, store, status }) => {
      if (store.user[username])
        return status(400, {
          success: false,
          message: 'Username already exists',
        })
      store.user[username] = password
      return status(200, {
        success: true,
        message: 'User created',
      })
    },
    {
      body: 'signIn',
    }
  )
  .post(
    '/sign-in',
    async ({
      store: { user, session },
      status,
      body: { username, password },
      cookie: { token },
    }) => {
      if (
        !user[username] ||
        !(await Bun.password.verify(password, user[username]))
      )
        return status(400, {
          success: false,
          message: 'Invalid username or password',
        })
      const key = crypto.getRandomValues(new Uint32Array(1))[0]
      session[key] = username
      token.value = key
      return status(200, {
        success: true,
        message: 'Signed in',
      })
    },
    {
      body: 'signIn',
      cookie: 'session',
    }
  )
  .get(
    '/sign-out',
    async ({ cookie: { token } }) => {
      token.remove()
      return {
        success: true,
        message: 'Signed out',
      }
    },
    {
      cookie: 'optionalSession',
    }
  )
  .get(
    '/profile',
    ({ cookie: { token }, store: { session } }) => {
      const username = session[token.value]
      return {
        success: true,
        username,
      }
    },
    {
      cookie: 'session',
      isSignIn: true,
    }
  )
