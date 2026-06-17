/**
 * Centralized error handling middleware.
 * Catches all errors thrown in the application and returns a standardized JSON response.
 * Handles specific Mongoose/Database errors.
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error to console for development troubleshooting
  console.error(`[Error Middleware] ${err.name || 'Error'}: ${err.message}`);
  if (err.stack && process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  // 1. Mongoose Bad ObjectId Cast Error (e.g. invalid ID format in request param)
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new Error(message);
    res.status(404);
  }

  // 2. Mongoose Duplicate Key Error (e.g. duplicate email registration)
  if (err.code === 11000) {
    const duplicateKey = Object.keys(err.keyValue)[0];
    const message = `Duplicate field value entered: '${duplicateKey}' already exists. Please use another value.`;
    error = new Error(message);
    res.status(400);
  }

  // 3. Mongoose Validation Error (e.g. required schema fields missing)
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new Error(message);
    res.status(400);
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: error.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = {
  errorHandler
};
