import { User } from '../models/User.js';
import { generateTokens, verifyRefreshToken } from '../utils/token.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, title, bio, skills, hourlyRate, company, industry } = req.body;
    const registrationRole = role === 'client' ? 'client' : role === 'freelancer' ? 'freelancer' : null;

    if (!registrationRole) {
      return res.status(400).json({
        success: false,
        message: 'Registration is limited to client and freelancer accounts.'
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email is already registered.' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: registrationRole,
      title: title || (registrationRole === 'client' ? 'Project Manager / Founder' : 'Software Specialist'),
      bio: bio || '',
      skills: Array.isArray(skills) ? skills : [],
      hourlyRate: hourlyRate ? Number(hourlyRate) : 45,
      company: company || '',
      industry: industry || '',
    });

    const { accessToken, refreshToken } = generateTokens(user);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          title: user.title,
        },
        accessToken,
        refreshToken
      }
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (user.role === 'admin') {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Your account has been deactivated.' });
    }

    const { accessToken, refreshToken } = generateTokens(user);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      message: 'Logged in successfully.',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          title: user.title,
          skills: user.skills,
          hourlyRate: user.hourlyRate
        },
        accessToken,
        refreshToken
      }
    });
  } catch (err) {
    next(err);
  }
};

export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const invalidCredentials = () => res.status(401).json({
      success: false,
      message: 'Invalid admin credentials.'
    });

    if (!email || !password) return invalidCredentials();

    const user = await User.findOne({ email: email.trim().toLowerCase(), role: 'admin' }).select('+password');
    if (!user || !(await user.comparePassword(password)) || !user.isActive) {
      return invalidCredentials();
    }

    const { accessToken, refreshToken } = generateTokens(user);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      message: 'Admin login successful.',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          title: user.title
        },
        accessToken,
        refreshToken
      }
    });
  } catch (err) {
    next(err);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, message: 'Refresh token required.' });
    }

    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token.' });
    }

    const tokens = generateTokens(user);
    user.refreshToken = tokens.refreshToken;
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      }
    });
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired refresh token.' });
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      data: { user }
    });
  } catch (err) {
    next(err);
  }
};

export const demoLogin = async (req, res, next) => {
  try {
    const { role = 'client', email } = req.body;

    let query = {};
    if (email) {
      query.email = email;
    } else {
      query.role = role;
    }

    let user = await User.findOne(query);
    if (!user) {
      // Fallback: pick any user with this role
      user = await User.findOne({ role });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: `No demo account available for role ${role}.` });
    }

    if (user.role === 'admin') {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials.' });
    }

    const { accessToken, refreshToken } = generateTokens(user);
    res.json({
      success: true,
      message: `Demo login successful as ${user.name} (${user.role}).`,
      data: {
        user,
        accessToken,
        refreshToken
      }
    });
  } catch (err) {
    next(err);
  }
};
