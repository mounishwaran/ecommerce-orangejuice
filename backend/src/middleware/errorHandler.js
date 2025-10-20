export const notFound = (req, res, next) => {
  res.status(404);
  res.json({ message: 'Resource not found' });
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  // Log technical details for developers only (server console)
  console.error(err);
  res.status(statusCode);
  const isServerError = statusCode >= 500;
  const message = isServerError ? 'Something went wrong. Please try again.' : (err.message || 'Request failed');
  res.json({ message });
};
