// Express server setup
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { generateStudyPlan } = require('./services/baiduService');

// Load environment variables
dotenv.config();

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
    
    const result = await generateStudyPlan(query);
    res.json({ result });
  } catch (error) {
    console.error('Error in API endpoint:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Silicon Flow Test API Route
app.post('/api/study-plan-silicon', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    
    // 使用用户提供的API密钥进行测试
    const apiKey = 'sk-rzsqbeobflbmrxgyawtaeznmfbvqxifrylzilvmoafotacrt';
    const siliconFlowService = require('./services/siliconFlowService');
    const result = await siliconFlowService.generateStudyPlan(query, apiKey);
    res.json({ result });
  } catch (error) {
    console.error('Error in Silicon Flow API endpoint:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
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
  console.log(`- GET /api/health - Health check`);
});
