import React from "react";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { engineerModels } from "../data/engineers";
import {
  Star,
  GraduationCap,
  Rocket,
  Users,
  Shield,
  ArrowLeft,
} from "lucide-react";

const EngineerStory = () => {
  const { engineerId } = useParams();
  const engineer = engineerModels.find((e) => e.id.toString() === engineerId);

  // Mock data augmentation
  const augmentedEngineer = {
    ...engineer,
    growthStory:
      engineer?.id === 1
        ? "孙家栋院士出生于1929年，1958年从苏联留学归国后，立即投身于中国航天事业。他参与了中国第一颗人造卫星'东方红一号'的研制工作，担任技术总负责人。在几十年的航天生涯中，他始终坚守在科研一线，带领团队攻克了一个又一个技术难关。即使在耄耋之年，他依然关注着中国航天事业的发展，为北斗导航系统等重大工程提供技术指导。"
        : engineer?.id === 2
        ? "华为5G研发团队组建于2009年，团队成员来自全球各地。在研发初期，面对国际巨头的技术封锁和质疑，团队成员夜以继日地工作，进行了上万次的技术试验。特别是在2013年到2018年期间，团队成员平均每天工作12小时以上，终于在5G核心技术上取得了突破性进展，在全球范围内拥有了数千项专利。"
        : engineer?.id === 3
        ? "倪光南院士1939年出生于浙江镇海，1961年毕业于南京工学院。改革开放初期，他敏锐地意识到计算机软件的重要性，开始致力于国产操作系统的研发。面对国外技术垄断和市场压力，他始终坚持自主创新的理念，推动成立了联想集团。后来，尽管遭遇挫折，但他依然初心不改，继续为中国软件产业的发展奔走呼吁。"
        : "龙芯中科团队成立于2001年，是中国最早从事国产CPU研发的团队之一。在研发过程中，团队面临着资金短缺、人才流失等诸多困难，但他们始终坚持自主创新的道路。经过多年努力，团队成功研发出龙芯系列CPU，打破了国外在通用处理器领域的垄断，为中国信息产业的自主可控做出了重要贡献。",
    educationExperience:
      engineer?.id === 1
        ? "1956年毕业于苏联茹科夫斯基空军工程学院飞机设计专业"
        : engineer?.id === 2
        ? "团队核心成员来自清华大学、北京大学、浙江大学等国内顶尖高校，以及麻省理工、斯坦福等国际名校"
        : engineer?.id === 3
        ? "1961年毕业于南京工学院（现东南大学）无线电系"
        : "团队成员多毕业于中国科学院计算技术研究所、北京大学等高校院所",
    keyInfluences:
      engineer?.id === 1
        ? [
            "苏联留学期间系统学习了航空航天理论",
            "钱学森对他的指导和影响",
            "航天工程实践中的团队协作精神",
          ]
        : engineer?.id === 2
        ? [
            "任正非的企业战略眼光",
            "全球通信技术发展趋势的把握",
            "团队成员间的知识互补",
          ]
        : engineer?.id === 3
        ? [
            "父亲对科学事业的执着态度",
            "改革开放初期科技发展的时代背景",
            "国际先进技术的启发",
          ]
        : [
            "胡伟武研究员的技术引领",
            "国家对关键核心技术的战略支持",
            "团队成员的技术积累和创新精神",
          ],
  };

  if (!engineer) {
    return (
      <div>
        <Navbar currentPage="红邮铸魂" />
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center"
          style={{ paddingTop: "var(--navbar-height)" }}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            未找到该工程师信息
          </h2>
          <p className="text-gray-600 mb-6">请检查工程师ID是否正确</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar currentPage="红邮铸魂" />
      <div
        className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white py-12"
        style={{ paddingTop: "var(--navbar-height)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">
            {augmentedEngineer.name} - 成长故事
          </h1>
          <div className="flex flex-wrap gap-3 mt-2">
            <span className="bg-blue-800/50 text-blue-100 px-2 py-1 rounded text-sm">
              {augmentedEngineer.type}
            </span>
            <span className="bg-blue-800/50 text-blue-100 px-2 py-1 rounded text-sm">
              {augmentedEngineer.field}
            </span>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-2/3">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-100 mb-8">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  成长故事
                </h2>
                <div className="prose prose-blue max-w-none">
                  <p className="text-gray-600 leading-relaxed">
                    {augmentedEngineer.growthStory}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-100 mb-8">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  教育背景
                </h2>
                <p className="text-gray-600">
                  {augmentedEngineer.educationExperience}
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-100">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  关键影响因素
                </h2>
                <div className="space-y-3">
                  {augmentedEngineer.keyInfluences?.map((influence, index) => (
                    <div key={index} className="flex items-start">
                      <div className="bg-blue-100 text-blue-800 rounded-full p-1 mt-1 mr-3">
                        <Star className="w-4 h-4" />
                      </div>
                      <p className="text-gray-700">{influence}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="md:w-1/3">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-100 mb-8">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  工程师简介
                </h3>
                <p className="text-gray-600 mb-4">{augmentedEngineer.title}</p>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                  <p className="text-gray-700 font-medium">
                    {augmentedEngineer.spirit}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-100">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  学习启示
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="bg-blue-100 text-blue-800 rounded-full p-1 mt-1 mr-3">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">坚持终身学习</p>
                      <p className="text-gray-600 text-sm">
                        不断更新知识结构，适应技术发展需求
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 text-blue-800 rounded-full p-1 mt-1 mr-3">
                      <Rocket className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">勇于创新突破</p>
                      <p className="text-gray-600 text-sm">
                        面对技术难题，敢于挑战自我
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 text-blue-800 rounded-full p-1 mt-1 mr-3">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">注重团队协作</p>
                      <p className="text-gray-600 text-sm">
                        发挥集体智慧，共同攻克技术难关
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 text-blue-800 rounded-full p-1 mt-1 mr-3">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">坚守职业道德</p>
                      <p className="text-gray-600 text-sm">
                        将个人理想与国家发展需求相结合
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

export default EngineerStory;
