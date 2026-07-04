const { users, refreshTokens, resetTokens } = require('../config/database');
const { hashPassword, comparePassword } = require('../utils/passwordManager');
const {
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
  verifyRefreshToken,
  verifyResetToken,
} = require('../utils/tokenManager');

// Register new user
const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    if (users.has(email)) {
      const err = new Error('Email already registered');
      err.status = 409;
      return next(err);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = {
      id: Date.now().toString(),
      email,
      name,
      password: hashedPassword,
      role: 'user',
      createdAt: new Date(),
    };

    users.set(email, user);

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

// Login user
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.get(email);
    if (!user) {
      const err = new Error('Invalid email or password');
      err.status = 401;
      return next(err);
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      const err = new Error('Invalid email or password');
      err.status = 401;
      return next(err);
    }

    // Generate tokens
    const accessToken = generateAccessToken(user.id, user.email, user.role);
    const refreshToken = generateRefreshToken(user.id);

    // Store refresh token
    refreshTokens.add(refreshToken);

    res.json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

// Refresh access token
const refreshAccessToken = (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      const err = new Error('Refresh token required');
      err.status = 400;
      return next(err);
    }

    // Check if refresh token is valid and stored
    if (!refreshTokens.has(refreshToken)) {
      const err = new Error('Invalid or revoked refresh token');
      err.status = 401;
      return next(err);
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    const user = Array.from(users.values()).find((u) => u.id === decoded.userId);

    if (!user) {
      const err = new Error('User not found');
      err.status = 404;
      return next(err);
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user.id, user.email, user.role);

    res.json({
      message: 'Access token refreshed',
      accessToken: newAccessToken,
    });
  } catch (err) {
    next(err);
  }
};

// Request password reset
const requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Find user
    const user = users.get(email);
    if (!user) {
      // Don't reveal if email exists
      return res.json({
        message: 'If that email exists, a reset link will be sent',
      });
    }

    // Generate reset token
    const resetToken = generateResetToken(user.id, user.email);
    resetTokens.set(resetToken, { userId: user.id, expiresAt: Date.now() + 15 * 60 * 1000 });

    // In production, send email with reset token
    console.log(`Reset token for ${email}: ${resetToken}`);

    res.json({
      message: 'If that email exists, a reset link will be sent',
      resetToken, // In production, don't return this in response
    });
  } catch (err) {
    next(err);
  }
};

// Reset password
const resetPassword = async (req, res, next) => {
  try {
    const { resetToken, password } = req.body;

    if (!resetToken) {
      const err = new Error('Reset token required');
      err.status = 400;
      return next(err);
    }

    // Check if reset token is valid
    const tokenData = resetTokens.get(resetToken);
    if (!tokenData || tokenData.expiresAt < Date.now()) {
      const err = new Error('Invalid or expired reset token');
      err.status = 401;
      return next(err);
    }

    // Verify reset token
    const decoded = verifyResetToken(resetToken);

    // Find user
    const user = Array.from(users.values()).find((u) => u.id === decoded.userId);
    if (!user) {
      const err = new Error('User not found');
      err.status = 404;
      return next(err);
    }

    // Hash new password
    const hashedPassword = await hashPassword(password);
    user.password = hashedPassword;

    // Remove used reset token
    resetTokens.delete(resetToken);

    res.json({
      message: 'Password reset successfully',
    });
  } catch (err) {
    next(err);
  }
};

// Logout (invalidate refresh token)
const logout = (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken && refreshTokens.has(refreshToken)) {
      refreshTokens.delete(refreshToken);
    }

    res.json({
      message: 'Logout successful',
    });
  } catch (err) {
    next(err);
  }
};

// Get current user (protected route)
const getCurrentUser = (req, res) => {
  const user = Array.from(users.values()).find((u) => u.id === req.user.userId);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
};

module.exports = {
  register,
  login,
  refreshAccessToken,
  requestPasswordReset,
  resetPassword,
  logout,
  getCurrentUser,
};
