'use strict';

const _ = require('ramda');
const pathToRegexp = require('path-to-regexp');
const Path = require('path');

const convertPath = path => {
  const re = new RegExp('{(.*?)}', 'g');
  return path.replace(re, ':$1');
};

const getKey = (path, method) => {
  path = path.replace(/[\/]/g, '-');
  method = _.toLower(method);
  return `${method}${path}`;
};

const getPath = (prefix, path) => {
  const result = [];
  pathToRegexp(path, result);
  result.forEach(each => {
    path = path.replace(`:${each.name}`, `{${each.name}}`);
  });
  return Path.join(prefix, path);
  // return `${prefix}${path}`.replace('//', '/');
};

module.exports = exports = {
  getKey,
  convertPath,
  getPath,
};
