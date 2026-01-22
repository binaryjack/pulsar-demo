import type { StorybookConfig } from '@storybook/html-vite'
import { resolve } from 'path'

const config: StorybookConfig = {
  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-links"
  ],
  framework: {
    name: "@storybook/html-vite",
    options: {
      viteConfigPath: resolve(__dirname, '../vite.config.ts')
    }
  },
  docs: {
    autodocs: true
  },
};
export default config;
