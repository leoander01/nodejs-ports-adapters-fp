declare global {
  /* eslint-disable no-unused-vars */
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string
      JWT_SECRET: string | undefined
    }
  }
}

export {}
