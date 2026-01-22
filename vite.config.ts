import { resolve } from 'path'
import { defineConfig } from 'vite'
import { pulsarPlugin } from '@pulsar/vite-plugin'

export default defineConfig({
  plugins: [
    pulsarPlugin()
  ],
  resolve: {
    alias: {
      '@atomos/prime': resolve(__dirname, '../atomos-prime.dev/src/index.ts'),
    }
  },
  optimizeDeps: {
    include: [
      'pulsar',
      'pulsar/reactivity',
      'pulsar/hooks',
      'pulsar/jsx-runtime',
      'pulsar/state',
      'pulsar/resource',
      'pulsar/context',
      'pulsar/portal',
      'pulsar/error-boundary',
      'pulsar/di',
      'pulsar/control-flow',
      '@atomos/prime'
    ],
  },
  esbuild: {
    jsxFactory: 'jsx',
    jsxFragment: 'Fragment',
    jsxInject: `import { jsx, Fragment } from 'pulsar/jsx-runtime'`
  }
})
