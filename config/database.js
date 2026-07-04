// In-memory database for demonstration
// In production, replace with actual database (MongoDB, PostgreSQL, etc.)

const users = new Map(); // Store users by email
const refreshTokens = new Set(); // Store valid refresh tokens
const resetTokens = new Map(); // Store reset tokens with expiry

// Initialize with a test user (optional)
const initializeDatabase = () => {
  // You can add default data here if needed
  console.log('In-memory database initialized');
};

// Database operations
const db = {
  users: {
    create: (email, userData) => {
      users.set(email, userData);
      return userData;
    },
    findByEmail: (email) => users.get(email),
    findById: (id) => Array.from(users.values()).find((u) => u.id === id),
    update: (email, updates) => {
      const user = users.get(email);
      if (user) {
        Object.assign(user, updates);
        return user;
      }
      return null;
    },
    delete: (email) => users.delete(email),
    all: () => Array.from(users.values()),
  },
  refreshTokens: {
    add: (token) => refreshTokens.add(token),
    has: (token) => refreshTokens.has(token),
    delete: (token) => refreshTokens.delete(token),
  },
  resetTokens: {
    set: (token, data) => resetTokens.set(token, data),
    get: (token) => resetTokens.get(token),
    has: (token) => resetTokens.has(token),
    delete: (token) => resetTokens.delete(token),
  },
};

module.exports = {
  users,
  refreshTokens,
  resetTokens,
  db,
  initializeDatabase,
};
