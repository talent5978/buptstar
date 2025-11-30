import React from "react";
import Navbar from "../components/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import { redEngineerCases } from "../data/cases";
import {
  ArrowLeft,
  GraduationCap,
  Star,
  Users,
  Shield,
  Building2,
} from "lucide-react";

const CaseDetail = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const caseItem = redEngineerCases.find((c) => c.id.toString() === caseId);

  const getBaiduSearchLink = (keyword) => {
    return `https://chat.baidu.com/search?word=${encodeURIComponent(
      keyword
    )}&dyTabStr=MTIsMCwzLDEsMiwxMyw3LDYsNSw5&pd=csaitab&setype=csaitab&extParamsJson=%7B%22enter_type%22%3A%22search_a_tab%22%2C%22sa%22%3A%22vs_tab%22%2C%22apagelid%22%3A%2217876247506266883231%22%2C%22ori_lid%22%3A%2217876247506266883231%22%7D`;
  };

  // Mock data augmentation since original data might be missing some fields for detail view
  // In a real app, this would come from the backend or a more complete data source
  const augmentedCase = {
    ...caseItem,
    developmentHistory:
      caseItem?.id === 1
        ? "北斗系统历经北斗一号、北斗二号、北斗三号三代建设，2020年完成全球组网，成为世界上第三个成熟的卫星导航系统。"
        : caseItem?.id === 2
        ? "从1955年钱学森归国，到1964年原子弹爆炸，1967年氢弹试验成功，1970年人造卫星发射，中国科技工作者克服重重困难完成了这一伟大工程。"
        : caseItem?.id === 3
        ? "从建国初期的电话线路建设，到后来的光纤通信网络，再到如今的5G网络覆盖，中国通信基础设施建设经历了跨越式发展。"
        : "从2G跟随、3G突破、4G并跑到5G领先，华为在通信领域实现了弯道超车，特别是在5G标准制定中占据了重要地位。",
    keyTechnologies:
      caseItem?.id === 1
        ? [
            "高精度星载原子钟",
            "星间链路技术",
            "全球短报文通信",
            "差分定位技术",
          ]
        : caseItem?.id === 2
        ? ["核武器设计原理", "核材料提纯技术", "航天发射技术", "精密仪器制造"]
        : caseItem?.id === 3
        ? ["长途通信干线技术", "程控交换机技术", "光纤传输技术", "通信网络优化"]
        : ["5G核心专利技术", "太赫兹通信", "大规模天线阵列", "网络切片技术"],
    educationalSignificance:
      caseItem?.id === 1
        ? "北斗精神体现了自主创新、团结协作、攻坚克难、追求卓越的价值理念，是对学生进行爱国主义教育和科技创新教育的生动教材。"
        : caseItem?.id === 2
        ? "两弹一星精神是中华民族宝贵的精神财富，激励着一代又一代科技工作者为国家富强、民族复兴而奋斗。"
        : caseItem?.id === 3
        ? "通信基础设施建设过程中体现的自力更生、艰苦创业精神，对于培养学生的工程实践能力和社会责任感具有重要意义。"
        : "华为在面对国际压力时展现出的科技自立自强精神，是新时代工程师应该学习的榜样。",
  };

  if (!caseItem) {
    return (
      <div>
        <Navbar currentPage="红邮铸魂" />
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center"
          style={{ paddingTop: "var(--navbar-height)" }}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            未找到该案例信息
          </h2>
          <p className="text-gray-600 mb-6">请检查案例ID是否正确</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar currentPage="红邮铸魂" />
      <div
        className="bg-gradient-to-r from-red-900 to-rose-800 text-white py-12"
        style={{ paddingTop: "var(--navbar-height)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">{augmentedCase.title}</h1>
          <div className="flex flex-wrap gap-3 mt-2">
            <span className="bg-red-800/50 text-red-100 px-2 py-1 rounded text-sm">
              {augmentedCase.field}
            </span>
            <span className="bg-red-800/50 text-red-100 px-2 py-1 rounded text-sm">
              {augmentedCase.era}
            </span>
            {augmentedCase.themes?.map((theme, index) => (
              <span
                key={index}
                className="bg-red-800/50 text-red-100 px-2 py-1 rounded text-sm"
              >
                {theme}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-2/3">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-red-100 mb-8">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  案例背景
                </h2>
                <p className="text-gray-600">{augmentedCase.background}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-red-100 mb-8">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  发展历程
                </h2>
                <p className="text-gray-600">
                  {augmentedCase.developmentHistory}
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-red-100 mb-8">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  关键技术
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {augmentedCase.keyTechnologies?.map((tech, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-3"
                    >
                      <p className="text-gray-700 font-medium">{tech}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-red-100">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  历史意义
                </h2>
                <p className="text-gray-600">{augmentedCase.significance}</p>
              </div>
            </div>
          </div>
          <div className="md:w-1/3">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-red-100 mb-8">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  教育意义
                </h3>
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                  <p className="text-gray-700">
                    {augmentedCase.educationalSignificance}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-red-100">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  相关资源
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="bg-red-100 text-red-800 rounded-full p-1 mt-1 mr-3">
                      <Star className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">相关学习资料</p>
                      <p className="text-gray-600 text-sm">
                        可通过学习强国平台获取更多相关案例资料
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-red-100 text-red-800 rounded-full p-1 mt-1 mr-3">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">思政元素提炼</p>
                      <p className="text-gray-600 text-sm">
                        将工程案例与思想政治教育相结合
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-red-100 text-red-800 rounded-full p-1 mt-1 mr-3">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">讨论交流</p>
                      <p className="text-gray-600 text-sm">
                        与同学和老师分享学习心得
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseDetail;
