'use strict'
var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ROOT_API: '"http://172.20.10.4:4000/api"',
  BASE_URL: '"http://localhost:8080"',
  WEB_SOCKET: '"ws://172.20.10.4:4000/socket"'
})
