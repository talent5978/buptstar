import { GoogleGenAI } from "@google/genai";
import { FIELD_KNOWLEDGE_DB } from '../data/knowledgeData';
import { CASE_DB } from '../data/redSoulData';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing in environment variables.");
    return null;
  }
  
  // 检查API密钥是否为占位符
  if (apiKey === 'your_actual_gemini_api_key_here' || apiKey === 'PLACEHOLDER_API_KEY') {
    console.error("API_KEY is still using a placeholder value. Please update it with a real API key.");
    return null;
  }
  
  return new GoogleGenAI({ apiKey });
};

// Simple retrieval function to act as a basic RAG system
const findRelevantContext = (query: string): string => {
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

export const generateStudyPlan = async (userQuery: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) {
    return "系统配置错误：未检测到API密钥。请检查.env.local文件中的GEMINI_API_KEY设置。";
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
    如果知识库内容提供了“权威来源”链接，请在回答的末尾引用它，格式为：[来源：XXX的权威资料](${'${item.sourceUrl}'})。
    
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
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userQuery,
      config: {
        systemInstruction: systemInstruction,
      }
    });
    
    return response.text || "抱歉，我现在无法回答。请稍后再试。";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // 改进错误处理，提供更具体的错误信息
    if (error?.message?.includes('API_KEY_INVALID') || error?.message?.includes('401')) {
      return "API密钥无效或已过期。请检查.env.local文件中的GEMINI_API_KEY设置是否正确。";
    } else if (error?.message?.includes('API_KEY_QUOTA_EXCEEDED') || error?.message?.includes('429')) {
      return "API请求配额已用完。请稍后再试或联系管理员增加配额。";
    } else if (error?.message?.includes('NETWORK_ERROR') || error?.message?.includes('ENOTFOUND')) {
      return "网络连接异常，请检查您的网络设置。";
    } else {
      return "系统繁忙或发生未知错误，请稍后再试。";
    }
  }
};