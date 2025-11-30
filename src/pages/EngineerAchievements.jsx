import React from "react";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { engineerModels } from "../data/engineers";
import { Network, Building2, Star, ArrowLeft } from "lucide-react";

const EngineerAchievements = () => {
  const { engineerId } = useParams();
  const engineer = engineerModels.find((e) => e.id.toString() === engineerId);

  const augmentedEngineer = {
    ...engineer,
    mainAchievements:
      engineer?.id === 1
        ? "孙家栋院士是中国航天事业的重要奠基人之一，参与了中国第一颗人造卫星'东方红一号'的研制工作，担任北斗卫星导航系统总设计师。在长达60多年的航天生涯中，他领导研制了45颗卫星，见证了中国航天从无到有、从小到大的全过程。2009年，孙家栋院士获得国家最高科学技术奖，2019年被授予'共和国勋章'。他的工作为中国航天事业和国防现代化建设做出了卓越贡献。"
        : engineer?.id === 2
        ? "华为5G研发团队在全球率先突破5G核心技术，在基础理论、关键技术和系统架构等方面取得了一系列原创性成果。团队累计提交5G标准提案超过2,000件，拥有5G专利数量全球领先。他们成功研发了5G芯片、基站设备和终端产品，构建了完整的5G产业链，为中国通信产业在全球竞争中赢得了战略主动。2019年，华为5G技术获得国家科学技术进步奖特等奖。"
        : engineer?.id === 3
        ? "倪光南院士长期致力于发展中国自主可控的信息技术体系，是中国软件产业的重要推动者。他主持开发了联想式汉卡，极大地促进了汉字在计算机中的应用。作为联想集团早期技术负责人，他推动了联想成为全球知名的计算机企业。近年来，他积极倡导软件国产化和信息安全，为国家网络安全战略建言献策。2020年，倪光南院士获得'CCF终身成就奖'。"
        : "龙芯中科团队成功研发了龙芯系列CPU，填补了中国在通用处理器领域的空白。团队突破了CPU设计、制造和应用等关键技术瓶颈，形成了从处理器核设计到操作系统适配的完整技术体系。龙芯CPU已广泛应用于政府、金融、能源等关键领域，为中国信息产业自主可控做出了重要贡献。2019年，龙芯CPU获得国家科学技术进步奖一等奖。",
    technicalContributions:
      engineer?.id === 1
        ? `1. 卫星轨道设计与控制技术
2. 卫星通信系统架构设计
3. 北斗导航系统总体设计
4. 航天系统可靠性保障技术`
        : engineer?.id === 2
        ? `1. 5G新空口(NR)核心技术
2. 大规模MIMO天线技术
3. 毫米波通信技术
4. 网络切片技术`
        : engineer?.id === 3
        ? `1. 中文信息处理技术
2. 计算机辅助设计(CAD)系统
3. 国产操作系统生态建设
4. 网络安全技术体系构建`
        : `1. RISC架构处理器设计
2. 处理器微架构优化
3. 片上系统(SoC)集成技术
4. 可信计算架构设计`,
    majorProjects:
      engineer?.id === 1
        ? `1. 东方红一号卫星研制
2. 北斗一号区域导航系统建设
3. 北斗二号卫星导航系统建设
4. 北斗三号全球卫星导航系统建设`
        : engineer?.id === 2
        ? `1. 5G预研与技术验证
2. 5G标准制定与推广
3. 5G商用网络建设
4. 5G行业应用示范工程`
        : engineer?.id === 3
        ? `1. 联想式汉卡研发
2. 国产操作系统研发
3. 计算机辅助设计系统开发
4. 网络安全关键技术攻关`
        : `1. 龙芯1号CPU研发
2. 龙芯2号CPU研发
3. 龙芯3号CPU研发
4. 面向应用的CPU优化与适配`,
    honorsAndAwards:
      engineer?.id === 1
        ? [
            "国家最高科学技术奖(2009年)",
            "两弹一星功勋奖章",
            "共和国勋章(2019年)",
            "中国科学院院士",
            "国际宇航科学院院士",
          ]
        : engineer?.id === 2
        ? [
            "国家科学技术进步奖特等奖",
            "中国专利金奖",
            "全球通信技术创新奖",
            "国家科技进步奖一等奖",
          ]
        : engineer?.id === 3
        ? [
            "中国科学院院士",
            "CCF终身成就奖",
            "光华工程科技奖",
            "全国优秀科技工作者",
          ]
        : [
            "国家科学技术进步奖一等奖",
            "中国电子学会科学技术奖",
            "信息产业重大技术发明奖",
            "中国科学院杰出科技成就奖",
          ],
    ideologicalCultivation:
      engineer?.id === 1
        ? "培养强烈的爱国主义精神，将个人理想融入国家航天事业发展。弘扬严谨求实的科学态度和精益求精的工作作风，勇于担当国家重大科技任务，不计个人得失，为国家航天事业奉献终身。"
        : engineer?.id === 2
        ? "增强民族自信心和创新勇气，面对国际技术封锁，坚持自主创新道路。培养团队协作精神和集体荣誉感，形成强大的创新合力，在关键核心技术领域实现突破。"
        : engineer?.id === 3
        ? "树立科技报国的坚定信念，将个人学术追求与国家信息安全战略需求相结合。培养长期主义精神和战略眼光，不为短期利益所动，坚持自主创新和产业安全。"
        : "培养敢为人先的创新精神和坚持不懈的毅力，面对困难和挑战永不言弃。增强自主可控意识和责任担当，为保障国家信息安全贡献力量。",
    engineerSpirit:
      engineer?.id === 1
        ? "严谨求实、勇于创新、甘于奉献、协同攻关"
        : engineer?.id === 2
        ? "自主创新、追求卓越、协同作战、开放合作"
        : engineer?.id === 3
        ? "科技报国、坚持不懈、自主创新、产业担当"
        : "技术自立、长期坚持、协同攻关、应用驱动",
    relatedResources:
      engineer?.id === 1
        ? [
            { title: "北斗卫星导航系统官方网站", url: "#" },
            { title: "孙家栋院士传记", url: "#" },
            { title: "中国航天发展史", url: "#" },
          ]
        : engineer?.id === 2
        ? [
            { title: "华为5G技术白皮书", url: "#" },
            { title: "5G技术标准文档", url: "#" },
            { title: "通信技术创新案例集", url: "#" },
          ]
        : engineer?.id === 3
        ? [
            { title: "倪光南院士学术论文集", url: "#" },
            { title: "软件国产化战略研究", url: "#" },
            { title: "中国软件产业发展史", url: "#" },
          ]
        : [
            { title: "龙芯CPU技术白皮书", url: "#" },
            { title: "处理器设计原理", url: "#" },
            { title: "信息产业自主可控案例集", url: "#" },
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
            {augmentedEngineer.name} - 事迹详情
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
                  主要事迹
                </h2>
                <div className="prose prose-blue max-w-none">
                  <p className="text-gray-600 leading-relaxed">
                    {augmentedEngineer.mainAchievements}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-100 mb-8">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  技术贡献
                </h2>
                <ul className="space-y-2 text-gray-600">
                  {augmentedEngineer.technicalContributions
                    .split("\n")
                    .map((item, index) => (
                      <li key={index} className="flex items-start">
                        <div className="bg-blue-100 text-blue-800 rounded-full p-1 mt-1 mr-3">
                          <Network className="w-4 h-4" />
                        </div>
                        <span>{item.trim()}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-100 mb-8">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  重大项目经历
                </h2>
                <ul className="space-y-2 text-gray-600">
                  {augmentedEngineer.majorProjects
                    .split("\n")
                    .map((item, index) => (
                      <li key={index} className="flex items-start">
                        <div className="bg-blue-100 text-blue-800 rounded-full p-1 mt-1 mr-3">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <span>{item.trim()}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-100">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  荣誉与奖项
                </h2>
                <ul className="space-y-2 text-gray-600">
                  {augmentedEngineer.honorsAndAwards.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <div className="bg-blue-100 text-blue-800 rounded-full p-1 mt-1 mr-3">
                        <Star className="w-4 h-4" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="md:w-1/3">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-100 mb-8">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  思政培养要点
                </h3>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                  <p className="text-gray-700">
                    {augmentedEngineer.ideologicalCultivation}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-100 mb-8">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  工程师精神
                </h3>
                <div className="flex flex-wrap gap-2">
                  {augmentedEngineer.engineerSpirit
                    .split("、")
                    .map((spirit, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {spirit}
                      </span>
                    ))}
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-100">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  相关资源
                </h3>
                <ul className="space-y-3">
                  {augmentedEngineer.relatedResources.map((resource, index) => (
                    <li key={index}>
                      <a
                        href={resource.url}
                        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        <span>{resource.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngineerAchievements;
