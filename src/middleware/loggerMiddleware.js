/**
 * Custom request logging middleware.
 * Logs the request method, path, and duration (or simple timestamp).
 */
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const start = Date.now();
  
  // Log request initiation
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);

  // Once the response finishes, log the status code and duration
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - Status: ${res.statusCode} (${duration}ms)`);
  });

  next();
};

module.exports = {
  requestLogger
};
