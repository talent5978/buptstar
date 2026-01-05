// 通用LLM服务 - 兼容OpenAI格式API
const database = require('../database');
const fetch = require('node-fetch');

/**
 * 从数据库查找与查询相关的知识上下文
 * @param {string} query - 用户查询
 * @returns {string} - 相关知识上下文
 */
const findRelevantContext = (query) => {
  let context = "";

  try {
    // 从数据库获取知识库数据
    const knowledgeList = database.getAllKnowledge();
    knowledgeList.forEach(field => {
      if (query.includes(field.name) || (field.overview && field.overview.includes(query))) {
        context += `\n[知识库 - ${field.name}领域]:\n${field.overview}\n${field.history}\n${field.future}\n`;
      }
    });

    // 从数据库获取案例数据
    const caseList = database.getAllCases();
    caseList.forEach(item => {
      if (query.includes(item.title) || (item.full_content && item.full_content.includes(query))) {
        context += `\n[知识库 - ${item.title}]:\n${item.summary}\n${item.full_content}\n`;
        if (item.source_url) {
          context += `权威来源: ${item.source_url}\n`;
        }
      }
    });
  } catch (error) {
    console.warn('从数据库获取知识上下文失败，使用空上下文:', error.message);
  }

  return context;
};

/**
 * 过滤思维链标签
 * DeepSeek-R1模型的思维链格式可能是：
 * 1. <think>思维内容</think>正式回复
 * 2. 思维内容</think>正式回复（开头没有<think>标签）
 * @param {string} content - 原始内容
 * @returns {string} - 过滤后的内容
 */
const filterThinkingChain = (content) => {
  if (!content) return content;

  let filtered = content;

  // 情况1: 标准格式 <think>...</think>（支持大小写）
  filtered = filtered.replace(/<think>[\s\S]*?<\/think>/gi, '');

  // 情况2: 内容开头直接是思维链，只有</think>结束标签
  // 移除从开头到</think>的所有内容
  filtered = filtered.replace(/^[\s\S]*?<\/think>/gi, '');

  // 情况3: 处理未闭合的<think>标签（只有开始没有结束）
  filtered = filtered.replace(/<think>[\s\S]*/gi, '');

  // 清理多余的空白行和首尾空白
  filtered = filtered.replace(/^\s*\n/gm, '').trim();

  return filtered;
};

/**
 * 调用LLM API生成学习计划
 * @param {string} userQuery - 用户查询
 * @param {object} config - API配置 { apiKey, endpoint, model }
 * @returns {Promise<string>} - 生成的学习计划
 */
const generateStudyPlan = async (userQuery, config = {}) => {
  // 从环境变量获取配置，支持传入覆盖
  const apiKey = config.apiKey || process.env.LLM_API_KEY;
  const endpoint = config.endpoint || process.env.LLM_API_ENDPOINT;
  const model = config.model || process.env.LLM_MODEL;

  if (!apiKey) {
    console.error("LLM API key is missing.");
    throw new Error('LLM API key is missing. Please set LLM_API_KEY in .env');
  }

  if (!endpoint) {
    console.error("LLM API endpoint is missing.");
    throw new Error('LLM API endpoint is missing. Please set LLM_API_ENDPOINT in .env');
  }

  if (!model) {
    console.error("LLM model is missing.");
    throw new Error('LLM model is missing. Please set LLM_MODEL in .env');
  }

  try {
    // 1. 从数据库获取相关上下文
    const knowledgeContext = findRelevantContext(userQuery);

    // 2. 构建系统指令
    const systemInstruction = `你是一位优秀的学习规划师"小卓"，根据用户的需求，结合提供的知识库信息，为用户制定详细的学习计划。回复应该清晰、有条理，并提供具体的学习建议和资源。如果没有提供知识库信息，则根据你的专业知识进行回答。`;

    // 3. 构建用户消息（可选包含知识上下文）
    const userMessage = knowledgeContext
      ? `知识库信息：${knowledgeContext}\n\n用户问题：${userQuery}`
      : userQuery;

    // 4. 构建请求体（OpenAI格式）
    const requestBody = {
      model: model,
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: userMessage }
      ],
      temperature: 0.7,
      top_p: 0.95,
      max_tokens: 2000
    };

    console.log(`Calling LLM API: ${endpoint} with model: ${model}`);

    // 5. 发送请求
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(`API error! message: ${data.error.message || JSON.stringify(data.error)}`);
    }

    // 6. 提取并过滤响应内容
    let content = data.choices?.[0]?.message?.content || '生成学习计划失败。请稍后再试。';
    content = filterThinkingChain(content);

    return content;
  } catch (error) {
    console.error("LLM API Error:", error);
    throw new Error(`生成学习计划失败: ${error.message}`);
  }
};

/**
 * 通用聊天完成接口
 * @param {Array} messages - 消息数组 [{role, content}]
 * @param {object} options - 可选配置
 * @returns {Promise<string>} - 助手响应
 */
const chatCompletion = async (messages, options = {}) => {
  const apiKey = options.apiKey || process.env.LLM_API_KEY;
  const endpoint = options.endpoint || process.env.LLM_API_ENDPOINT;
  const model = options.model || process.env.LLM_MODEL;

  if (!apiKey || !endpoint || !model) {
    throw new Error('LLM configuration incomplete. Check LLM_API_KEY, LLM_API_ENDPOINT, LLM_MODEL in .env');
  }

  const requestBody = {
    model: model,
    messages: messages,
    temperature: options.temperature ?? 0.7,
    top_p: options.topP ?? 0.95,
    max_tokens: options.maxTokens ?? 2000
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(`API error! ${data.error.message || JSON.stringify(data.error)}`);
  }

  let content = data.choices?.[0]?.message?.content || '';

  // 默认过滤思维链，可通过选项禁用
  if (options.filterThinking !== false) {
    content = filterThinkingChain(content);
  }

  return content;
};

module.exports = {
  generateStudyPlan,
  chatCompletion,
  findRelevantContext,
  filterThinkingChain
};
