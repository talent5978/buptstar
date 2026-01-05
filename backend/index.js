// Express server setup
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const siliconFlowService = require('./services/siliconFlowService');
const kolorsService = require('./services/kolorsService');

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
    
    const apiKey = process.env.SILICON_FLOW_API_KEY;
    console.log('API Key present:', !!apiKey);
    
    const result = await siliconFlowService.generateStudyPlan(query, apiKey);
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
  console.log(`- GET /api/health - Health check`);
});
