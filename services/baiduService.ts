export const generateStudyPlan = async (userQuery: string): Promise<string> => {
  try {
    // 通过后端API调用硅基流动服务
    const response = await fetch('http://10.103.238.216:3001/api/study-plan-silicon', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: userQuery })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data.result || '生成学习计划失败。请稍后再试。';
  } catch (error: any) {
    console.error("API Error:", error);
    return `生成学习计划失败: ${error.message}`;
  }
};
