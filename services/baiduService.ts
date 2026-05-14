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
