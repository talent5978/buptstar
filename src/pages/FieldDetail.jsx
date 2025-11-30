import React from "react";
import Navbar from "../components/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import { fieldDetails } from "../data/fields";
import {
  ArrowLeft,
  Shield,
  Users,
  Rocket,
  Network,
  Building2,
  Star,
  Brain,
} from "lucide-react";

const FieldDetail = () => {
  const { fieldId } = useParams();
  const navigate = useNavigate();
  const field = fieldDetails[parseInt(fieldId || "1")] || fieldDetails[1];

  const getBaiduSearchLink = (keyword) => {
    return `https://chat.baidu.com/search?word=${encodeURIComponent(
      keyword
    )}&dyTabStr=MTIsMCwzLDEsMiwxMyw3LDYsNSw5&pd=csaitab&setype=csaitab&extParamsJson=%7B%22enter_type%22%3A%22search_a_tab%22%2C%22sa%22%3A%22vs_tab%22%2C%22apagelid%22%3A%2217876247506266883231%22%2C%22ori_lid%22%3A%2217876247506266883231%22%7D`;
  };

  if (!field) {
    return (
      <div>
        <Navbar currentPage="星图领航" />
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
          style={{ paddingTop: "var(--navbar-height)" }}
        >
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              领域信息未找到
            </h1>
            <p className="text-gray-600 mb-8">
              抱歉，您访问的领域信息不存在或已被移除。
            </p>
            <button
              onClick={() => navigate("/fields")}
              className="bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-yellow-700 transition-colors"
            >
              返回领域列表
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar currentPage="星图领航" />
      <div
        className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-12"
        style={{ paddingTop: "var(--navbar-height)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{field.name}</h1>
              <p className="text-blue-200 max-w-2xl">{field.description}</p>
            </div>
            <button
              onClick={() => navigate("/fields")}
              className="mt-4 md:mt-0 bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回领域列表
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-3/4">
            <section className="bg-white rounded-xl shadow-md p-6 mb-8 border-l-4 border-blue-600">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <Shield className="w-6 h-6 mr-2 text-blue-600" />
                领域概况
              </h2>
              <p className="text-gray-700 leading-relaxed">{field.overview}</p>
            </section>
            <section className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <Users className="w-6 h-6 mr-2 text-amber-600" />
                卓越工程师标杆
              </h2>
              <div className="mb-6">
                <a
                  href="https://www.gov.cn/zhengce/202401/content_6927128.htm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                >
                  国务院关于表彰国家卓越工程师和国家卓越工程师团队的决定
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    ></path>
                  </svg>
                </a>
              </div>
              <div className="mb-4 bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200">
                <p className="text-gray-800 italic">
                  工程师群体爱党报国、服务人民、敬业奉献、严谨笃实、精益求精、臻于卓越、团结协作、自立自强的崇高追求和宝贵精神，是新时代工程师的典范。
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {field.engineers.map((engineer, index) => {
                  const searchName = engineer.name
                    .replace(/团队$/, "")
                    .replace(/（.*）/, "")
                    .trim();
                  return (
                    <div
                      key={index}
                      className="bg-white rounded-lg p-5 border border-amber-200 shadow-sm hover:shadow-md transition-shadow duration-300 transform hover:-translate-y-1 transition-transform duration-300"
                    >
                      <h3 className="text-xl font-bold mb-1">
                        <a
                          href={getBaiduSearchLink(searchName)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-700 hover:text-blue-900 hover:underline"
                        >
                          {engineer.name}
                        </a>
                      </h3>
                      {engineer.affiliation && (
                        <p className="text-gray-500 text-sm mb-3 flex items-center">
                          <Building2 className="w-4 h-4 mr-1" />
                          {engineer.affiliation}
                        </p>
                      )}
                      <p className="text-gray-700 mb-3 text-sm">
                        {engineer.achievement}
                      </p>
                      <div className="bg-amber-50 px-3 py-2 rounded inline-flex items-center text-sm">
                        <Star className="w-4 h-4 mr-1 text-amber-500" />
                        <span className="text-amber-800 font-medium">
                          {engineer.spirit}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 text-gray-600 text-center text-sm">
                共展示 {field.engineers.length} 位国家卓越工程师及团队
              </div>
            </section>
            <section className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center justify-between">
                <span className="flex items-center">
                  <Rocket className="w-6 h-6 mr-2 text-purple-600" />
                  技术前沿
                </span>
                <a
                  href="https://www.ict.ac.cn/xwzx/kjdt/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center hover:underline"
                >
                  查看更多 <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
                </a>
              </h2>
              <div className="flex flex-wrap gap-3">
                {field.technologyFrontiers.map((tech, index) => (
                  <span
                    key={index}
                    className="bg-purple-100 text-purple-800 px-2 py-1 rounded-lg font-medium text-sm flex items-center"
                  >
                    <Brain className="w-4 h-4 mr-1" />
                    {tech}
                  </span>
                ))}
              </div>
            </section>
            <section className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center justify-between">
                <span className="flex items-center">
                  <Network className="w-6 h-6 mr-2 text-blue-600" />
                  近3个月内关于{field.name}的热点事件
                </span>
                <a
                  href={getBaiduSearchLink(`${field.name} 最新动态 2025`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center hover:underline"
                >
                  查看更多 <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
                </a>
              </h2>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4 py-1">
                  <h3 className="font-bold text-gray-800">
                    {field.name}领域重大项目启动
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    国家发改委近日批复{field.name}领域重大项目，总投资超过200亿元，将推动产业技术升级。
                  </p>
                  <span className="text-gray-400 text-xs mt-1 block">
                    2025-10-15
                  </span>
                </div>
                <div className="border-l-4 border-blue-500 pl-4 py-1">
                  <h3 className="font-bold text-gray-800">行业标准发布</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    工信部正式发布{field.name}
                    领域两项国家标准，填补了国内相关技术标准空白。
                  </p>
                  <span className="text-gray-400 text-xs mt-1 block">
                    2025-09-28
                  </span>
                </div>
                <div className="border-l-4 border-blue-500 pl-4 py-1">
                  <h3 className="font-bold text-gray-800">产学研合作新进展</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    国内多所高校与龙头企业联合成立{field.name}
                    创新研究院，聚焦关键技术攻关。
                  </p>
                  <span className="text-gray-400 text-xs mt-1 block">
                    2025-09-05
                  </span>
                </div>
              </div>
            </section>
            <section className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <Building2 className="w-6 h-6 mr-2 text-green-600" />
                行业使命
              </h2>
              <div className="bg-green-50 border border-green-100 rounded-lg p-5">
                <p className="text-gray-700 italic">"{field.industryMission}"</p>
              </div>
            </section>
          </div>
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">
                思政培养矩阵
              </h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">思政元素</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                      <span className="text-gray-600">科技报国</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                      <span className="text-gray-600">责任担当</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                      <span className="text-gray-600">创新精神</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-gray-600">工匠精神</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">培养目标</h4>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-1">•</span>
                      <span>树立科技报国理想</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-1">•</span>
                      <span>培养家国情怀</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-1">•</span>
                      <span>提升责任担当意识</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-1">•</span>
                      <span>强化创新实践能力</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">相关资源</h4>
                  <button
                    onClick={() => navigate("/red-engineers")}
                    className="w-full text-left bg-blue-50 hover:bg-blue-100 text-blue-800 px-3 py-2 rounded-lg mb-2 flex justify-between items-center transition-colors"
                  >
                    <span>红色工程师案例</span>
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </button>
                  <button
                    onClick={() => navigate("/enterprises")}
                    className="w-full text-left bg-blue-50 hover:bg-blue-100 text-blue-800 px-3 py-2 rounded-lg flex justify-between items-center transition-colors"
                  >
                    <span>企业资源对接</span>
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldDetail;
