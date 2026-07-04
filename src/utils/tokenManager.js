const jwt = require('jsonwebtoken');

const generateAccessToken = (userId, email, role) => {
  const payload = { userId, email, role };
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m',
  });
};

const generateRefreshToken = (userId) => {
  const payload = { userId, type: 'refresh' };
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d',
  });
};

const generateResetToken = (userId, email) => {
  const payload = { userId, email, type: 'reset' };
  return jwt.sign(payload, process.env.RESET_TOKEN_SECRET, {
    expiresIn: process.env.RESET_TOKEN_EXPIRY || '15m',
  });
};

const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    throw new Error(`Invalid access token: ${err.message}`);
  }
};

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    throw new Error(`Invalid refresh token: ${err.message}`);
  }
};

const verifyResetToken = (token) => {
  try {\n    return jwt.verify(token, process.env.RESET_TOKEN_SECRET);
  } catch (err) {
    throw new Error(`Invalid reset token: ${err.message}`);
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
  verifyAccessToken,
  verifyRefreshToken,
  verifyResetToken,
};
