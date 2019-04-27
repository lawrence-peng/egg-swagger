'use strict';

const init = require('./swaggerInit');

const swaggerJSON = (options = {}, apiObjects) => {
  const { title, description, version, swaggerOptions = {} } = options;
  const swaggerJSON = init(title, description, version, swaggerOptions);
  Object.keys(apiObjects).forEach(key => {
    const value = apiObjects[key];
    if (!Object.keys(value).includes('request')) {
      throw new Error('missing [request] field');
    }

    const { method } = value.request;
    const { path } = value.request;
    const summary = value.summary ? value.summary : '';
    const description = value.description ? value.description : summary;
    const responses = value.responses
      ? value.responses
      : {
        200: {
          description: 'success',
        },
      };
    const {
      query = [],
      path: pathParams = [],
      body = [],
      tags,
      formData = [],
      security,
    } = value;

    const parameters = [ ...pathParams, ...query, ...formData, ...body ];

    // init path object first
    if (!swaggerJSON.paths[path]) {
      swaggerJSON.paths[path] = {};
    }

    // add content type [multipart/form-data] to support file upload
    const consumes = formData.length > 0 ? [ 'multipart/form-data' ] : undefined;

    swaggerJSON.paths[path][method] = {
      consumes,
      summary,
      description,
      parameters,
      responses,
      tags,
      security,
    };
  });
  return swaggerJSON;
};

module.exports = exports = swaggerJSON;
