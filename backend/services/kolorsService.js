const fetch = require('node-fetch');

// Kolors API Configuration
const KOLORS_API_URL = 'https://api.siliconflow.cn/v1/images/generations';

module.exports.generateImage = async (prompt, apiKey) => {
  if (!apiKey) {
    console.error("Silicon Flow API key is missing for Kolors service.");
    throw new Error('Silicon Flow API key is missing.');
  }

  if (!prompt || prompt.trim() === '') {
    throw new Error('Image generation prompt is required.');
  }

  try {
    const requestBody = {
      model: "Kwai-Kolors/Kolors",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      response_format: "url"
    };

    const response = await fetch(KOLORS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(`API error! message: ${data.error.message}`);
    }
    
    // 返回生成的图像URL
    return data.data[0].url || null;
  } catch (error) {
    console.error("Kolors API Error:", error);
    throw new Error(`图像生成失败: ${error.message}`);
  }
};