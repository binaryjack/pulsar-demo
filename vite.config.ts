import { pulsarPlugin } from '@pulsar-framework/vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [pulsarPlugin()],
  resolve: {
    dedupe: ['@pulsar-framework/pulsar.dev'],
  },
  optimizeDeps: {
    include: ['@pulsar-framework/pulsar.dev'],
  },
});
