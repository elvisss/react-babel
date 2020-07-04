/* eslint-disable no-unused-vars */
const boom = require('@hapi/boom');

const withErrorStack = (error, stack) => {
  if (!process.env.ENV !== 'production') {
    return { ...error, stack };
  }
  return error;
};

const logErrors = (err, req, res, next) => {
  next(err);
};

const wrapErrors = (err, req, res, next) => {
  if (!err.isBoom) {
    next(boom.badImplementation());
  }
  next(err);
};

const errorHandler = (err, req, res, next) => {
  const {
    output: { statusCode, payload },
  } = err;

  res.status(statusCode);
  res.json(withErrorStack(payload, err.stack));
};

module.exports = {
  logErrors,
  wrapErrors,
  errorHandler,
};
