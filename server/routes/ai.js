const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const authMiddleware = require('../middleware/auth');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// DevBot Chat
router.post('/chat', authMiddleware, async (req, res) => {
  try {
    const { message, repoContext } = req.body;

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are DevBot, an intelligent AI assistant for developers inside DevPulse platform. You help with code questions, repository analysis, debugging, and documentation. Be concise, technical, and helpful.
${repoContext ? `Current repository: ${repoContext}` : ''}`
        },
        {
          role: 'user',
          content: message
        }
      ],
      max_tokens: 1024,
      temperature: 0.7
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ message: 'AI error', error: err.message });
  }
});

// Generate Changelog
router.post('/changelog', authMiddleware, async (req, res) => {
  try {
    const { commits, repoName } = req.body;

    const commitText = commits
      .map(c => `- ${c.message} (${c.date})`)
      .join('\n');

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are a professional technical writer who creates clean, well-structured changelogs from git commits.'
        },
        {
          role: 'user',
          content: `Generate a clean professional changelog for repository "${repoName}" based on these commits:

${commitText}

Format as markdown with sections: ## Added, ## Fixed, ## Changed. Make it human-readable and professional.`
        }
      ],
      max_tokens: 1024,
      temperature: 0.5
    });

    res.json({ changelog: response.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ message: 'AI error', error: err.message });
  }
});

// Generate README
router.post('/readme', authMiddleware, async (req, res) => {
  try {
    const { repoName, description, language } = req.body;

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are a professional developer who writes impressive, detailed README files for GitHub repositories.'
        },
        {
          role: 'user',
          content: `Generate a professional README.md for this repository:
- Name: ${repoName}
- Description: ${description || 'A developer productivity platform'}
- Language: ${language || 'JavaScript'}

Include: Title, Badges, Description, Features, Tech Stack, Installation, Usage, Contributing, License sections. Make it impressive.`
        }
      ],
      max_tokens: 2048,
      temperature: 0.5
    });

    res.json({ readme: response.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ message: 'AI error', error: err.message });
  }
});

// Refactor Code
router.post('/refactor', authMiddleware, async (req, res) => {
  try {
    const { code, filename } = req.body;

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are an expert code refactoring assistant. Refactor the given code to be cleaner, more efficient, and follow best practices. Return ONLY the refactored code with brief comments explaining changes. No explanations outside the code.'
        },
        {
          role: 'user',
          content: `Refactor this code from file "${filename}":\n\n${code}`
        }
      ],
      max_tokens: 2048,
      temperature: 0.3
    });

    res.json({ refactoredCode: response.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ message: 'AI error', error: err.message });
  }
});

module.exports = router;