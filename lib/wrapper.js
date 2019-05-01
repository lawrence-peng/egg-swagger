'use strict';

const swaggerHTML = require('./swaggerHTML');
const swaggerJSON = require('./swaggerJSON');
const swaggerObject = require('./swaggerObject');
const { getPath } = require('./utils');

/**
 * allowed http methods
 */
const reqMethods = [ 'get', 'post', 'put', 'patch', 'delete' ];

const handleSwagger = (router, options) => {
  const {
    swaggerJsonEndpoint = '/api-json',
    swaggerHtmlEndpoint = '/docs',
  } = options;

  // setup swagger router
  router.get(swaggerJsonEndpoint, async ctx => {
    ctx.body = swaggerJSON(options, swaggerObject.data);
  });
  router.get(swaggerHtmlEndpoint, async ctx => {
    ctx.body = swaggerHTML(swaggerJsonEndpoint);
  });
};

const wrapper = (router, options) => {
  const { prefix } = options;

  if (
    process.env.NODE_ENV !== 'prod' &&
    process.env.NODE_ENV !== 'production'
  ) {
    handleSwagger(router, options);
  }

  const orignRouterMethodMap = {};

  reqMethods.forEach(method => {
    orignRouterMethodMap[method] = router[method];
    if (!orignRouterMethodMap[method]) return;

    router[method] = function() {
      const args = Array.prototype.slice.call(arguments);
      const url = getPath(prefix, args[0]); // 根据前缀补全 path
      // args.splice(1, 0, 'validator')
      swaggerObject.request(method, url);
      const newRouter = orignRouterMethodMap[method].apply(this, [
        url,
        ...args.slice(1),
      ]);
      newRouter.tags = function(text) {
        swaggerObject.tags(method, url, text);
        return newRouter;
      };
      newRouter.summary = function(text) {
        swaggerObject.summary(method, url, text);
        return newRouter;
      };
      newRouter.description = function(text) {
        swaggerObject.description(method, url, text);
        return newRouter;
      };
      newRouter.query = function(parameters) {
        swaggerObject.query(method, url, parameters);
        return newRouter;
      };
      newRouter.path = function(parameters) {
        swaggerObject.path(method, url, parameters);
        return newRouter;
      };
      newRouter.body = function(parameters) {
        swaggerObject.body(method, url, parameters);
        return newRouter;
      };
      newRouter.formData = function(parameters) {
        swaggerObject.formData(method, url, parameters);
        return newRouter;
      };
      newRouter.responses = function(responses) {
        swaggerObject.responses(method, url, responses);
        return newRouter;
      };
      return newRouter;
    };
  });
};

module.exports = exports = wrapper;
