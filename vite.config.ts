import { pulsarPlugin } from '@pulsar/vite-plugin'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    pulsarPlugin()
  ],
  resolve: {
    alias: {}
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
      'pulsar/control-flow'
    ],
  },
  esbuild: {
    jsxFactory: 'jsx',
    jsxFragment: 'Fragment',
    jsxInject: `import { jsx, Fragment } from 'pulsar/jsx-runtime'`
  }
})
