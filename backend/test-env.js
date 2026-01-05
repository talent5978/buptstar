require('dotenv').config();
console.log('API Key present:', !!process.env.SILICON_FLOW_API_KEY);
console.log('API Key value:', process.env.SILICON_FLOW_API_KEY ? process.env.SILICON_FLOW_API_KEY.substring(0, 10) + '...' : 'missing');
console.log('PORT:', process.env.PORT);