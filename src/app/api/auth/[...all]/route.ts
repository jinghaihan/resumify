import { auth, toNextJsHandler } from '@resumify/auth/server'

export const { POST, GET } = toNextJsHandler(auth)
