import React from "react";
import Navbar from "../components/Navbar";
import {
  GraduationCap,
  Star,
  Rocket,
  Brain,
  ArrowLeft,
  Search,
} from "lucide-react";

const Personalized = () => {
  const getBaiduSearchLink = (keyword) => {
    return `https://chat.baidu.com/search?word=${encodeURIComponent(
      keyword
    )}&dyTabStr=MTIsMCwzLDEsMiwxMyw3LDYsNSw5&pd=csaitab&setype=csaitab&extParamsJson=%7B%22enter_type%22%3A%22search_a_tab%22%2C%22sa%22%3A%22vs_tab%22%2C%22apagelid%22%3A%2217876247506266883231%22%2C%22ori_lid%22%3A%2217876247506266883231%22%7D`;
  };

  return (
    <div className="pt-0">
      <Navbar currentPage="数智定制" />
      <div
        style={{ paddingTop: "var(--navbar-height)" }}
        className="bg-gradient-to-r from-indigo-900 to-blue-800 text-white py-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">数智定制・个性化学习</h1>
          <p className="text-indigo-200 max-w-2xl">
            基于专业方向与学习偏好，智能推荐思政内容，实现个性化学习体验
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl shadow-md p-6 border border-indigo-100">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  智能推荐内容
                </h2>
                <a
                  href={getBaiduSearchLink("ICT领域思政教育")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center transition-colors duration-200"
                >
                  查看更多推荐
                  <svg
                    className="w-4 h-4 ml-1 transition-transform duration-200 transform hover:rotate-90"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </a>
              </div>
              <div className="space-y-4">
                <div className="flex items-start p-4 bg-indigo-50 rounded-lg">
                  <div className="bg-indigo-100 text-indigo-800 rounded-lg p-2 mr-3 mt-1">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">
                      新一代信息通信技术领域思政课程
                    </h3>
                    <p className="text-gray-600 mt-1">
                      基于您的专业方向和学习偏好推荐
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        推荐指数：95%
                      </span>
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs">
                        思政融合度：高
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start p-4 bg-green-50 rounded-lg">
                  <div className="bg-green-100 text-green-800 rounded-lg p-2 mr-3 mt-1">
                    <Star className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">
                      孙家栋：航天报国的赤子之心
                    </h3>
                    <p className="text-gray-600 mt-1">
                      基于您对航天领域的兴趣推荐
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                        匹配度：92%
                      </span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                        学习时长：25分钟
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start p-4 bg-purple-50 rounded-lg">
                  <div className="bg-purple-100 text-purple-800 rounded-lg p-2 mr-3 mt-1">
                    <Rocket className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">
                      北斗导航系统：自主创新的中国力量
                    </h3>
                    <p className="text-gray-600 mt-1">
                      基于您对科技报国的关注推荐
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                        匹配度：89%
                      </span>
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                        思政元素：自主创新
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border border-indigo-100">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  学习数据分析
                </h2>
                <a
                  href="#"
                  className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center transition-colors duration-200"
                >
                  查看详细报告
                  <svg
                    className="w-4 h-4 ml-1 transition-transform duration-200 transform hover:rotate-90"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-800">12.5h</div>
                  <div className="text-sm text-gray-600 mt-1">累计学习时长</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-800">8</div>
                  <div className="text-sm text-gray-600 mt-1">完成课程数量</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-800">93%</div>
                  <div className="text-sm text-gray-600 mt-1">学习完成率</div>
                </div>
              </div>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-indigo-200">
                <p className="text-gray-500">学习数据可视化图表区域</p>
              </div>
            </div>
          </div>
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-md p-6 border border-indigo-100">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  学习计划定制
                </h2>
                <a
                  href={getBaiduSearchLink("ICT领域个性化学习设计")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center transition-colors duration-200"
                >
                  查看模板
                  <svg
                    className="w-4 h-4 ml-1 transition-transform duration-200 transform hover:rotate-90"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </a>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    专业方向
                  </label>
                  <select className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option>新一代信息通信技术</option>
                    <option>关键软件</option>
                    <option>网络安全</option>
                    <option>人工智能</option>
                    <option>半导体</option>
                    <option>航天卫星互联网</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    学习目标
                  </label>
                  <select className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option>提升思政素养</option>
                    <option>了解行业标杆</option>
                    <option>学习工程案例</option>
                    <option>掌握领域知识</option>
                  </select>
                </div>
                <button className="w-full bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200">
                  生成个性化学习计划
                </button>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border border-indigo-100">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">工程师画像</h2>
                <a
                  href="#"
                  className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center transition-colors duration-200"
                >
                  查看完整报告
                  <svg
                    className="w-4 h-4 ml-1 transition-transform duration-200 transform hover:rotate-90"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </a>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      家国情怀
                    </span>
                    <span className="text-sm text-indigo-600">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: "85%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      专业素养
                    </span>
                    <span className="text-sm text-indigo-600">92%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: "92%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      创新精神
                    </span>
                    <span className="text-sm text-indigo-600">78%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: "78%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      工匠精神
                    </span>
                    <span className="text-sm text-indigo-600">88%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: "88%" }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="font-medium text-gray-700 mb-2">提升建议</h3>
                <a
                  href={getBaiduSearchLink("ICT工程师创新精神培养")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center transition-colors duration-200"
                >
                  查看创新能力提升资源
                  <svg
                    className="w-4 h-4 ml-1 transition-transform duration-200 transform hover:rotate-90"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </a>
              </div>
              <button className="mt-6 w-full bg-indigo-100 text-indigo-700 font-medium py-2 px-4 rounded-lg hover:bg-indigo-200 transition-colors duration-200">
                完善个人画像
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Personalized;
