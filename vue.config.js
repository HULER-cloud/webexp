const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // devServer:{
  //   proxy:{
  //     port:5173,
  //     '/a':{
  //       target:'http://127.0.0.1:12345',
  //       changeOrigin: true,
  //       // ws:true,
  //     }
  //   }
  // }
})
