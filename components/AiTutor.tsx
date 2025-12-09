import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles } from 'lucide-react';
import { generateStudyPlan } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { ChatMessage, ChatSender } from '../types';

const AiTutor: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: ChatSender.AI,
      text: '你好！我是“星课助手”。我可以为你制定**定制化工程思政学习计划**，或者解答关于**ICT与航天领域**的红色历史与技术问题。请问有什么可以帮你？',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: ChatSender.USER,
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await generateStudyPlan(userMsg.text);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: ChatSender.AI,
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, {
          id: Date.now().toString(),
          sender: ChatSender.AI,
          text: "系统繁忙，请稍后再试。",
          timestamp: new Date()
      }]);
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
              依托Gemini大模型，为你提供专属的学习路径规划。无论是想要了解“两弹一星”背后的技术难点，还是制定新时代卓越工程师的成长路线，星课助手都能为你解答。
            </p>
            <div className="space-y-4">
                <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">推荐提问</div>
                <button onClick={() => setInput("我想学习卫星互联网领域的红色工程案例，请推荐学习路径。")} className="block w-full text-left p-3 bg-white rounded-lg border border-blue-100 hover:border-blue-300 hover:shadow-md transition-all text-sm text-gray-700">
                    "我想学习卫星互联网领域的红色工程案例..."
                </button>
                <button onClick={() => setInput("作为软件工程专业的学生，我该如何培养家国情怀？")} className="block w-full text-left p-3 bg-white rounded-lg border border-blue-100 hover:border-blue-300 hover:shadow-md transition-all text-sm text-gray-700">
                    "作为软件工程专业的学生，如何培养家国情怀？"
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
                    <Bot size={20} />
                    <span className="font-semibold">星课助手 Online</span>
                </div>
                <span className="text-xs text-blue-200">AI Powered</span>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === ChatSender.USER ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex max-w-[85%] ${msg.sender === ChatSender.USER ? 'flex-row-reverse space-x-reverse' : 'flex-row'} space-x-3`}>
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.sender === ChatSender.USER ? 'bg-star-red text-white' : 'bg-bupt-blue text-white'}`}>
                                {msg.sender === ChatSender.USER ? <User size={16} /> : <Bot size={16} />}
                            </div>
                            <div className={`p-4 rounded-2xl shadow-sm text-sm ${msg.sender === ChatSender.USER ? 'bg-star-red text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'}`}>
                                <ReactMarkdown 
                                    components={{
                                        strong: ({node, ...props}) => <span className="font-bold text-yellow-500" {...props} />,
                                        ul: ({node, ...props}) => <ul className="list-disc pl-4 mt-2 mb-2" {...props} />,
                                        li: ({node, ...props}) => <li className="mb-1" {...props} />
                                    }}
                                >
                                    {msg.text}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                         <div className="flex items-center space-x-2 p-4 bg-white rounded-2xl rounded-tl-none shadow-sm border border-gray-100">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                         </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
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