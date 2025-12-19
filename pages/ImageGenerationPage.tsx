import React, { useState } from 'react';
import { Image as ImageIcon, Send, Sparkles } from 'lucide-react';
import { generateImage } from '../services/kolorsService';

const ImageGenerationPage: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setGeneratedImage(null);

    try {
      // 调用Kolors图像生成API
      const imageUrl = await generateImage(prompt);
      if (imageUrl) {
        setGeneratedImage(imageUrl);
      } else {
        console.error('图像生成失败: 未返回有效的图像URL');
      }
    } catch (error) {
      console.error('图像生成失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8 items-start max-w-6xl mx-auto">
          
          {/* Info Side */}
          <div className="lg:w-1/3 p-6">
            <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-purple-600 text-white rounded-xl shadow-lg">
                    <ImageIcon size={24} />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">星图生成<br/><span className="text-xl text-purple-600 font-medium">创意图像生成</span></h2>
            </div>
            <p className="text-gray-600 mb-8 leading-relaxed">
              基于Kwai-Kolors/Kolors生图模型，为你生成各种风格的创意图像。无论是技术概念可视化，还是艺术创作，星图生成器都能满足你的需求。
            </p>
            <div className="space-y-4">
                <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">推荐提示词</div>
                <button 
                  onClick={() => setPrompt("卫星互联网与5G融合技术的可视化表现")} 
                  className="block w-full text-left p-3 bg-white rounded-lg border border-purple-100 hover:border-purple-300 hover:shadow-md transition-all text-sm text-gray-700"
                >
                    "卫星互联网与5G融合技术的可视化表现"
                </button>
                <button 
                  onClick={() => setPrompt("航天工程师在卫星发射中心工作的场景")} 
                  className="block w-full text-left p-3 bg-white rounded-lg border border-purple-100 hover:border-purple-300 hover:shadow-md transition-all text-sm text-gray-700"
                >
                    "航天工程师在卫星发射中心工作的场景"
                </button>
                <button 
                  onClick={() => setPrompt("未来ICT技术与红色文化融合的艺术表现")} 
                  className="block w-full text-left p-3 bg-white rounded-lg border border-purple-100 hover:border-purple-300 hover:shadow-md transition-all text-sm text-gray-700"
                >
                    "未来ICT技术与红色文化融合的艺术表现"
                </button>
            </div>
          </div>

          {/* Image Generation Interface */}
          <div className="lg:w-2/3 w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-full">
            {/* Header */}
            <div className="bg-purple-600 p-4 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-white">
                    <Sparkles size={20} />
                    <span className="font-semibold">星图生成器</span>
                </div>
                <span className="text-xs text-purple-200">AI Powered by Kolors</span>
            </div>

            {/* Input Area */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex space-x-3">
                <input
                  type="text"
                  placeholder="输入图像描述..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
                  className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                />
                <button
                  onClick={handleGenerate}
                  disabled={isLoading || !prompt.trim()}
                  className={`p-3 rounded-lg text-white transition-all transform hover:-translate-y-0.5 ${isLoading || !prompt.trim() ? 'bg-purple-300 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}
                >
                  <Send size={20} />
                </button>
              </div>
            </div>

            {/* Image Display Area */}
            <div className="flex-1 p-6 overflow-y-auto">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
                  <p>正在生成图像...</p>
                </div>
              ) : generatedImage ? (
                <div className="flex flex-col items-center">
                  <div className="bg-gray-100 p-4 rounded-xl shadow-md mb-4">
                    <img 
                      src={generatedImage} 
                      alt="Generated Image" 
                      className="max-w-full rounded-lg" 
                    />
                  </div>
                  <button
                    onClick={() => setGeneratedImage(null)}
                    className="text-sm text-purple-600 hover:text-purple-800"
                  >
                    生成新图像
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <ImageIcon size={64} className="mb-4 opacity-30" />
                  <p>输入提示词，点击生成按钮开始创建图像</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageGenerationPage;