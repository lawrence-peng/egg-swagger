'use strict';

const _ = require('ramda');

const convertPath = path => {
  const re = new RegExp('{(.*?)}', 'g');
  return path.replace(re, ':$1');
};

const getKey = (path, method) => {
  path = path.replace(/[\/]/g, '-');
  method = _.toLower(method);
  return `${method}${path}`;
};

const getPath = (prefix, path) => `${prefix}${path}`.replace('//', '/');

module.exports = exports = {
  getKey,
  convertPath,
  getPath,
};
