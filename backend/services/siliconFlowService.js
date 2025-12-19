// Import knowledge databases from local backend data
const FIELD_KNOWLEDGE_DB = require('../data/knowledgeData');
const CASE_DB = require('../data/redSoulData');
const fetch = require('node-fetch');

// Silicon Flow API Configuration
const SILICON_FLOW_API_URL = 'https://api.siliconflow.cn/v1/chat/completions';

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

module.exports.generateStudyPlan = async (userQuery, apiKey) => {
  if (!apiKey) {
    console.error("Silicon Flow API key is missing.");
    throw new Error('Silicon Flow API key is missing.');
  }

  try {
    // 1. Retrieve relevant context from our static database
    const knowledgeContext = findRelevantContext(userQuery);

    // System instruction
    const systemInstruction = `你是一位优秀的学习规划师，根据用户的需求，结合提供的知识库信息，为用户制定详细的学习计划。回复应该清晰、有条理，并提供具体的学习建议和资源。如果没有提供知识库信息，则根据你的专业知识进行回答。`;
    
    const fullQuery = knowledgeContext ? 
      `${systemInstruction}\n\n知识库信息：${knowledgeContext}\n\n用户问题：${userQuery}` : 
      `${systemInstruction}\n\n用户问题：${userQuery}`;

    const requestBody = {
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: userQuery }
      ],
      temperature: 0.7,
      top_p: 0.95,
      max_tokens: 2000,
      model: "deepseek-ai/DeepSeek-R1-Distill-Qwen-7B"
    };

    const response = await fetch(SILICON_FLOW_API_URL, {
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

    if (data.error) {
      throw new Error(`API error! message: ${data.error.message}`);
    }
    
    return data.choices[0].message.content || '生成学习计划失败。请稍后再试。';
  } catch (error) {
    console.error("Silicon Flow API Error:", error);
    throw new Error(`生成学习计划失败: ${error.message}`);
  }
};