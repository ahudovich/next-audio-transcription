import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    ELEVENLABS_API_KEY: z.string().min(1),
  },
  client: {},
  experimental__runtimeEnv: {},
})
