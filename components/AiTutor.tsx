import React, { useState, useRef, useLayoutEffect } from 'react';
import { Bot, Send, User, Sparkles } from 'lucide-react';
import { StudyPlanHistoryMessage, streamStudyPlan } from '../services/baiduService';
import ReactMarkdown from 'react-markdown';
import { ChatMessage, ChatSender } from '../types';
import { Link } from 'react-router-dom';

const AiTutor: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: ChatSender.AI,
      text: '你好！我是星课助手小卓。我可以为你制定**定制化工程思政学习计划**，或者解答关于**ICT与航天领域**的红色历史与技术问题。请问有什么可以帮你？',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const shouldShowTyping = isLoading && (
    messages[messages.length - 1]?.sender !== ChatSender.AI ||
    !messages[messages.length - 1]?.text
  );

  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  };

  useLayoutEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const history: StudyPlanHistoryMessage[] = messages
      .filter((msg) => msg.id !== 'welcome' && msg.text.trim())
      .slice(-10)
      .map((msg) => ({
        role: msg.sender === ChatSender.USER ? 'user' : 'assistant',
        content: msg.text
      }));

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: ChatSender.USER,
      text: input,
      timestamp: new Date()
    };
    const aiMsgId = `${Date.now() + 1}`;

    setMessages(prev => [
      ...prev,
      userMsg,
      {
        id: aiMsgId,
        sender: ChatSender.AI,
        text: '',
        timestamp: new Date()
      }
    ]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await streamStudyPlan(userMsg.text, (_token, fullText) => {
        setMessages(prev => prev.map(msg => (
          msg.id === aiMsgId ? { ...msg, text: fullText } : msg
        )));
      }, history);

      setMessages(prev => prev.map(msg => (
        msg.id === aiMsgId ? { ...msg, text: responseText } : msg
      )));
    } catch (e) {
      console.error(e);
      setMessages(prev => prev.map(msg => (
        msg.id === aiMsgId ? { ...msg, text: "系统繁忙，请稍后再试。" } : msg
      )));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="ai-tutor" className="py-20 bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8 items-start max-w-6xl mx-auto">
          
          {/* Info Side */}
          <div className="lg:w-1/3 p-6">
            <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-bupt-blue text-white rounded-xl shadow-lg">
                    <Sparkles size={24} />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">数智定制<br/><span className="text-xl text-blue-600 font-medium">个性化学习助手</span></h2>
            </div>
            <p className="text-gray-600 mb-8 leading-relaxed">
              依托deepseek大模型，为你提供专属的学习路径规划。无论是想要了解“两弹一星”背后的技术难点，还是制定新时代卓越工程师的成长路线，星课助手都能为你解答。
            </p>
            <div className="space-y-4">
                <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">推荐提问</div>
                <button onClick={() => setInput("我想学习卫星互联网领域的红色工程案例，请推荐学习路径。")} className="block w-full text-left p-3 bg-white rounded-lg border border-blue-100 hover:border-blue-300 hover:shadow-md transition-all text-sm text-gray-700">
                    "我想学习卫星互联网领域的红色工程案例..."
                </button>
                <button onClick={() => setInput("我是星网联培的硕士，应该前置学习哪些内容？")} className="block w-full text-left p-3 bg-white rounded-lg border border-blue-100 hover:border-blue-300 hover:shadow-md transition-all text-sm text-gray-700">
                    "我是星网联培的硕士，应该前置学习哪些内容？"
                </button>
                <button onClick={() => setInput("请介绍孙家栋院士的事迹及其精神内涵。")} className="block w-full text-left p-3 bg-white rounded-lg border border-blue-100 hover:border-blue-300 hover:shadow-md transition-all text-sm text-gray-700">
                    "请介绍孙家栋院士的事迹及其精神内涵。"
                </button>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="lg:w-2/3 w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-[600px] border border-gray-100">
            {/* Header */}
            <div className="bg-bupt-blue p-4 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-white">
                    <Link to="/image-generation" className="flex items-center transition-transform hover:scale-110 hover:rotate-12">
                        <Bot size={20} />
                    </Link>
                    <span className="font-semibold">星课助手 Online</span>
                </div>
                <span className="text-xs text-blue-200">AI Powered</span>
            </div>

            {/* Messages Area */}
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === ChatSender.USER ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex max-w-[85%] ${msg.sender === ChatSender.USER ? 'flex-row-reverse space-x-reverse' : 'flex-row'} space-x-3`}>
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center overflow-hidden ${msg.sender === ChatSender.USER ? 'bg-star-red text-white' : ''}`}>
                                {msg.sender === ChatSender.USER ? <User size={16} /> : <img src="/assets/assistant-icon.png" alt="小卓" className="w-full h-full object-cover" />}
                            </div>
                            <div className={`p-4 rounded-2xl shadow-sm text-sm ${msg.sender === ChatSender.USER ? 'bg-star-red text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'}`}>
                                <div>
                                    {(() => {
                                        // 将<think>标签内容提取并转换为带样式的div
                                        let processedText = msg.text;

                                        if (!processedText) {
                                            return <span className="text-gray-400">小卓正在思考...</span>;
                                        }
                                        
                                        // 处理大写和小写的think标签
                                        processedText = processedText.replace(/<THINK>([\s\S]*?)<\/THINK>/g, '<think>$1</think>');
                                        
                                        // 如果包含<think>标签，拆分内容
                                        if (processedText.includes('<think>')) {
                                            const parts = processedText.split(/(<think>.*?<\/think>)/s);
                                            return parts.map((part, index) => {
                                                if (part.startsWith('<think>') && part.endsWith('</think>')) {
                                                    // 处理思考部分
                                                    const thinkContent = part.replace(/<\/?think>/g, '');
                                                    return (
                                                        <div
                                                          key={index}
                                                          className="bg-gray-100 border-l-4 border-gray-300 p-2 mb-3 rounded-r-md text-[12px] leading-snug text-gray-600 italic whitespace-pre-wrap"
                                                        >
                                                          <span className="font-semibold text-gray-700 mr-1">思考过程：</span>
                                                          {thinkContent}
                                                        </div>
                                                    );
                                                } else {
                                                    // 处理普通markdown部分
                                                    return (
                                                        <ReactMarkdown 
                                                            key={index}
                                                            components={{
                                                                strong: ({node, ...props}) => <span className="font-bold text-yellow-500" {...props} />,
                                                                ul: ({node, ...props}) => <ul className="list-disc pl-4 mt-2 mb-2" {...props} />,
                                                                li: ({node, ...props}) => <li className="mb-1" {...props} />
                                                            }}
                                                        >
                                                            {part}
                                                        </ReactMarkdown>
                                                    );
                                                }
                                            });
                                        } else {
                                            // 纯markdown内容
                                            return (
                                                <ReactMarkdown 
                                                    components={{
                                                        strong: ({node, ...props}) => <span className="font-bold text-yellow-500" {...props} />,
                                                        ul: ({node, ...props}) => <ul className="list-disc pl-4 mt-2 mb-2" {...props} />,
                                                        li: ({node, ...props}) => <li className="mb-1" {...props} />
                                                    }}
                                                >
                                                    {processedText}
                                                </ReactMarkdown>
                                            );
                                        }
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {shouldShowTyping && (
                    <div className="flex justify-start">
                         <div className="flex items-center space-x-2 p-4 bg-white rounded-2xl rounded-tl-none shadow-sm border border-gray-100">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                         </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
                <div className="relative">
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="输入您的问题，开启定制化思政学习..."
                        className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-bupt-blue focus:border-transparent transition-all"
                    />
                    <button 
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className={`absolute right-2 top-2 p-1.5 rounded-full transition-colors ${input.trim() ? 'bg-bupt-blue text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AiTutor;
