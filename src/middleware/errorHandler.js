const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);

  // Validation errors
  if (err.status === 400) {
    return res.status(400).json({ message: err.message });
  }

  // Unauthorized
  if (err.status === 401) {
    return res.status(401).json({ message: err.message });
  }

  // Forbidden
  if (err.status === 403) {
    return res.status(403).json({ message: err.message });
  }

  // Conflict (duplicate email, etc.)
  if (err.status === 409) {
    return res.status(409).json({ message: err.message });
  }

  // Default to 500
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  });
};

module.exports = { errorHandler };
