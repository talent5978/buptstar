const { GoogleGenerativeAI } = require('@google/generative-ai');

// Import knowledge databases from the frontend
const FIELD_KNOWLEDGE_DB = require('../../data/knowledgeData');
const CASE_DB = require('../../data/redSoulData');

const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is missing in environment variables.");
    return null;
  }
  
  return new GoogleGenerativeAI(apiKey);
};

// Simple retrieval function to act as a basic RAG system
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
  const genAI = getAiClient();
  if (!genAI) {
    throw new Error('Gemini API client initialization failed. Check API key configuration.');
  }

  // 1. Retrieve relevant context from our static database
  const knowledgeContext = findRelevantContext(userQuery);

  const systemInstruction = `
    你是由北京邮电大学和中国星网集团共同打造的“邮联星课”平台的AI思政导师。
    你的名字叫“星课助手”。
    
    你的职责是：
    1. 为学生生成“定制化工程思政学习计划”。
    2. 解答关于ICT领域（通信、软件、网络安全、AI、半导体）和航天卫星互联网领域的历史、技术与精神内涵问题。
    3. 弘扬“两弹一星”精神、探月精神和红色工程师文化。
    
    重要：我将为你提供平台内部的“知识库”内容。在回答时，请优先参考这些知识库内容，使得回答更具平台特色和专业性。
    如果知识库内容提供了“权威来源”链接，请在回答的末尾引用它，格式为：[来源：XXX的权威资料](${item.sourceUrl})。
    
    ${knowledgeContext ? `
以下是相关的平台内部知识库内容：
${knowledgeContext}
` : ""}

    回答风格：
    1. 严谨、权威，体现家国情怀。
    2. 结合专业技术与思政育人。
    3. 如果学生询问学习计划，请按阶段（如：入门、进阶、实践）提供建议，并推荐相关的红色案例或标杆人物。
    
    请用Markdown格式回复。
  `;

  try {
    // Use Gemini 1.5 Flash model
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: systemInstruction
    });

    const result = await model.generateContent(userQuery);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    
    // Handle different types of errors
    if (error?.message?.includes('API_KEY_INVALID') || error?.status === 401) {
      throw new Error('Invalid API key. Please check your Gemini API key configuration.');
    } else if (error?.message?.includes('API_KEY_QUOTA_EXCEEDED') || error?.status === 429) {
      throw new Error('API quota exceeded. Please try again later.');
    } else if (error?.message?.includes('NETWORK_ERROR') || error?.status === 503) {
      throw new Error('Network error. Please check your internet connection.');
    } else {
      throw new Error('Failed to generate study plan. Please try again later.');
    }
  }
};
