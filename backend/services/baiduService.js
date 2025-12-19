// Import knowledge databases from local backend data
const FIELD_KNOWLEDGE_DB = require('../data/knowledgeData');
const CASE_DB = require('../data/redSoulData');
const fetch = require('node-fetch');

// Baidu AI API Configuration
const BAIDU_API_URL = 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions_pro';

const findRelevantContext = (query) => {
  let context = "";
  
  // Search Fields
  Object.values(FIELD_KNOWLEDGE_DB).forEach(field => {
    if (query.includes(field.name) || field.overview.includes(query)) {
      context += `\n[知识库 - ${field.name}领域]:\n${field.overview}\n${field.history}\n${field.future}\n`;
    }
  });

  // Search Cases/People
  Object.values(CASE_DB).forEach(item => {
    if (query.includes(item.title) || item.fullContent.includes(query)) {
      context += `\n[知识库 - ${item.title}]:\n${item.summary}\n${item.fullContent}\n`;
      if (item.sourceUrl) {
        context += `权威来源: ${item.sourceUrl}\n`;
      }
    }
  });

  return context;
};

module.exports.generateStudyPlan = async (userQuery) => {
  const apiKey = process.env.BAIDU_API_KEY;
  
  if (!apiKey) {
    console.error("BAIDU_API_KEY is missing in environment variables.");
    throw new Error('Baidu API key is missing in environment variables.');
  }

  try {
    // 1. Retrieve relevant context from our static database
    const knowledgeContext = findRelevantContext(userQuery);

    // 百度API不支持system角色，将system指令作为user消息的一部分
    const systemInstruction = `你是一位优秀的学习规划师，根据用户的需求，结合提供的知识库信息，为用户制定详细的学习计划。回复应该清晰、有条理，并提供具体的学习建议和资源。如果没有提供知识库信息，则根据你的专业知识进行回答。`;
    
    const fullQuery = knowledgeContext ? 
      `${systemInstruction}\n\n知识库信息：${knowledgeContext}\n\n用户问题：${userQuery}` : 
      `${systemInstruction}\n\n用户问题：${userQuery}`;

    const requestBody = {
      messages: [
        { role: "user", content: fullQuery }
      ],
      temperature: 0.7,
      top_p: 0.95,
      max_tokens: 2000,
      model: "ernie-x1-turbo-32k"
    };

    const response = await fetch(BAIDU_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.error_code) {
      // 处理百度API错误，根据错误码提供更友好的消息
      let errorMessage = `API error! code: ${data.error_code}, message: ${data.error_msg}`;
      
      // 针对常见错误码提供更友好的消息
      if (data.error_code === 336501) {
        errorMessage = '请求频率过高，请稍后再试。';
      } else if (data.error_code === 17) {
        errorMessage = '今日API请求次数已用完，请明天再试。';
      } else if (data.error_code === 336006) {
        errorMessage = 'API请求格式错误，请检查参数。';
      } else if (data.error_code === 336001) {
        errorMessage = 'API密钥无效，请检查配置。';
      }
      
      throw new Error(errorMessage);
    }

    return data.result || '生成学习计划失败。请稍后再试。';
  } catch (error) {
    console.error("Baidu API Error:", error);
    throw new Error(`生成学习计划失败: ${error.message}`);
  }
};
