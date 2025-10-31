import { fileURLToPath } from 'node:url'
import { createJiti } from 'jiti'

// Check environment variables
await createJiti(fileURLToPath(import.meta.url)).import('./env')

/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  reactCompiler: true,
  typedRoutes: true,
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
}

export default nextConfig
