const axios = require('axios');
const express = require('express');

const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log('Register body:', req.body);

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(201).json({
      token,
      user: { id: user._id, username: user.username, email: user.email }
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email }
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET current logged in user
router.get('/me', async (req, res) => {
  const authMiddleware = require('../middleware/auth');
  authMiddleware(req, res, async () => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });
});

// GitHub OAuth - Step 1: Redirect to GitHub
router.get('/github', (req, res) => {
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=repo,read:user,user:email`;
  res.redirect(githubAuthUrl);
});

// GitHub OAuth - Step 2: Callback from GitHub
router.get('/github/callback', async (req, res) => {
  try {
    const { code } = req.query;

    // Exchange code for access token
    const tokenRes = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code
      },
      { headers: { Accept: 'application/json' } }
    );

    const githubAccessToken = tokenRes.data.access_token;

    // Get GitHub user data
    const githubUserRes = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `token ${githubAccessToken}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });

    const githubUser = githubUserRes.data;

    // Check if user already exists with this GitHub ID
    let user = await User.findOne({ githubId: String(githubUser.id) });

    if (user) {
      user.githubAccessToken = githubAccessToken;
      user.avatar = githubUser.avatar_url;
      await user.save();
    } else {
      user = await User.findOne({ email: githubUser.email });

      if (user) {
        user.githubId = String(githubUser.id);
        user.githubAccessToken = githubAccessToken;
        user.avatar = githubUser.avatar_url;
        await user.save();
      } else {
        user = new User({
          username: githubUser.login,
          email: githubUser.email || `${githubUser.login}@github.com`,
          password: await bcrypt.hash(Math.random().toString(36), 10),
          githubId: String(githubUser.id),
          githubAccessToken,
          avatar: githubUser.avatar_url
        });
        await user.save();
      }
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}&username=${user.username}&email=${encodeURIComponent(user.email)}&avatar=${encodeURIComponent(user.avatar || '')}`);
  } catch (err) {
    console.error('GitHub OAuth error:', err.message);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=github_auth_failed`);
  }
});

module.exports = router;
