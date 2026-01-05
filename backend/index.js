// Express server setup
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const llmService = require('./services/llmService');
const kolorsService = require('./services/kolorsService');
const database = require('./database');

// Load environment variables
dotenv.config({ path: __dirname + '/.env' });

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.post('/api/study-plan', async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    console.log('LLM Config - Endpoint:', process.env.LLM_API_ENDPOINT);
    console.log('LLM Config - Model:', process.env.LLM_MODEL);
    console.log('LLM Config - API Key present:', !!process.env.LLM_API_KEY);

    const result = await llmService.generateStudyPlan(query);
    res.json({ result });
  } catch (error) {
    console.error('Error in API endpoint:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Image generation API
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Image generation prompt is required' });
    }

    const apiKey = process.env.SILICON_FLOW_API_KEY;
    const imageUrl = await kolorsService.generateImage(prompt, apiKey);
    res.json({ imageUrl });
  } catch (error) {
    console.error('Error in image generation endpoint:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// ==================== 数据API接口 ====================

// 知识库接口
app.get('/api/knowledge', (req, res) => {
  try {
    const data = database.getAllKnowledge();
    res.json(data);
  } catch (error) {
    console.error('Error fetching knowledge:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/knowledge/:id', (req, res) => {
  try {
    const data = database.getKnowledgeById(req.params.id);
    if (!data) {
      return res.status(404).json({ error: 'Knowledge not found' });
    }
    res.json(data);
  } catch (error) {
    console.error('Error fetching knowledge by id:', error);
    res.status(500).json({ error: error.message });
  }
});

// 案例接口
app.get('/api/cases', (req, res) => {
  try {
    const { category } = req.query;
    let data;
    if (category) {
      data = database.getCasesByCategory(category);
    } else {
      data = database.getAllCases();
    }
    res.json(data);
  } catch (error) {
    console.error('Error fetching cases:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/cases/:id', (req, res) => {
  try {
    const data = database.getCaseById(req.params.id);
    if (!data) {
      return res.status(404).json({ error: 'Case not found' });
    }
    res.json(data);
  } catch (error) {
    console.error('Error fetching case by id:', error);
    res.status(500).json({ error: error.message });
  }
});

// 精神谱系接口
app.get('/api/spirits', (req, res) => {
  try {
    const data = database.getAllSpirits();
    res.json(data);
  } catch (error) {
    console.error('Error fetching spirits:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log('API endpoints:');
  console.log(`- POST /api/study-plan - Generate study plan`);
  console.log(`- POST /api/generate-image - Generate image using Kolors model`);
  console.log(`- GET /api/knowledge - Get all knowledge fields`);
  console.log(`- GET /api/knowledge/:id - Get knowledge by ID`);
  console.log(`- GET /api/cases - Get all cases (optional: ?category=red_engineering|model_engineer)`);
  console.log(`- GET /api/cases/:id - Get case by ID`);
  console.log(`- GET /api/spirits - Get spirit data`);
  console.log(`- GET /api/health - Health check`);
});
