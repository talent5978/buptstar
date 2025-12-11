import { GoogleGenerativeAI, GenerationConfig } from '@google/generative-ai';
import { FIELD_KNOWLEDGE_DB } from '../data/knowledgeData';
import { CASE_DB } from '../data/redSoulData';

// 初始化GoogleGenAI客户端
const getAiClient = () => {
  // 从环境变量获取API密钥
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('Gemini API key is not configured. Please set VITE_GEMINI_API_KEY in your environment.');
    return null;
  }

  try {
    return new GoogleGenerativeAI(apiKey);
  } catch (error) {
    console.error('Failed to initialize Gemini client:', error);
    return null;
  }
};

// 从知识库中查找相关上下文
const findRelevantContext = (query: string): string => {
  let context = '';

  // 搜索领域知识库
  Object.values(FIELD_KNOWLEDGE_DB).forEach(field => {
    if (query.includes(field.name) || field.overview.includes(query)) {
      context += `\n[知识库 - ${field.name}领域]:\n${field.overview}\n${field.ideologicalPoint}\n${field.history}\n${field.future}\n`;
    }
  });

  // 搜索案例数据库
  Object.values(CASE_DB).forEach(item => {
    if (query.includes(item.title) || item.summary.includes(query)) {
      context += `\n[知识库 - ${item.title}]:\n${item.summary}\n${item.fullContent}\n`;
      if (item.sourceUrl) {
        context += `权威来源: ${item.sourceUrl}\n`;
      }
    }
  });

  return context;
};

export const generateStudyPlan = async (userQuery: string): Promise<string> => {
  const genAI = getAiClient();
  if (!genAI) {
    return 'Gemini API客户端初始化失败。请检查API密钥配置。';
  }

  // 1. 从静态数据库检索相关上下文
  const knowledgeContext = findRelevantContext(userQuery);

  const systemInstruction = `
    你是由北京邮电大学和中国星网集团共同打造的"邮联星课"平台的AI思政导师。
    你的名字叫"星课助手"。
    
    你的职责是：
    1. 为学生生成"定制化工程思政学习计划"。
    2. 解答关于ICT领域（通信、软件、网络安全、AI、半导体）和航天卫星互联网领域的历史、技术与精神内涵问题。
    3. 弘扬"两弹一星"精神、探月精神和红色工程师文化。
    
    重要：我将为你提供平台内部的"知识库"内容。在回答时，请优先参考这些知识库内容，使得回答更具平台特色和专业性。
    如果知识库内容提供了"权威来源"链接，请在回答中包含该链接。
    
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
    // 使用Gemini 2.5 Flash模型
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: systemInstruction
    });

    const result = await model.generateContent(userQuery);
    const response = await result.response;
    const text = await response.text();
    
    return text;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // 处理不同类型的错误
    if (error?.message?.includes('API_KEY_INVALID') || error?.status === 401) {
      return '无效的API密钥。请检查您的Gemini API密钥配置。';
    } else if (error?.message?.includes('API_KEY_QUOTA_EXCEEDED') || error?.status === 429) {
      return 'API配额已用完。请稍后再试。';
    } else if (error?.message?.includes('NETWORK_ERROR') || error?.status === 503) {
      return '网络错误。请检查您的互联网连接。';
    } else {
      return '生成学习计划失败。请稍后再试。';
    }
  }
};