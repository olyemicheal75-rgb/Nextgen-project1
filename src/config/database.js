// In-memory storage for demonstration
// In production, this would connect to a real database (PostgreSQL, MongoDB, etc.)

const users = new Map();
const refreshTokens = new Set();
const resetTokens = new Map();

module.exports = {
  users,
  refreshTokens,
  resetTokens,
};
