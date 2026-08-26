import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey_team_builder_2026_secure';
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || 'supersecretrefreshjwtkey_team_builder_2026';

export const generateTokens = (user) => {
  const payload = {
    id: user._id,
    role: user.role,
    email: user.email,
    name: user.name
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });

  const refreshToken = jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d'
  });

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, REFRESH_SECRET);
};
