import { defineConfig } from 'vite'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'
import zipPack from "vite-plugin-zip-pack";
import { configDotenv } from 'dotenv';
configDotenv();

export default defineConfig({
  plugins: [
    crx({
      manifest: {
        ...manifest,
        version: process.env.EXTENSION_VERSION || "1.0.0",
        host_permissions: [
          ...manifest.host_permissions,
          new URL('/*', process.env.VITE_DOWNLOAD_HOST).href
        ]
      }
    }),
    zipPack({
      outDir: './'
    })
  ],
  build: {
    assetsDir: '',
  }
})
