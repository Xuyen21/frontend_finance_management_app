import { defineConfig } from 'cypress'
import { createVitePreprocessor } from 'cypress-vite-preprocessor'

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      const vitePreprocessor = createVitePreprocessor()
      on('file:preprocessor', vitePreprocessor)
      return config
    },
    baseUrl: 'http://localhost:3000',
  },

  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },
  },
})
