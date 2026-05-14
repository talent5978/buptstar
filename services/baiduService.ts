export const generateStudyPlan = async (userQuery: string): Promise<string> => {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 55000);

  try {
    // 通过后端API调用硅基流动服务
    const response = await fetch('/api/study-plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: userQuery }),
      signal: controller.signal
    });

    const rawText = await response.text();
    let data: { result?: string; error?: string; providerStatus?: number | null; providerCode?: string | null } = {};

    try {
      data = rawText ? JSON.parse(rawText) : {};
    } catch {
      data = {};
    }

    if (!response.ok) {
      const providerInfo = data.providerStatus || data.providerCode
        ? `（服务状态：${data.providerStatus || response.status}${data.providerCode ? `，代码：${data.providerCode}` : ''}）`
        : '';
      throw new Error(data.error ? `${data.error}${providerInfo}` : `AI 服务请求失败，状态码 ${response.status}`);
    }

    return data.result || '生成学习计划失败。请稍后再试。';
  } catch (error: any) {
    console.error("API Error:", error);
    if (error?.name === 'AbortError') {
      return '生成学习计划失败：请求超时，请稍后重试或缩短问题后再试。';
    }
    return `生成学习计划失败: ${error.message}`;
  } finally {
    window.clearTimeout(timeout);
  }
};

type StreamPayload = {
  token?: string;
  error?: string;
  providerStatus?: number | null;
  providerCode?: string | null;
};

const parseSseBlock = (block: string): { event: string; payload: StreamPayload } | null => {
  const event = block
    .split(/\r?\n/)
    .find((line) => line.startsWith('event:'))
    ?.slice(6)
    .trim() || 'message';
  const data = block
    .split(/\r?\n/)
    .filter((line) => line.startsWith('data:'))
    .map((line) => line.slice(5).trimStart())
    .join('\n')
    .trim();

  if (!data) return null;

  try {
    return { event, payload: JSON.parse(data) };
  } catch {
    return null;
  }
};

export const streamStudyPlan = async (
  userQuery: string,
  onToken: (token: string, fullText: string) => void
): Promise<string> => {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 60000);
  let fullText = '';

  try {
    const response = await fetch('/api/study-plan/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream'
      },
      body: JSON.stringify({ query: userQuery }),
      signal: controller.signal
    });

    if (!response.ok || !response.body) {
      return generateStudyPlan(userQuery);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    const consumeParsedEvent = (parsed: ReturnType<typeof parseSseBlock>) => {
      if (parsed?.event === 'chunk' && parsed.payload.token) {
        fullText += parsed.payload.token;
        onToken(parsed.payload.token, fullText);
      }
      if (parsed?.event === 'error') {
        const providerInfo = parsed.payload.providerStatus || parsed.payload.providerCode
          ? `（服务状态：${parsed.payload.providerStatus || '未知'}${parsed.payload.providerCode ? `，代码：${parsed.payload.providerCode}` : ''}）`
          : '';
        throw new Error(parsed.payload.error ? `${parsed.payload.error}${providerInfo}` : 'AI 服务请求失败');
      }
      return parsed?.event === 'done';
    };

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      window.clearTimeout(timeout);
      buffer += decoder.decode(value, { stream: true });

      let separatorMatch = buffer.match(/\r?\n\r?\n/);
      while (separatorMatch?.index !== undefined) {
        const separatorIndex = separatorMatch.index;
        const separatorLength = separatorMatch[0].length;
        const block = buffer.slice(0, separatorIndex);
        buffer = buffer.slice(separatorIndex + separatorLength);

        const parsed = parseSseBlock(block);
        if (consumeParsedEvent(parsed)) return fullText;

        separatorMatch = buffer.match(/\r?\n\r?\n/);
      }
    }

    buffer += decoder.decode();
    if (buffer.trim()) consumeParsedEvent(parseSseBlock(buffer));
    return fullText || '生成学习计划失败。请稍后再试。';
  } catch (error: any) {
    console.error("Streaming API Error:", error);
    if (fullText) return fullText;
    if (error?.name === 'AbortError') {
      return '生成学习计划失败：请求超时，请稍后重试或缩短问题后再试。';
    }
    return `生成学习计划失败: ${error.message}`;
  } finally {
    window.clearTimeout(timeout);
  }
};
