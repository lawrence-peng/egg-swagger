'use strict';

const Validator = require('parameter');
const swaggerObject = require('../../lib/swaggerObject');
const { getKey } = require('../../lib/utils');

module.exports = () => {
  const validator = new Validator();

  return async (ctx, next) => {
    const key = getKey(ctx.path, ctx.method);
    const parameters = swaggerObject.parameters.get(key);
    if (!parameters) {
      await next();
      return;
    }
    let errors;
    if (parameters.query) {
      errors = validator.validate(parameters.query, ctx.request.query);
    }
    if (parameters.path) {
      errors = validator.validate(parameters.path, ctx.params);
    }
    if (parameters.body) {
      errors = validator.validate(parameters.body, ctx.request.body);
    }
    if (errors) {
      ctx.throw(400, 'Validation Failed', {
        code: 'invalid_param',
        errors,
      });
    }
    await next();
  };
};
