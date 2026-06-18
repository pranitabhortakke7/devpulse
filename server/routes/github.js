const express = require('express');
const router = express.Router();
const axios = require('axios');
const authMiddleware = require('../middleware/auth');

const GITHUB_API = 'https://api.github.com';
const HEADERS = {
  Authorization: `token ${process.env.GITHUB_TOKEN}`,
  Accept: 'application/vnd.github.v3+json'
};

// GET all repos
router.get('/repos', authMiddleware, async (req, res) => {
  try {
    const response = await axios.get(
      `${GITHUB_API}/users/${process.env.GITHUB_USERNAME}/repos?sort=updated&per_page=20`,
      { headers: HEADERS }
    );

    const repos = response.data.map(repo => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      updated_at: repo.updated_at,
      html_url: repo.html_url,
      private: repo.private
    }));

    res.json(repos);
  } catch (err) {
    res.status(500).json({ message: 'GitHub API error', error: err.message });
  }
});

// GET commits for a repo
router.get('/repos/:repoName/commits', authMiddleware, async (req, res) => {
  try {
    const { repoName } = req.params;
    const response = await axios.get(
      `${GITHUB_API}/repos/${process.env.GITHUB_USERNAME}/${repoName}/commits?per_page=10`,
      { headers: HEADERS }
    );

    const commits = response.data.map(commit => ({
      sha: commit.sha.substring(0, 7),
      message: commit.commit.message,
      date: commit.commit.author.date,
      author: commit.commit.author.name,
      url: commit.html_url
    }));

    res.json(commits);
  } catch (err) {
    res.status(500).json({ message: 'GitHub API error', error: err.message });
  }
});

// GET user github profile stats
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const response = await axios.get(
      `${GITHUB_API}/users/${process.env.GITHUB_USERNAME}`,
      { headers: HEADERS }
    );

    const stats = {
      username: response.data.login,
      avatar: response.data.avatar_url,
      name: response.data.name,
      bio: response.data.bio,
      public_repos: response.data.public_repos,
      followers: response.data.followers,
      following: response.data.following
    };

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: 'GitHub API error', error: err.message });
  }
});

module.exports = router;