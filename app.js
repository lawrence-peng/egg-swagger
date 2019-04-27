'use strict';

const assert = require('assert');
const { wrapper } = require('./lib');

const MIDDLEWARE_NAME_VALIDATOR = 'validator';

module.exports = app => {
  const { router, config } = app;
  if (config.swagger) {
    wrapper(router, config.swagger);
  }

  const index = app.config.appMiddleware.indexOf(MIDDLEWARE_NAME_VALIDATOR);

  assert.equal(
    index,
    -1,
    `Duplication of middleware name found: ${MIDDLEWARE_NAME_VALIDATOR}. Rename your middleware other than "${MIDDLEWARE_NAME_VALIDATOR}" please.`
  );

  app.config.appMiddleware.unshift(MIDDLEWARE_NAME_VALIDATOR);
};
