'use strict';

const _ = require('ramda');
const { getKey } = require('./utils');
/**
 * used for building swagger docs object
 */
class SwaggerObject {
  constructor() {
    this.data = {};
    this.parameters = new Map();
  }
  add(method, path, content) {
    const key = getKey(path, method);
    if (!this.data[key]) this.data[key] = {};
    Object.assign(this.data[key], content);
  }
  addParameters(method, path, type, param) {
    let parameters = {};
    parameters[type] = param;
    const key = getKey(path, method);
    if (this.parameters.has(key)) {
      const orign = this.parameters.get(key);
      parameters = Object.assign({}, orign, parameters);
    }
    this.parameters.set(key, parameters);
  }

  request(method, path) {
    method = _.toLower(method);
    this.add(method, path, {
      request: { method, path },
      security: [{ ApiKeyAuth: [] }],
    });
  }

  _desc(method, path, type, text) {
    this.add(method, path, {
      [type]: text,
    });
  }

  _params(method, path, type, parameters) {
    this.addParameters(method, path, type, parameters);
    // additional wrapper for body
    let swaggerParameters = parameters;
    if (type === 'body') {
      if (parameters.type && parameters.type === 'array') {
        const paramItem = {
          name: 'body',
          description: parameters.description || 'request body',
          required: true,
          schema: {
            type: 'array',
          },
        };
        if (parameters.itemType === 'object') {
          paramItem.schema.items = {
            type: 'object',
            properties: parameters.rule,
          };
        } else {
          paramItem.schema.items = {
            type: parameters.itemType,
          };
          if (parameters.default) {
            paramItem.schema.items = {
              default: parameters.default,
            };
          }
          if (parameters.enum) {
            paramItem.schema.items = {
              enum: parameters.enum,
            };
          }
        }
      } else {
        swaggerParameters = [
          {
            name: 'body',
            description: parameters.description || 'request body',
            required: true,
            schema: {
              type: 'object',
              properties: parameters,
            },
          },
        ];
      }
    } else {
      swaggerParameters = Object.keys(swaggerParameters).map(key =>
        Object.assign({ name: key }, swaggerParameters[key])
      );
    }
    swaggerParameters.forEach(item => {
      item.in = type;
    });

    this.add(method, path, {
      [type]: swaggerParameters,
    });
  }

  description(method, path, text) {
    this._desc(method, path, 'description', text);
  }

  summary(method, path, text) {
    this._desc(method, path, 'summary', text);
  }

  tags(method, path, text) {
    this._desc(method, path, 'tags', text);
  }

  query(method, path, parameters) {
    this._params(method, path, 'query', parameters);
  }
  path(method, path, parameters) {
    this._params(method, path, 'path', parameters);
  }
  body(method, path, parameters) {
    this._params(method, path, 'body', parameters);
  }
  formData(method, path, parameters) {
    this._params(method, path, 'formData', parameters);
  }

  responses(method, path, responses = { 200: { description: 'success' } }) {
    this.add(method, path, { responses });
  }
  disableSwagger(method, path) {
    method = _.toLower(method);
    const key = getKey(path, method);
    if (this.data[key]) delete this.data[key];
  }
}

const swaggerObject = new SwaggerObject();

module.exports = exports = swaggerObject;
