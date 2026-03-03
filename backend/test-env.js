require('dotenv').config();
const apiKey = process.env.LLM_API_KEY || process.env.SILICON_FLOW_API_KEY;
console.log('API Key present:', !!apiKey);
console.log('API Key value:', apiKey ? apiKey.substring(0, 10) + '...' : 'missing');
console.log('Using deprecated SILICON_FLOW_API_KEY only:', !process.env.LLM_API_KEY && !!process.env.SILICON_FLOW_API_KEY);
console.log('PORT:', process.env.PORT);
