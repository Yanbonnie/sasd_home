// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    //assetsSubDirectory: 'jsp/webui/static',
    assetsPublicPath: '/',
    productionSourceMap: false, //true会打包出map文件
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: 8089,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
        '/proxy': {
            target:'http://192.168.10.141',          //测试环境
            // target:"http://192.168.22.250:8080",  //经词本地
            // target:"http://192.168.10.141:82",    //代理经词本地
            changeOrigin: true,                         //允许跨域
            secure:false,    //false  http协议   true https协议
            pathRewrite: {
              '^/proxy': ''   //路径改写规则    
            }
        },
        '/pdf':{
          target:'www.zhenyiqian.com',
          changeOrigin:true,
          pathRewrite:{
            '^/pdf':''
          }
        }
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
