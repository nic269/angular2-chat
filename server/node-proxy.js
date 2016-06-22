'use strict';

const httpProxy = require('http-proxy');
const winston = require('winston');
const proxyConfig = require('./proxy-config');

module.exports = (app) => {
  const paths = Object.keys(proxyConfig);
  if (!paths.length) {
    return;
  }

  const proxy = httpProxy.createProxyServer()
    .on('error', e => winston.error(e));

  paths.forEach(path => {
    const config = proxyConfig[path];
    if (path && config) {
      winston.info(`Enabling proxy ${path} => `, config);
      app.use(path, (req, res) => {
        proxy.web(req, res, config);
      });
    }
  });
};
