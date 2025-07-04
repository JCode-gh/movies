// vue.config.js
const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
    devServer: {
      host: '0.0.0.0',
      port: 8090 // Use any port that is free on your system
    },
    configureWebpack: {
      resolve: {
        alias: {
          vue$: 'vue/dist/vue.runtime.esm-bundler.js'
        }
      }
    },
    runtimeCompiler: false
  });
  