// 通用LLM服务 - 兼容OpenAI格式API
const database = require('../database');
const fetch = require('node-fetch');
const { StringDecoder } = require('string_decoder');
const jointTrainingProjects = require('../data/jointTrainingProjects.json');

const DEFAULT_LLM_TIMEOUT_MS = 45000;
const DEFAULT_LLM_MAX_TOKENS = 1200;

class LlmServiceError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = 'LlmServiceError';
    this.statusCode = options.statusCode || 502;
    this.providerStatus = options.providerStatus || null;
    this.providerCode = options.providerCode || null;
    this.providerMessage = options.providerMessage || null;
    this.isOperational = true;
  }
}

const parseProviderError = (rawText) => {
  if (!rawText) return {};
  try {
    const parsed = JSON.parse(rawText);
    return {
      providerCode: parsed.code || parsed.error?.code || null,
      providerMessage: parsed.message || parsed.error?.message || rawText
    };
  } catch {
    return { providerMessage: rawText };
  }
};

const buildProviderErrorMessage = ({ status, providerMessage }) => {
  if (status === 401 || status === 403) {
    return providerMessage ? `AI 服务鉴权或模型不可用：${providerMessage}` : 'AI 服务鉴权失败或模型不可用';
  }
  if (status === 429) {
    return providerMessage ? `AI 服务调用频率受限：${providerMessage}` : 'AI 服务调用频率受限，请稍后重试';
  }
  if (status >= 500) {
    return providerMessage ? `AI 服务暂时不可用：${providerMessage}` : 'AI 服务暂时不可用，请稍后重试';
  }
  return providerMessage ? `AI 服务请求失败：${providerMessage}` : `AI 服务请求失败，状态码 ${status}`;
};

const readPositiveInt = (value, fallback) => {
  const parsed = Number.parseInt(String(value || ''), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const resolveTimeoutMs = (override) => readPositiveInt(override || process.env.LLM_TIMEOUT_MS, DEFAULT_LLM_TIMEOUT_MS);
const resolveMaxTokens = (override) => readPositiveInt(override || process.env.LLM_MAX_TOKENS, DEFAULT_LLM_MAX_TOKENS);

const fetchWithTimeout = async (endpoint, requestOptions, timeoutMs) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(endpoint, {
      ...requestOptions,
      signal: controller.signal
    });
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new LlmServiceError(`AI 服务响应超时（${Math.round(timeoutMs / 1000)}秒），请稍后重试或缩短问题后再试`, {
        statusCode: 503,
        providerCode: 'TIMEOUT',
        providerMessage: 'LLM request timed out'
      });
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
};

const fetchStreamWithTimeout = async (endpoint, requestOptions, timeoutMs, externalSignal) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const abortFromExternal = () => controller.abort();

  if (externalSignal) {
    if (externalSignal.aborted) controller.abort();
    else externalSignal.addEventListener('abort', abortFromExternal, { once: true });
  }

  try {
    return await fetch(endpoint, {
      ...requestOptions,
      signal: controller.signal
    });
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new LlmServiceError(`AI 服务响应超时（${Math.round(timeoutMs / 1000)}秒），请稍后重试或缩短问题后再试`, {
        statusCode: 503,
        providerCode: 'TIMEOUT',
        providerMessage: 'LLM stream request timed out'
      });
    }
    throw error;
  } finally {
    clearTimeout(timer);
    if (externalSignal) externalSignal.removeEventListener('abort', abortFromExternal);
  }
};

const buildStudyPlanMessages = (userQuery) => {
  const knowledgeContext = findRelevantContext(userQuery);
  const systemInstruction = `你是一位优秀的学习规划师"小卓"，根据用户的需求，结合提供的知识库信息，为用户制定详细的学习计划。回复应该清晰、有条理，并提供具体的学习建议和资源。如果知识库信息包含“校企联培课题库”，请优先基于其中的硕博类别、联培企业、领域、所在单位和课题名称进行个性化分析：总结用户可能涉及的课题方向、需要关注的知识体系、前置学习路线，并在信息不足时主动追问用户的类别、企业、领域或单位。不要臆造学生个人信息，也不要把课题样例说成用户已确定的个人课题。如果没有提供知识库信息，则根据你的专业知识进行回答。`;
  const userMessage = knowledgeContext
    ? `知识库信息：${knowledgeContext}\n\n用户问题：${userQuery}`
    : userQuery;

  return [
    { role: "system", content: systemInstruction },
    { role: "user", content: userMessage }
  ];
};

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

    context += buildJointTrainingContext(query);
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

const compactCounts = (records, key, limit = 8) => {
  const counts = new Map();
  records.forEach((record) => {
    const value = record[key] || '未标注';
    counts.set(value, (counts.get(value) || 0) + 1);
  });
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, count]) => `${name}${count}项`)
    .join('、');
};

const getJointTrainingRecords = () => {
  try {
    const records = database.getAllJointTrainingProjects?.();
    if (Array.isArray(records) && records.length) return records;
  } catch (error) {
    console.warn('从数据库读取校企联培课题库失败，回退到种子数据:', error.message);
  }
  return jointTrainingProjects.records || [];
};

const detectJointTrainingFilters = (query) => {
  const text = String(query || '');
  const filters = { degrees: [], enterprises: [], fields: [], units: [] };

  if (text.includes('直博')) filters.degrees.push('直博');
  else if (text.includes('博士') || text.includes('博联培')) filters.degrees.push('博士', '直博');
  if (text.includes('硕士') || text.includes('硕联培')) filters.degrees.push('硕士');

  const enterpriseAliases = [
    ['中国星网', ['中国星网', '星网']],
    ['中国电信', ['中国电信', '电信']],
    ['中国联通', ['中国联通', '联通']],
    ['中国移动', ['中国移动', '移动']],
    ['中国通号', ['中国通号', '通号']],
    ['中国电科', ['中国电科', '电科']],
    ['奇安信', ['奇安信']],
    ['华为(东莞)', ['华为', '东莞']],
    ['华为（深圳）', ['华为', '深圳']],
    ['华为技术有限公司（深圳）', ['华为', '深圳']],
    ['小米集团', ['小米']],
    ['中关村国家实验室', ['中关村国家实验室']],
    ['北京微芯区块链与边缘计算研究院', ['微芯', '区块链与边缘计算']],
    ['上海海思技术有限公司', ['海思']],
    ['燕东微电子', ['燕东']],
    ['北方华创科技集团', ['北方华创']],
    ['北方华创科技集团股份有限公司', ['北方华创']]
  ];

  enterpriseAliases.forEach(([enterprise, aliases]) => {
    if (aliases.some((alias) => text.includes(alias))) filters.enterprises.push(enterprise);
  });

  getJointTrainingRecords().forEach((record) => {
    if (record.enterprise && text.includes(record.enterprise)) filters.enterprises.push(record.enterprise);
    if (record.unit && text.includes(record.unit)) filters.units.push(record.unit);
  });

  const fieldAliases = [
    ['新一代信息通信技术', ['新一代信息通信技术', '通信', '卫星', '星座', '6G', '5G', '空天地', '网络']],
    ['网络安全', ['网络安全', '安全', '密码', '可信', '隐私']],
    ['人工智能', ['人工智能', 'AI', '大模型', '智能体', '机器学习']],
    ['半导体', ['半导体', '芯片', '集成电路', '微电子']],
    ['关键软件', ['关键软件', '软件', '操作系统']]
  ];

  fieldAliases.forEach(([field, aliases]) => {
    if (aliases.some((alias) => text.includes(alias))) filters.fields.push(field);
  });

  filters.degrees = [...new Set(filters.degrees)];
  filters.enterprises = [...new Set(filters.enterprises)];
  filters.fields = [...new Set(filters.fields)];
  filters.units = [...new Set(filters.units)];
  return filters;
};

const isJointTrainingQuery = (query, filters) => {
  const text = String(query || '');
  const triggerTerms = ['联培', '课题', '校企', '企业', '前置学习', '学习哪些', '学习路径', '培养方案', '所在单位'];
  return triggerTerms.some((term) => text.includes(term))
    || filters.enterprises.length > 0
    || filters.units.length > 0
    || (filters.degrees.length > 0 && filters.fields.length > 0);
};

const scoreJointTrainingRecord = (record, query, filters) => {
  const text = String(query || '');
  let score = 0;

  if (filters.degrees.length) {
    if (!filters.degrees.includes(record.degree)) return -1;
    score += 5;
  }
  if (filters.enterprises.length) {
    if (!filters.enterprises.includes(record.enterprise)) return -1;
    score += 8;
  }
  if (filters.fields.length) {
    if (filters.fields.includes(record.field)) score += 4;
  }
  if (filters.units.length) {
    if (!filters.units.includes(record.unit)) return -1;
    score += 6;
  }

  [record.topic, record.unit, record.field, record.enterprise].forEach((value) => {
    String(value || '')
      .split(/[、，,（）()《》\s]+/)
      .filter((word) => word.length >= 2)
      .forEach((word) => {
        if (text.includes(word)) score += 2;
      });
  });

  return score;
};

const buildJointTrainingContext = (query) => {
  const records = getJointTrainingRecords();
  const filters = detectJointTrainingFilters(query);
  if (!records.length || !isJointTrainingQuery(query, filters)) return '';

  let candidates = records
    .map((record) => ({ record, score: scoreJointTrainingRecord(record, query, filters) }))
    .filter((item) => item.score >= 0);

  if (!candidates.length) {
    candidates = records.map((record) => ({ record, score: 0 }));
  }

  candidates.sort((a, b) => b.score - a.score);
  const matched = candidates.map((item) => item.record);
  const selected = matched.slice(0, 24);
  const filterSummary = [
    filters.degrees.length ? `类别=${filters.degrees.join('/')}` : '',
    filters.enterprises.length ? `企业=${filters.enterprises.join('/')}` : '',
    filters.fields.length ? `领域=${filters.fields.join('/')}` : '',
    filters.units.length ? `单位=${filters.units.join('/')}` : ''
  ].filter(Boolean).join('，') || '未识别到明确筛选条件';

  const projectLines = selected.map((record, index) => (
    `${index + 1}. ${record.degree || '未标注'} / ${record.enterprise || '未标注'} / ${record.field || '未标注'} / ${record.unit || '未标注'}：${record.topic}`
  ));

  return `\n[校企联培课题库]\n`
    + `数据说明：${jointTrainingProjects.privacyNote}\n`
    + `总览：共${records.length}项；类别分布：${compactCounts(records, 'degree')}；领域分布：${compactCounts(records, 'field')}。\n`
    + `本次识别条件：${filterSummary}；匹配到${matched.length}项，以下为最相关课题样例。\n`
    + `${projectLines.join('\n')}\n`
    + `回答要求：基于这些课题样例概括学生可能涉及的方向、前置知识体系和建议学习路径；不要声称已确定学生具体课题；如用户未说明硕士/博士、企业、领域或单位，请先给出通用建议并主动追问这些信息。\n`;
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
  const timeoutMs = resolveTimeoutMs(config.timeoutMs);
  const maxTokens = resolveMaxTokens(config.maxTokens);

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
    // 构建请求体（OpenAI格式）
    const requestBody = {
      model: model,
      messages: buildStudyPlanMessages(userQuery),
      temperature: 0.7,
      top_p: 0.95,
      max_tokens: maxTokens
    };

    console.log(`Calling LLM API: ${endpoint} with model: ${model}, timeout: ${timeoutMs}ms, max_tokens: ${maxTokens}`);

    // 5. 发送请求
    const response = await fetchWithTimeout(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    }, timeoutMs);

    if (!response.ok) {
      const errorText = await response.text();
      const providerError = parseProviderError(errorText);
      throw new LlmServiceError(
        buildProviderErrorMessage({
          status: response.status,
          providerMessage: providerError.providerMessage
        }),
        {
          statusCode: response.status === 401 || response.status === 403 ? 502 : response.status,
          providerStatus: response.status,
          providerCode: providerError.providerCode,
          providerMessage: providerError.providerMessage
        }
      );
    }

    const data = await response.json();

    if (data.error) {
      throw new LlmServiceError(data.error.message || 'AI 服务返回错误', {
        statusCode: 502,
        providerCode: data.error.code || null,
        providerMessage: data.error.message || JSON.stringify(data.error)
      });
    }

    // 6. 提取并过滤响应内容
    let content = data.choices?.[0]?.message?.content || '生成学习计划失败。请稍后再试。';
    content = filterThinkingChain(content);

    return content;
  } catch (error) {
    console.error("LLM API Error:", error);
    if (error instanceof LlmServiceError) {
      throw error;
    }
    throw new LlmServiceError(`生成学习计划失败：${error.message}`, {
      statusCode: 502
    });
  }
};

const streamChatCompletion = async (messages, handlers = {}, options = {}) => {
  const apiKey = options.apiKey || process.env.LLM_API_KEY;
  const endpoint = options.endpoint || process.env.LLM_API_ENDPOINT;
  const model = options.model || process.env.LLM_MODEL;
  const timeoutMs = resolveTimeoutMs(options.timeoutMs);
  const maxTokens = resolveMaxTokens(options.maxTokens);

  if (!apiKey || !endpoint || !model) {
    throw new Error('LLM configuration incomplete. Check LLM_API_KEY, LLM_API_ENDPOINT, LLM_MODEL in .env');
  }

  const requestBody = {
    model,
    messages,
    temperature: options.temperature ?? 0.7,
    top_p: options.topP ?? 0.95,
    max_tokens: maxTokens,
    stream: true
  };

  console.log(`Streaming LLM API: ${endpoint} with model: ${model}, timeout: ${timeoutMs}ms, max_tokens: ${maxTokens}`);

  const response = await fetchStreamWithTimeout(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(requestBody)
  }, timeoutMs, options.signal);

  if (!response.ok) {
    const errorText = await response.text();
    const providerError = parseProviderError(errorText);
    throw new LlmServiceError(
      buildProviderErrorMessage({
        status: response.status,
        providerMessage: providerError.providerMessage
      }),
      {
        statusCode: response.status === 401 || response.status === 403 ? 502 : response.status,
        providerStatus: response.status,
        providerCode: providerError.providerCode,
        providerMessage: providerError.providerMessage
      }
    );
  }

  const decoder = new StringDecoder('utf8');
  let buffer = '';

  const consumeEventBlock = (block) => {
    const data = block
      .split(/\r?\n/)
      .filter((line) => line.startsWith('data:'))
      .map((line) => line.slice(5).trimStart())
      .join('\n')
      .trim();

    if (!data) return false;
    if (data === '[DONE]') return true;

    let parsed;
    try {
      parsed = JSON.parse(data);
    } catch {
      return false;
    }

    if (parsed.error) {
      throw new LlmServiceError(parsed.error.message || 'AI 服务返回错误', {
        statusCode: 502,
        providerCode: parsed.error.code || null,
        providerMessage: parsed.error.message || JSON.stringify(parsed.error)
      });
    }

    const content = parsed.choices?.[0]?.delta?.content || parsed.choices?.[0]?.message?.content || '';
    if (content) handlers.onToken?.(content);

    return false;
  };

  try {
    for await (const chunk of response.body) {
      if (options.signal?.aborted) break;
      buffer += decoder.write(chunk);

      let separatorIndex = buffer.search(/\r?\n\r?\n/);
      while (separatorIndex !== -1) {
        const separator = buffer.slice(separatorIndex).match(/^\r?\n\r?\n/)?.[0] || '\n\n';
        const block = buffer.slice(0, separatorIndex);
        buffer = buffer.slice(separatorIndex + separator.length);
        const done = consumeEventBlock(block);
        if (done) {
          handlers.onDone?.();
          return;
        }
        separatorIndex = buffer.search(/\r?\n\r?\n/);
      }
    }

    buffer += decoder.end();
    if (buffer.trim()) consumeEventBlock(buffer);
    handlers.onDone?.();
  } catch (error) {
    console.error("LLM Stream Error:", error);
    if (error instanceof LlmServiceError) throw error;
    throw new LlmServiceError(`生成学习计划失败：${error.message}`, {
      statusCode: 502
    });
  }
};

const streamStudyPlan = async (userQuery, handlers = {}, options = {}) => {
  return streamChatCompletion(buildStudyPlanMessages(userQuery), handlers, options);
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
  const timeoutMs = resolveTimeoutMs(options.timeoutMs);
  const maxTokens = resolveMaxTokens(options.maxTokens);

  if (!apiKey || !endpoint || !model) {
    throw new Error('LLM configuration incomplete. Check LLM_API_KEY, LLM_API_ENDPOINT, LLM_MODEL in .env');
  }

  const requestBody = {
    model: model,
    messages: messages,
    temperature: options.temperature ?? 0.7,
    top_p: options.topP ?? 0.95,
    max_tokens: maxTokens
  };

  const response = await fetchWithTimeout(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(requestBody)
  }, timeoutMs);

  if (!response.ok) {
    const errorText = await response.text();
    const providerError = parseProviderError(errorText);
    throw new LlmServiceError(
      buildProviderErrorMessage({
        status: response.status,
        providerMessage: providerError.providerMessage
      }),
      {
        statusCode: response.status === 401 || response.status === 403 ? 502 : response.status,
        providerStatus: response.status,
        providerCode: providerError.providerCode,
        providerMessage: providerError.providerMessage
      }
    );
  }

  const data = await response.json();

  if (data.error) {
    throw new LlmServiceError(data.error.message || 'AI 服务返回错误', {
      statusCode: 502,
      providerCode: data.error.code || null,
      providerMessage: data.error.message || JSON.stringify(data.error)
    });
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
  streamStudyPlan,
  streamChatCompletion,
  chatCompletion,
  findRelevantContext,
  filterThinkingChain,
  LlmServiceError
};
