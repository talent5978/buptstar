export const generateImage = async (prompt: string): Promise<string | null> => {
  try {
    // 通过后端API调用Kolors图像生成服务
    const response = await fetch('http://10.103.238.216:3001/api/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt: prompt })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data.imageUrl || null;
  } catch (error: any) {
    console.error("Image Generation API Error:", error);
    throw new Error(`图像生成失败: ${error.message}`);
  }
};