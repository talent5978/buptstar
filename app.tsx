import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { Search, Menu, Home, GraduationCap, Rocket, Building2, Shield, Star, Users, Network, Brain, ArrowLeft } from 'lucide-react';

// Mock data for the platform
const mockData = {
  fields: [
    { id: 1, name: '新一代信息通信技术', description: '涵盖5G/6G、量子通信、卫星互联网等前沿技术领域', subSections: ['领域概况', '卓越工程师标杆', '技术前沿', '行业使命'] },
    { id: 2, name: '关键软件', description: '包括操作系统、工业软件、基础软件等核心技术', subSections: ['领域概况', '卓越工程师标杆', '技术前沿', '行业使命'] },
    { id: 3, name: '网络安全', description: '涉及网络攻防、数据安全、隐私保护等关键技术', subSections: ['领域概况', '卓越工程师标杆', '技术前沿', '行业使命'] },
    { id: 4, name: '人工智能', description: '包含机器学习、深度学习、智能算法等研究方向', subSections: ['领域概况', '卓越工程师标杆', '技术前沿', '行业使命'] },
    { id: 5, name: '半导体', description: '聚焦芯片设计、制造工艺、材料科学等核心环节', subSections: ['领域概况', '卓越工程师标杆', '技术前沿', '行业使命'] },
    { id: 6, name: '航天卫星互联网', description: '涵盖卫星通信、导航定位、遥感技术等航天领域', subSections: ['领域概况', '卓越工程师标杆', '技术前沿', '行业使命'] }
  ],
  redEngineerCases: [
    { 
      id: 1, 
      title: '北斗导航系统', 
      field: '航天卫星互联网', 
      era: '现代', 
      themes: ['自主创新', '科技报国'], 
      background: '北斗卫星导航系统是中国自主建设、独立运行的全球卫星导航系统，是国家重大空间基础设施。', 
      significance: '突破国外技术封锁，实现核心技术自主可控，服务全球用户。',
      developmentHistory: '北斗系统历经北斗一号、北斗二号、北斗三号三代建设，2020年完成全球组网，成为世界上第三个成熟的卫星导航系统。',
      keyTechnologies: ['高精度星载原子钟', '星间链路技术', '全球短报文通信', '差分定位技术'],
      educationalSignificance: '北斗精神体现了自主创新、团结协作、攻坚克难、追求卓越的价值理念，是对学生进行爱国主义教育和科技创新教育的生动教材。',
      coreContributors: ['孙家栋（总设计师）', '杨长风（北斗三号系统总设计师）', '谢军（北斗三号卫星首席总师）'],
      impact: '北斗系统已广泛应用于交通、农业、林业、渔业、公安、防灾减灾等众多领域，产生了显著的经济效益和社会效益。'
    },
    { 
      id: 2, 
      title: '两弹一星工程', 
      field: '航天卫星互联网', 
      era: '历史', 
      themes: ['艰苦奋斗', '集体协作'], 
      background: '20世纪50-70年代中国自主研发原子弹、氢弹和人造卫星重大工程。', 
      significance: '奠定中国大国地位，提升国防实力，培养大批科技人才。',
      developmentHistory: '从1955年钱学森归国，到1964年原子弹爆炸，1967年氢弹试验成功，1970年人造卫星发射，中国科技工作者克服重重困难完成了这一伟大工程。',
      keyTechnologies: ['核武器设计原理', '核材料提纯技术', '航天发射技术', '精密仪器制造'],
      educationalSignificance: '两弹一星精神是中华民族宝贵的精神财富，激励着一代又一代科技工作者为国家富强、民族复兴而奋斗。',
      coreContributors: ['钱学森（火箭专家）', '邓稼先（核物理学家）', '钱三强（核物理学家）', '于敏（核物理学家）'],
      impact: '两弹一星的成功极大地提升了中国的国际地位和国防实力，为中国的和平发展奠定了坚实基础。'
    },
    { 
      id: 3, 
      title: '国家通信干线建设', 
      field: '新一代信息通信技术', 
      era: '历史', 
      themes: ['攻坚克难', '自主创新'], 
      background: '中国早期通信基础设施建设，克服地理环境和技术限制。', 
      significance: '构建全国通信网络基础，推动信息产业发展。',
      developmentHistory: '从建国初期的电话线路建设，到后来的光纤通信网络，再到如今的5G网络覆盖，中国通信基础设施建设经历了跨越式发展。',
      keyTechnologies: ['长途通信干线技术', '程控交换机技术', '光纤传输技术', '通信网络优化'],
      educationalSignificance: '通信基础设施建设过程中体现的自力更生、艰苦创业精神，对于培养学生的工程实践能力和社会责任感具有重要意义。',
      coreContributors: ['侯德原（中国通信专家）', '叶培大（光纤通信专家）', '韦乐平（通信网络专家）'],
      impact: '通信网络的快速发展极大地促进了中国经济社会的数字化转型，为数字中国建设提供了重要支撑。'
    },
    { 
      id: 4, 
      title: '华为5G技术突破', 
      field: '新一代信息通信技术', 
      era: '现代', 
      themes: ['自主创新', '科技报国'], 
      background: '面对国际技术封锁，华为在5G领域取得核心技术突破。', 
      significance: '引领全球5G标准制定，推动通信技术迭代升级。',
      developmentHistory: '从2G跟随、3G突破、4G并跑到5G领先，华为在通信领域实现了弯道超车，特别是在5G标准制定中占据了重要地位。',
      keyTechnologies: ['5G核心专利技术', '太赫兹通信', '大规模天线阵列', '网络切片技术'],
      educationalSignificance: '华为在面对国际压力时展现出的科技自立自强精神，是新时代工程师应该学习的榜样。',
      coreContributors: ['任正非（华为创始人）', '徐直军（华为轮值董事长）', '余承东（华为终端CEO）', '华为5G研发团队'],
      impact: '华为5G技术的突破引领了全球通信技术的发展方向，为构建万物互联的智能社会奠定了基础。'
    }
  ],
  engineerModels: [
    { 
      id: 1, 
      name: '孙家栋', 
      type: '个人', 
      field: '航天卫星互联网', 
      title: '航天科技专家，北斗导航系统总设计师', 
      spirit: '严谨求实、勇于创新、甘于奉献',
      growthStory: '孙家栋1929年出生于辽宁复县，1958年毕业于苏联茹科夫斯基军事航空工程学院。回国后，他投身于中国航天事业，从仿制苏联导弹开始，到自主研制火箭、卫星，再到担任北斗导航系统总设计师，始终坚守在航天科研一线。在长达60多年的航天生涯中，他参与了中国第一颗人造卫星、第一颗返回式卫星、第一颗静止轨道通信卫星等多项重大航天工程的研制工作。特别是在北斗系统建设中，他带领团队攻克了一系列关键技术难题，实现了北斗系统从无到有、从区域到全球的历史性跨越。',
      educationalBackground: ['1958年毕业于苏联茹科夫斯基军事航空工程学院', '1968年起担任中国空间技术研究院院长', '1991年当选为中国科学院院士', '2010年获得国家最高科学技术奖'],
      keyInfluencingFactors: ['爱国主义精神的驱动', '对航天事业的热爱与执着', '严谨的科学态度和创新精神', '团队协作能力与 leadership', '面对挫折时的坚韧不拔'],
      majorProjects: ['东方红一号卫星研制', '返回式卫星系列研制', '通信卫星研制', '北斗导航系统建设'],
      technicalContributions: ['提出北斗系统三步走发展战略', '攻克卫星导航关键技术', '推动北斗系统国际化应用', '培养了大批航天领域高层次人才'],
      honors: ['两弹一星功勋奖章', '国家最高科学技术奖', '改革先锋称号', '共和国勋章']
    },
    { 
      id: 2, 
      name: '华为5G研发团队', 
      type: '团队', 
      field: '新一代信息通信技术', 
      title: '5G技术研发与标准化团队', 
      spirit: '攻坚克难、协同创新、追求卓越',
      growthStory: '华为5G研发团队组建于2009年，是一支由数千名科研人员组成的国际化研发团队。团队从5G技术预研起步，历经十余年的艰苦攻关，在大规模天线阵列、太赫兹通信、网络切片等关键技术领域取得了重大突破。面对国际技术封锁和贸易限制，团队成员迎难而上，昼夜奋战，最终在5G技术研发和标准制定中占据了重要地位，使华为成为全球领先的5G技术供应商。团队的成功充分体现了中国科技工作者的创新能力和家国情怀。',
      educationalBackground: ['团队成员来自全球顶尖高校和科研机构', '拥有博士学位的科研人员占比超过30%', '与全球多所知名大学建立了联合实验室', '持续开展内部培训和技术交流活动'],
      keyInfluencingFactors: ['企业创新文化的滋养', '团队成员的专业素养和奋斗精神', '开放合作的研发理念', '持续的研发投入', '面对外部压力时的凝聚力'],
      majorProjects: ['5G NR标准制定', '华为Mate系列5G手机研发', '5G基站设备开发', '5G行业应用解决方案'],
      technicalContributions: ['提交了大量5G核心专利', '推动了大规模天线技术的应用', '开发了高效的5G网络架构', '创新了5G行业应用场景'],
      honors: ['国家科学技术进步奖', '中国标准创新贡献奖', '全球通信行业权威奖项']
    },
    { 
      id: 3, 
      name: '倪光南', 
      type: '个人', 
      field: '关键软件', 
      title: '中国工程院院士，国产操作系统倡导者', 
      spirit: '自主创新、坚持不懈、产业报国',
      growthStory: '倪光南1939年出生于浙江镇海，1961年毕业于南京工学院（现东南大学）。1964年，他赴加拿大进修，1981年回国后进入中科院计算所工作。作为中国早期计算机专家之一，他主持研发了联想式汉卡，为联想公司的创立和发展做出了重要贡献。20世纪90年代以来，他积极倡导发展国产操作系统和软件产业，被誉为"中国软件产业的良心"。尽管在推动软件国产化过程中遇到了诸多困难和挑战，但他始终坚持自己的理想和信念，为中国软件产业的自主创新大声疾呼。',
      educationalBackground: ['1961年毕业于南京工学院（现东南大学）无线电系', '1964-1968年在加拿大蒙特利尔大学进修', '1994年当选为中国工程院院士', '2011年获得中国计算机学会终身成就奖'],
      keyInfluencingFactors: ['强烈的民族责任感', '对技术创新的执着追求', '面对困难的坚韧意志', '知识分子的家国情怀', '对国家信息安全的深刻认识'],
      majorProjects: ['联想式汉卡研发', '方舟CPU研发', '红旗Linux操作系统推广', '中国软件名城建设咨询'],
      technicalContributions: ['推动了中文信息处理技术的发展', '倡导并实践了软件自主创新', '为国产CPU和操作系统的发展提供了理论支持', '培养了一批软件领域的技术人才'],
      honors: ['国家科技进步一等奖', '中国计算机学会终身成就奖', '中国软件产业十年功勋人物']
    },
    { 
      id: 4, 
      name: '龙芯中科团队', 
      type: '团队', 
      field: '半导体', 
      title: '国产CPU研发团队', 
      spirit: '技术自立、长期坚持、协同攻关',
      growthStory: '龙芯中科团队源自中国科学院计算技术研究所知识创新工程重大项目，2001年开始研发国产CPU。团队以胡伟武研究员为核心，汇聚了一批有志于实现中国CPU自主可控的科研人员。在研发初期，团队面临着技术封锁、资金短缺、人才匮乏等诸多困难，但他们凭借着坚定的信念和顽强的毅力，坚持自主创新，先后研发出龙芯1号、龙芯2号、龙芯3号等系列CPU产品。经过20多年的发展，龙芯CPU已在国防、政务、能源、交通等重要领域得到应用，为保障国家信息安全和促进产业升级做出了重要贡献。',
      educationalBackground: ['核心成员主要来自中国科学院计算技术研究所', '团队中有多位国家杰出青年科学基金获得者', '与国内多所高校建立了联合培养机制', '持续开展国际学术交流与合作'],
      keyInfluencingFactors: ['国家战略需求的驱动', '团队成员的家国情怀', '长期坚持的研发精神', '产学研用深度融合的创新模式', '自主可控的坚定信念'],
      majorProjects: ['龙芯1号CPU研发', '龙芯2号CPU研发', '龙芯3号CPU研发', '龙芯指令系统架构（LoongArch）制定'],
      technicalContributions: ['自主设计了龙芯指令系统架构', '突破了CPU设计关键技术', '构建了完整的软硬件生态系统', '推动了国产CPU的应用与产业化'],
      honors: ['国家科技进步二等奖', '中国计算机学会科技进步奖', '信息产业重大技术发明奖']
    }
  ],
  enterpriseNews: [
    { id: 1, enterprise: '中国卫星网络集团有限公司', date: '2023-11-15', title: '中国星网启动低轨卫星星座建设', content: '中国星网集团正式启动低轨卫星互联网星座建设，计划在未来5年内发射数百颗通信卫星，构建覆盖全球的卫星通信网络。' },
    { id: 2, enterprise: '国家电网有限公司', date: '2023-10-22', title: '国家电网数字化转型成果发布', content: '国家电网发布"数字电网"建设成果，实现电力系统全环节智能化管理，提高能源利用效率。' },
    { id: 3, enterprise: '华为技术有限公司', date: '2023-09-18', title: '华为发布全栈AI解决方案', content: '华为推出面向行业的全栈AI解决方案，涵盖芯片、框架、应用等全链条，助力产业智能化升级。' },
    { id: 4, enterprise: '奇安信科技集团股份有限公司', date: '2023-08-30', title: '奇安信发布新一代网络安全防护平台', content: '奇安信发布面向关键基础设施的新一代网络安全防护平台，实现威胁检测、响应、修复全流程自动化。' }
  ],
  greatSpirits: [
    { id: 1, name: '两弹一星精神', core: '热爱祖国、无私奉献，自力更生、艰苦奋斗，大力协同、勇于登攀', background: '源于20世纪50-70年代中国研制"两弹一星"的伟大实践', cases: ['钱学森归国报效', '邓稼先隐姓埋名28年', '郭永怀以身护文件'] },
    { id: 2, name: '载人航天精神', core: '特别能吃苦、特别能战斗、特别能攻关、特别能奉献', background: '源自中国载人航天工程实施过程中的实践总结', cases: ['神舟飞船研发历程', '天宫空间站建设', '航天员训练故事'] },
    { id: 3, name: '科学家精神', core: '胸怀祖国、服务人民，勇攀高峰、敢为人先，追求真理、严谨治学', background: '源于历代科学家在科研实践中的价值追求和行为准则', cases: ['黄大年放弃国外优厚待遇回国', '袁隆平毕生追求粮食安全', '南仁东22年坚守打造天眼'] }
  ],
  officialPlatforms: [
    { id: 1, name: '学习强国', url: 'https://www.xuexi.cn', description: '中共中央宣传部主管的学习平台，汇聚权威学习资源' },
    { id: 2, name: '新华思政', url: 'https://xhsz.news.cn', description: '全国高校课程思政教学资源服务平台' },
    { id: 3, name: '全国高校思政工作网', url: 'https://www.sizhengwang.cn', description: '教育部主管的高校思政工作指导平台' },
    { id: 4, name: '数字思政一站式综合服务云平台', url: 'https://dxs.moe.gov.cn', description: '教育部推出的数字思政服务平台' }
  ],
  fieldDetails: {
    1: {
      id: 1,
      name: '新一代信息通信技术',
      description: '涵盖5G/6G、量子通信、卫星互联网等前沿技术领域',
      overview: '新一代信息通信技术是国家战略性、基础性、先导性产业，是建设数字中国的重要支撑。本领域聚焦通信网络、数据传输、信息处理等核心技术，培养具有国际视野、创新能力和责任担当的卓越工程师。',
      engineers: [
        { name: '华为5G研发团队', achievement: '突破5G核心技术，推动全球5G标准制定', spirit: '协同创新、追求卓越' },
        { name: '张忠谋', achievement: '创办台积电，引领全球半导体制造', spirit: '远见卓识、精益求精' }
      ],
      technologyFrontiers: [
        '6G移动通信技术研发',
        '量子通信实用化进程',
        '空天地一体化网络构建',
        '新型网络架构设计'
      ],
      industryMission: '突破关键核心技术，推动信息通信技术自主可控，支撑数字经济发展，服务国家战略需求'
    },
    2: {
      id: 2,
      name: '关键软件',
      description: '包括操作系统、工业软件、基础软件等核心技术',
      overview: '关键软件是国家信息化建设的基础，关系到国家安全和产业安全。本领域专注于操作系统、数据库、中间件、工业软件等核心软件研发，培养具有深厚理论基础和工程实践能力的软件人才。',
      engineers: [
        { name: '倪光南', achievement: '推动国产操作系统研发，倡导软件国产化', spirit: '自主创新、产业报国' },
        { name: '中国科学院软件研究所团队', achievement: '研发麒麟操作系统，打破国外垄断', spirit: '攻坚克难、协同创新' }
      ],
      technologyFrontiers: [
        '开源操作系统生态建设',
        '工业软件自主研发与应用',
        '云原生软件架构创新',
        '软件定义网络技术'
      ],
      industryMission: '实现关键软件自主可控，构建完整软件产业链，提升国家软件产业竞争力，保障信息安全'
    },
    3: {
      id: 3,
      name: '网络安全',
      description: '涉及网络攻防、数据安全、隐私保护等关键技术',
      overview: '网络安全是数字经济时代的安全基石，关系到国家主权、安全和发展利益。本领域专注于网络空间安全理论与技术，培养具有高度政治责任感、过硬技术本领的网络安全人才。',
      engineers: [
        { name: '王小云', achievement: '破解MD5、SHA-1等密码算法，推动密码学发展', spirit: '严谨治学、勇攀高峰' },
        { name: '奇安信安全团队', achievement: '研发网络安全防护系统，保障关键信息基础设施安全', spirit: '责任担当、技术过硬' }
      ],
      technologyFrontiers: [
        '零信任安全架构',
        '量子密码与后量子密码',
        'AI驱动的威胁检测与防御',
        '隐私计算技术'
      ],
      industryMission: '构建网络安全防护体系，保障国家网络空间主权，维护关键信息基础设施安全，促进数字经济健康发展'
    },
    4: {
      id: 4,
      name: '人工智能',
      description: '包含机器学习、深度学习、智能算法等研究方向',
      overview: '人工智能是引领新一轮科技革命和产业变革的战略性技术。本领域聚焦AI基础理论、关键技术和行业应用，培养兼具创新能力和工程实践的复合型AI人才。',
      engineers: [
        { name: '黄铁军', achievement: '推动计算机视觉研究，应用于国家安全领域', spirit: '科技报国、勇于创新' },
        { name: '旷视科技团队', achievement: '研发人脸识别技术，推动AI产业化应用', spirit: '创新技术、产业落地' }
      ],
      technologyFrontiers: [
        '大模型技术与应用',
        '多模态智能',
        '人机协同增强智能',
        '可信AI与伦理治理'
      ],
      industryMission: '攻克AI核心技术，推动智能化升级，赋能传统产业，培养德才兼备的AI人才，服务国家创新驱动发展战略'
    },
    5: {
      id: 5,
      name: '半导体',
      description: '聚焦芯片设计、制造工艺、材料科学等核心环节',
      overview: '半导体是信息技术产业的基础，被誉为"工业粮食"。本领域专注于芯片设计、制造工艺、封装测试等全产业链关键技术，培养具有国际视野和创新精神的半导体人才。',
      engineers: [
        { name: '张汝京', achievement: '创办中芯国际，推动中国半导体制造发展', spirit: '产业报国、坚韧不拔' },
        { name: '中国科学院微电子研究所团队', achievement: '研发先进光刻胶，突破关键材料瓶颈', spirit: '协同创新、自主可控' }
      ],
      technologyFrontiers: [
        '先进工艺制程研发',
        '第三代半导体材料与器件',
        '芯片设计EDA工具',
        '先进封装技术'
      ],
      industryMission: '突破半导体关键核心技术，推动产业链自主可控，提升产业整体水平，保障国家信息安全和产业安全'
    },
    6: {
      id: 6,
      name: '航天卫星互联网',
      description: '涵盖卫星通信、导航定位、遥感技术等航天领域',
      overview: '航天卫星互联网是国家战略性新兴产业，是构建天地一体化信息网络的重要组成部分。本领域聚焦卫星系统设计、发射、运营等全链条技术，培养具有航天精神的卓越工程师。',
      engineers: [
        { name: '孙家栋', achievement: '北斗导航系统总设计师，中国航天事业奠基人', spirit: '严谨求实、勇于创新' },
        { name: '航天科技集团团队', achievement: '嫦娥探月工程，实现中国月球探测突破', spirit: '自主创新、协同攻坚' }
      ],
      technologyFrontiers: [
        '低轨卫星星座组网技术',
        '卫星通信高速传输',
        '空间碎片监测与清除',
        '深空探测技术'
      ],
      industryMission: '建设自主可控的卫星互联网系统，服务国家战略需求，推动航天技术应用，培养具有航天精神的卓越工程师'
    }
  }
};

// 案例详情页面组件
// 导航栏位置说明：
// 1. 使用pt-0样式保持与其他页面一致的顶部边距
// 2. 在组件内部直接嵌入Navigation组件，设置currentPage为"红邮铸魂"
// 3. 此方式使导航栏固定在页面顶部，所有详情页面保持统一的导航体验
const CaseDetailPage = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const caseDetail = mockData.redEngineerCases.find(c => c.id.toString() === caseId);
  
  // 为案例添加更多详细数据
  const enhancedCaseDetail = {
    ...caseDetail,
    developmentHistory: caseDetail?.id === 1 ? "北斗系统历经北斗一号、北斗二号、北斗三号三代建设，2020年完成全球组网，成为世界上第三个成熟的卫星导航系统。" : 
                       caseDetail?.id === 2 ? "从1955年钱学森归国，到1964年原子弹爆炸，1967年氢弹试验成功，1970年人造卫星发射，中国科技工作者克服重重困难完成了这一伟大工程。" :
                       caseDetail?.id === 3 ? "从建国初期的电话线路建设，到后来的光纤通信网络，再到如今的5G网络覆盖，中国通信基础设施建设经历了跨越式发展。" :
                       "从2G跟随、3G突破、4G并跑到5G领先，华为在通信领域实现了弯道超车，特别是在5G标准制定中占据了重要地位。",
    keyTechnologies: caseDetail?.id === 1 ? ["高精度星载原子钟", "星间链路技术", "全球短报文通信", "差分定位技术"] :
                     caseDetail?.id === 2 ? ["核武器设计原理", "核材料提纯技术", "航天发射技术", "精密仪器制造"] :
                     caseDetail?.id === 3 ? ["长途通信干线技术", "程控交换机技术", "光纤传输技术", "通信网络优化"] :
                     ["5G核心专利技术", "太赫兹通信", "大规模天线阵列", "网络切片技术"],
    educationalSignificance: caseDetail?.id === 1 ? "北斗精神体现了自主创新、团结协作、攻坚克难、追求卓越的价值理念，是对学生进行爱国主义教育和科技创新教育的生动教材。" :
                             caseDetail?.id === 2 ? "两弹一星精神是中华民族宝贵的精神财富，激励着一代又一代科技工作者为国家富强、民族复兴而奋斗。" :
                             caseDetail?.id === 3 ? "通信基础设施建设过程中体现的自力更生、艰苦创业精神，对于培养学生的工程实践能力和社会责任感具有重要意义。" :
                             "华为在面对国际压力时展现出的科技自立自强精神，是新时代工程师应该学习的榜样。"
  };
  
  if (!enhancedCaseDetail) {
    // 注：CaseDetailPage页面的导航栏设置
    // pt-0类保持一致的顶部边距，确保所有页面布局统一
    return (
      <div>
       <Navigation currentPage="红邮铸魂" />
        {/* 使用CSS变量--navbar-height设置内容区域顶部内边距，与导航栏高度保持一致 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center" style={{ paddingTop: 'var(--navbar-height)' }}>
          <h2 className="text-xl font-bold text-gray-800 mb-2">未找到该案例信息</h2>
          <p className="text-gray-600 mb-6">请检查案例ID是否正确</p>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <Navigation currentPage="红邮铸魂" />
      
      {/* 使用CSS变量--navbar-height设置内容区域顶部内边距，与导航栏高度保持一致 */}
      <div className="bg-gradient-to-r from-red-900 to-rose-800 text-white py-12" style={{ paddingTop: 'var(--navbar-height)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">{enhancedCaseDetail.title}</h1>
          <div className="flex flex-wrap gap-3 mt-2">
            <span className="bg-red-800/50 text-red-100 px-2 py-1 rounded text-sm">
              {enhancedCaseDetail.field}
            </span>
            <span className="bg-red-800/50 text-red-100 px-2 py-1 rounded text-sm">
              {enhancedCaseDetail.era}
            </span>
            {enhancedCaseDetail.themes?.map((theme, index) => (
              <span key={index} className="bg-red-800/50 text-red-100 px-2 py-1 rounded text-sm">
                {theme}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* 主内容区 */}
          <div className="md:w-2/3">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-red-100 mb-8">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">案例背景</h2>
                <p className="text-gray-600">{enhancedCaseDetail.background}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-red-100 mb-8">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">发展历程</h2>
                <p className="text-gray-600">{enhancedCaseDetail.developmentHistory}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-red-100 mb-8">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">关键技术</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {enhancedCaseDetail.keyTechnologies?.map((tech, index) => (
                    <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <p className="text-gray-700 font-medium">{tech}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-red-100">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">历史意义</h2>
                <p className="text-gray-600">{enhancedCaseDetail.significance}</p>
              </div>
            </div>
          </div>
          
          {/* 侧边栏 */}
          <div className="md:w-1/3">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-red-100 mb-8">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">教育意义</h3>
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                  <p className="text-gray-700">{enhancedCaseDetail.educationalSignificance}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-red-100">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">相关资源</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="bg-red-100 text-red-800 rounded-full p-1 mt-1 mr-3">
                      <Star className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">相关学习资料</p>
                      <p className="text-gray-600 text-sm">可通过学习强国平台获取更多相关案例资料</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-red-100 text-red-800 rounded-full p-1 mt-1 mr-3">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">思政元素提炼</p>
                      <p className="text-gray-600 text-sm">将工程案例与思想政治教育相结合</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-red-100 text-red-800 rounded-full p-1 mt-1 mr-3">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">讨论交流</p>
                      <p className="text-gray-600 text-sm">与同学和老师分享学习心得</p>
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

// 工程师成长故事页面组件
// 导航栏位置说明：
// 1. 使用pt-0样式保持与其他页面一致的顶部边距
// 2. 在组件内部直接嵌入Navigation组件，设置currentPage为"红邮铸魂"
// 3. 此方式使导航栏固定在页面顶部，所有详情页面保持统一的导航体验
const EngineerStoryPage = () => {
  const { engineerId } = useParams<{ engineerId: string }>();
  const engineerDetail = mockData.engineerModels.find(e => e.id.toString() === engineerId);
  
  // 为工程师添加更多详细的成长故事数据
  const enhancedEngineerDetail = {
    ...engineerDetail,
    growthStory: engineerDetail?.id === 1 ? "孙家栋院士出生于1929年，1958年从苏联留学归国后，立即投身于中国航天事业。他参与了中国第一颗人造卫星'东方红一号'的研制工作，担任技术总负责人。在几十年的航天生涯中，他始终坚守在科研一线，带领团队攻克了一个又一个技术难关。即使在耄耋之年，他依然关注着中国航天事业的发展，为北斗导航系统等重大工程提供技术指导。" :
                engineerDetail?.id === 2 ? "华为5G研发团队组建于2009年，团队成员来自全球各地。在研发初期，面对国际巨头的技术封锁和质疑，团队成员夜以继日地工作，进行了上万次的技术试验。特别是在2013年到2018年期间，团队成员平均每天工作12小时以上，终于在5G核心技术上取得了突破性进展，在全球范围内拥有了数千项专利。" :
                engineerDetail?.id === 3 ? "倪光南院士1939年出生于浙江镇海，1961年毕业于南京工学院。改革开放初期，他敏锐地意识到计算机软件的重要性，开始致力于国产操作系统的研发。面对国外技术垄断和市场压力，他始终坚持自主创新的理念，推动成立了联想集团。后来，尽管遭遇挫折，但他依然初心不改，继续为中国软件产业的发展奔走呼吁。" :
                "龙芯中科团队成立于2001年，是中国最早从事国产CPU研发的团队之一。在研发过程中，团队面临着资金短缺、人才流失等诸多困难，但他们始终坚持自主创新的道路。经过多年努力，团队成功研发出龙芯系列CPU，打破了国外在通用处理器领域的垄断，为中国信息产业的自主可控做出了重要贡献。",
    educationExperience: engineerDetail?.id === 1 ? "1956年毕业于苏联茹科夫斯基空军工程学院飞机设计专业" :
                        engineerDetail?.id === 2 ? "团队核心成员来自清华大学、北京大学、浙江大学等国内顶尖高校，以及麻省理工、斯坦福等国际名校" :
                        engineerDetail?.id === 3 ? "1961年毕业于南京工学院（现东南大学）无线电系" :
                        "团队成员多毕业于中国科学院计算技术研究所、北京大学等高校院所",
    keyInfluences: engineerDetail?.id === 1 ? ["苏联留学期间系统学习了航空航天理论", "钱学森对他的指导和影响", "航天工程实践中的团队协作精神"] :
                  engineerDetail?.id === 2 ? ["任正非的企业战略眼光", "全球通信技术发展趋势的把握", "团队成员间的知识互补"] :
                  engineerDetail?.id === 3 ? ["父亲对科学事业的执着态度", "改革开放初期科技发展的时代背景", "国际先进技术的启发"] :
                  ["胡伟武研究员的技术引领", "国家对关键核心技术的战略支持", "团队成员的技术积累和创新精神"]
  };
  
  if (!enhancedEngineerDetail) {
    return (
      <div>
        <Navigation currentPage="红邮铸魂" />
        {/* 使用CSS变量--navbar-height设置内容区域顶部内边距，与导航栏高度保持一致 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center" style={{ paddingTop: 'var(--navbar-height)' }}>
          <h2 className="text-xl font-bold text-gray-800 mb-2">未找到该工程师信息</h2>
          <p className="text-gray-600 mb-6">请检查工程师ID是否正确</p>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <Navigation currentPage="红邮铸魂" />
      
      {/* 使用CSS变量--navbar-height设置内容区域顶部内边距，与导航栏高度保持一致 */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white py-12" style={{ paddingTop: 'var(--navbar-height)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">{enhancedEngineerDetail.name} - 成长故事</h1>
          <div className="flex flex-wrap gap-3 mt-2">
            <span className="bg-blue-800/50 text-blue-100 px-2 py-1 rounded text-sm">
              {enhancedEngineerDetail.type}
            </span>
            <span className="bg-blue-800/50 text-blue-100 px-2 py-1 rounded text-sm">
              {enhancedEngineerDetail.field}
            </span>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* 主内容区 */}
          <div className="md:w-2/3">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-100 mb-8">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">成长故事</h2>
                <div className="prose prose-blue max-w-none">
                  <p className="text-gray-600 leading-relaxed">{enhancedEngineerDetail.growthStory}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-100 mb-8">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">教育背景</h2>
                <p className="text-gray-600">{enhancedEngineerDetail.educationExperience}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-100">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">关键影响因素</h2>
                <div className="space-y-3">
                  {enhancedEngineerDetail.keyInfluences?.map((influence, index) => (
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
          
          {/* 侧边栏 */}
          <div className="md:w-1/3">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-100 mb-8">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">工程师简介</h3>
                <p className="text-gray-600 mb-4">{enhancedEngineerDetail.title}</p>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                  <p className="text-gray-700 font-medium">{enhancedEngineerDetail.spirit}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-100">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">学习启示</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="bg-blue-100 text-blue-800 rounded-full p-1 mt-1 mr-3">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">坚持终身学习</p>
                      <p className="text-gray-600 text-sm">不断更新知识结构，适应技术发展需求</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 text-blue-800 rounded-full p-1 mt-1 mr-3">
                      <Rocket className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">勇于创新突破</p>
                      <p className="text-gray-600 text-sm">面对技术难题，敢于挑战自我</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 text-blue-800 rounded-full p-1 mt-1 mr-3">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">注重团队协作</p>
                      <p className="text-gray-600 text-sm">发挥集体智慧，共同攻克技术难关</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 text-blue-800 rounded-full p-1 mt-1 mr-3">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">坚守职业道德</p>
                      <p className="text-gray-600 text-sm">将个人理想与国家发展需求相结合</p>
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

// 工程师事迹详情页面组件
// 导航栏位置说明：
// 1. 使用pt-0样式保持与其他页面一致的顶部边距
// 2. 在组件内部直接嵌入Navigation组件，设置currentPage为"红邮铸魂"
// 3. 此方式使导航栏固定在页面顶部，所有详情页面保持统一的导航体验
const EngineerAchievementPage = () => {
  const { engineerId } = useParams<{ engineerId: string }>();
  const engineerDetail = mockData.engineerModels.find(e => e.id.toString() === engineerId);
  
  // 为工程师添加更多详细的事迹信息
  const enhancedEngineerDetail = {
    ...engineerDetail,
    mainAchievements: engineerDetail?.id === 1 ? "孙家栋院士是中国航天事业的重要奠基人之一，参与了中国第一颗人造卫星'东方红一号'的研制工作，担任北斗卫星导航系统总设计师。在长达60多年的航天生涯中，他领导研制了45颗卫星，见证了中国航天从无到有、从小到大的全过程。2009年，孙家栋院士获得国家最高科学技术奖，2019年被授予'共和国勋章'。他的工作为中国航天事业和国防现代化建设做出了卓越贡献。" :
                     engineerDetail?.id === 2 ? "华为5G研发团队在全球率先突破5G核心技术，在基础理论、关键技术和系统架构等方面取得了一系列原创性成果。团队累计提交5G标准提案超过2,000件，拥有5G专利数量全球领先。他们成功研发了5G芯片、基站设备和终端产品，构建了完整的5G产业链，为中国通信产业在全球竞争中赢得了战略主动。2019年，华为5G技术获得国家科学技术进步奖特等奖。" :
                     engineerDetail?.id === 3 ? "倪光南院士长期致力于发展中国自主可控的信息技术体系，是中国软件产业的重要推动者。他主持开发了联想式汉卡，极大地促进了汉字在计算机中的应用。作为联想集团早期技术负责人，他推动了联想成为全球知名的计算机企业。近年来，他积极倡导软件国产化和信息安全，为国家网络安全战略建言献策。2020年，倪光南院士获得'CCF终身成就奖'。" :
                     "龙芯中科团队成功研发了龙芯系列CPU，填补了中国在通用处理器领域的空白。团队突破了CPU设计、制造和应用等关键技术瓶颈，形成了从处理器核设计到操作系统适配的完整技术体系。龙芯CPU已广泛应用于政府、金融、能源等关键领域，为中国信息产业自主可控做出了重要贡献。2019年，龙芯CPU获得国家科学技术进步奖一等奖。",
    technicalContributions: engineerDetail?.id === 1 ? "1. 卫星轨道设计与控制技术\n2. 卫星通信系统架构设计\n3. 北斗导航系统总体设计\n4. 航天系统可靠性保障技术" :
                           engineerDetail?.id === 2 ? "1. 5G新空口(NR)核心技术\n2. 大规模MIMO天线技术\n3. 毫米波通信技术\n4. 网络切片技术" :
                           engineerDetail?.id === 3 ? "1. 中文信息处理技术\n2. 计算机辅助设计(CAD)系统\n3. 国产操作系统生态建设\n4. 网络安全技术体系构建" :
                           "1. RISC架构处理器设计\n2. 处理器微架构优化\n3. 片上系统(SoC)集成技术\n4. 可信计算架构设计",
    majorProjects: engineerDetail?.id === 1 ? "1. 东方红一号卫星研制\n2. 北斗一号区域导航系统建设\n3. 北斗二号卫星导航系统建设\n4. 北斗三号全球卫星导航系统建设" :
                  engineerDetail?.id === 2 ? "1. 5G预研与技术验证\n2. 5G标准制定与推广\n3. 5G商用网络建设\n4. 5G行业应用示范工程" :
                  engineerDetail?.id === 3 ? "1. 联想式汉卡研发\n2. 国产操作系统研发\n3. 计算机辅助设计系统开发\n4. 网络安全关键技术攻关" :
                  "1. 龙芯1号CPU研发\n2. 龙芯2号CPU研发\n3. 龙芯3号CPU研发\n4. 面向应用的CPU优化与适配",
    honorsAndAwards: engineerDetail?.id === 1 ? ["国家最高科学技术奖(2009年)", "两弹一星功勋奖章", "共和国勋章(2019年)", "中国科学院院士", "国际宇航科学院院士"] :
                    engineerDetail?.id === 2 ? ["国家科学技术进步奖特等奖", "中国专利金奖", "全球通信技术创新奖", "国家科技进步奖一等奖"] :
                    engineerDetail?.id === 3 ? ["中国科学院院士", "CCF终身成就奖", "光华工程科技奖", "全国优秀科技工作者"] :
                    ["国家科学技术进步奖一等奖", "中国电子学会科学技术奖", "信息产业重大技术发明奖", "中国科学院杰出科技成就奖"],
    ideologicalCultivation: engineerDetail?.id === 1 ? "培养强烈的爱国主义精神，将个人理想融入国家航天事业发展。弘扬严谨求实的科学态度和精益求精的工作作风，勇于担当国家重大科技任务，不计个人得失，为国家航天事业奉献终身。" :
                          engineerDetail?.id === 2 ? "增强民族自信心和创新勇气，面对国际技术封锁，坚持自主创新道路。培养团队协作精神和集体荣誉感，形成强大的创新合力，在关键核心技术领域实现突破。" :
                          engineerDetail?.id === 3 ? "树立科技报国的坚定信念，将个人学术追求与国家信息安全战略需求相结合。培养长期主义精神和战略眼光，不为短期利益所动，坚持自主创新和产业安全。" :
                          "培养敢为人先的创新精神和坚持不懈的毅力，面对困难和挑战永不言弃。增强自主可控意识和责任担当，为保障国家信息安全贡献力量。",
    engineerSpirit: engineerDetail?.id === 1 ? "严谨求实、勇于创新、甘于奉献、协同攻关" :
                   engineerDetail?.id === 2 ? "自主创新、追求卓越、协同作战、开放合作" :
                   engineerDetail?.id === 3 ? "科技报国、坚持不懈、自主创新、产业担当" :
                   "技术自立、长期坚持、协同攻关、应用驱动",
    relatedResources: engineerDetail?.id === 1 ? [
      { title: "北斗卫星导航系统官方网站", url: "#" },
      { title: "孙家栋院士传记", url: "#" },
      { title: "中国航天发展史", url: "#" }
    ] : engineerDetail?.id === 2 ? [
      { title: "华为5G技术白皮书", url: "#" },
      { title: "5G技术标准文档", url: "#" },
      { title: "通信技术创新案例集", url: "#" }
    ] : engineerDetail?.id === 3 ? [
      { title: "倪光南院士学术论文集", url: "#" },
      { title: "软件国产化战略研究", url: "#" },
      { title: "中国软件产业发展史", url: "#" }
    ] : [
      { title: "龙芯CPU技术白皮书", url: "#" },
      { title: "处理器设计原理", url: "#" },
      { title: "信息产业自主可控案例集", url: "#" }
    ]
  };
  
  if (!enhancedEngineerDetail) {
    return (
      <div>
        <Navigation currentPage="红邮铸魂" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center" style={{ paddingTop: 'var(--navbar-height)' }}>
          <h2 className="text-xl font-bold text-gray-800 mb-2">未找到该工程师信息</h2>
          <p className="text-gray-600 mb-6">请检查工程师ID是否正确</p>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <Navigation currentPage="红邮铸魂" />
      
      {/* 使用CSS变量--navbar-height设置内容区域顶部内边距，与导航栏高度保持一致 */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white py-12" style={{ paddingTop: 'var(--navbar-height)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">{enhancedEngineerDetail.name} - 事迹详情</h1>
          <div className="flex flex-wrap gap-3 mt-2">
            <span className="bg-blue-800/50 text-blue-100 px-2 py-1 rounded text-sm">
              {enhancedEngineerDetail.type}
            </span>
            <span className="bg-blue-800/50 text-blue-100 px-2 py-1 rounded text-sm">
              {enhancedEngineerDetail.field}
            </span>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* 主内容区 */}
          <div className="md:w-2/3">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-100 mb-8">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">主要事迹</h2>
                <div className="prose prose-blue max-w-none">
                  <p className="text-gray-600 leading-relaxed">{enhancedEngineerDetail.mainAchievements}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-100 mb-8">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">技术贡献</h2>
                <ul className="space-y-2 text-gray-600">
                  {enhancedEngineerDetail.technicalContributions.split('\n').map((item, index) => (
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
                <h2 className="text-2xl font-bold text-gray-800 mb-4">重大项目经历</h2>
                <ul className="space-y-2 text-gray-600">
                  {enhancedEngineerDetail.majorProjects.split('\n').map((item, index) => (
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
                <h2 className="text-2xl font-bold text-gray-800 mb-4">荣誉与奖项</h2>
                <ul className="space-y-2 text-gray-600">
                  {enhancedEngineerDetail.honorsAndAwards.map((award, index) => (
                    <li key={index} className="flex items-start">
                      <div className="bg-blue-100 text-blue-800 rounded-full p-1 mt-1 mr-3">
                        <Star className="w-4 h-4" />
                      </div>
                      <span>{award}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          {/* 侧边栏 */}
          <div className="md:w-1/3">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-100 mb-8">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">思政培养要点</h3>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                  <p className="text-gray-700">{enhancedEngineerDetail.ideologicalCultivation}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-100 mb-8">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">工程师精神</h3>
                <div className="flex flex-wrap gap-2">
                  {enhancedEngineerDetail.engineerSpirit.split('、').map((spirit, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {spirit}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-100">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">相关资源</h3>
                <ul className="space-y-3">
                  {enhancedEngineerDetail.relatedResources.map((resource, index) => (
                    <li key={index}>
                      <a href={resource.url} className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
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

const FieldDetailPage = () => {
  const { fieldId } = useParams<{ fieldId: string }>();
  const navigate = useNavigate();
  
  // 从mockData中获取对应领域的详细信息，添加类型断言避免类型错误
  const fieldDetail = mockData.fieldDetails[parseInt(fieldId || '1') as keyof typeof mockData.fieldDetails] || mockData.fieldDetails[1];
  
  // 如果找不到对应的领域信息，显示错误信息
  if (!fieldDetail) {
    return (
      <div>
        <Navigation currentPage="星图领航" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" style={{ paddingTop: 'var(--navbar-height)' }}>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">领域信息未找到</h1>
            <p className="text-gray-600 mb-8">抱歉，您访问的领域信息不存在或已被移除。</p>
            <button 
              onClick={() => navigate('/fields')}
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
      <Navigation currentPage="星图领航" />
      
      {/* 顶部横幅 */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-12" style={{ paddingTop: 'var(--navbar-height)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{fieldDetail.name}</h1>
              <p className="text-blue-200 max-w-2xl">{fieldDetail.description}</p>
            </div>
            <button 
              onClick={() => navigate('/fields')}
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
          {/* 左侧主内容区 */}
          <div className="lg:w-3/4">
            {/* 领域概况 */}
            <section className="bg-white rounded-xl shadow-md p-6 mb-8 border-l-4 border-blue-600">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <Shield className="w-6 h-6 mr-2 text-blue-600" />
                领域概况
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {fieldDetail.overview}
              </p>
            </section>
            
            {/* 卓越工程师标杆 */}
            <section className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Users className="w-6 h-6 mr-2 text-amber-600" />
                卓越工程师标杆
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fieldDetail.engineers.map((engineer, index) => (
                  <div key={index} className="bg-amber-50 rounded-lg p-5 border border-amber-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{engineer.name}</h3>
                    <p className="text-gray-700 mb-3 text-sm">{engineer.achievement}</p>
                    <div className="bg-white px-2 py-1 rounded inline-flex items-center text-sm">
                      <Star className="w-4 h-4 mr-1 text-amber-500" />
                      <span className="text-amber-800 font-medium">{engineer.spirit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            
            {/* 技术前沿 */}
            <section className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Rocket className="w-6 h-6 mr-2 text-purple-600" />
                技术前沿
              </h2>
              <div className="flex flex-wrap gap-3">
                {fieldDetail.technologyFrontiers.map((frontier, index) => (
                  <span 
                    key={index} 
                    className="bg-purple-100 text-purple-800 px-2 py-1 rounded-lg font-medium text-sm flex items-center"
                  >
                    <Brain className="w-4 h-4 mr-1" />
                    {frontier}
                  </span>
                ))}
              </div>
            </section>
            
            {/* 行业使命 */}
            <section className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <Building2 className="w-6 h-6 mr-2 text-green-600" />
                行业使命
              </h2>
              <div className="bg-green-50 border border-green-100 rounded-lg p-5">
                <p className="text-gray-700 italic">
                  "{fieldDetail.industryMission}"
                </p>
              </div>
            </section>
          </div>
          
          {/* 右侧侧边栏 */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">
                思政培养矩阵
              </h3>
              
              <div className="space-y-6">
                {/* 思政元素 */}
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
                
                {/* 培养目标 */}
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
                
                {/* 行业资源 */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">相关资源</h4>
                  <button 
                    onClick={() => navigate('/red-engineers')}
                    className="w-full text-left bg-blue-50 hover:bg-blue-100 text-blue-800 px-3 py-2 rounded-lg mb-2 flex justify-between items-center transition-colors"
                  >
                    <span>红色工程师案例</span>
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </button>
                  <button 
                    onClick={() => navigate('/enterprises')}
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

// Main App Component
function App() {
  return (
    <Router>
      <style>
        {`:root {
          --navbar-height: 64px;
        }`}
      </style>
      <div className="min-h-screen bg-gray-50">
         {/* 注：当前导航栏采用组件内嵌入方式，而不是全局导航栏 */}
         {/* 路由系统负责渲染各个页面组件，每个组件内部自行处理导航栏显示 */}
         <Routes>
           <Route path="/" element={<HomePage />} />
           <Route path="/fields" element={<FieldsPage />} />
           <Route path="/fields/:fieldId" element={<FieldDetailPage />} />
           <Route path="/red-engineers" element={<RedEngineersPage />} />
           <Route path="/cases/:caseId" element={<CaseDetailPage />} />
           <Route path="/engineer-stories/:engineerId" element={<EngineerStoryPage />} />
           <Route path="/engineer-achievements/:engineerId" element={<EngineerAchievementPage />} />
           <Route path="/enterprises" element={<EnterprisesPage />} />
           <Route path="/spirits" element={<SpiritsPage />} />
           <Route path="/platforms" element={<PlatformsPage />} />
           <Route path="/personalized" element={<PersonalizedPage />} />
         </Routes>
        </div>
    </Router>
  );
}

// Navigation Component
const Navigation = ({ currentPage }: { currentPage: string }) => {
  const navigate = useNavigate();
  
  const navItems = [
    { path: "/", label: "首页", icon: Home },
    { path: "/fields", label: "星途领航", icon: GraduationCap },
    { path: "/red-engineers", label: "红邮铸魂", icon: Star },
    { path: "/enterprises", label: "星联企迹", icon: Building2 },
    { path: "/spirits", label: "精神传承", icon: Shield },
    { path: "/platforms", label: "政通星联", icon: Network },
    { path: "/personalized", label: "数智定制", icon: Brain }
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-yellow-400 text-blue-900 font-bold text-xl rounded-full w-10 h-10 flex items-center justify-center">
                邮
              </div>
              <span className="font-bold text-xl hidden md:block">邮联星课</span>
              <span className="text-sm hidden md:block">数智赋能定制化工程思政云平台</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    currentPage === item.label
                      ? 'bg-blue-700 text-white'
                      : 'hover:bg-blue-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Link>
              );
            })}
          </div>
          
          <div className="flex items-center">
            <SearchBar />
            <button className="md:hidden ml-2">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Search Bar Component
const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };
  
  return (
    <form onSubmit={handleSearch} className="relative hidden md:block">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="搜索领域、案例、人物..."
        className="bg-blue-700 bg-opacity-50 border border-blue-600 rounded-lg py-1 px-3 w-64 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
      />
      <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-200 hover:text-white">
        <Search className="w-4 h-4" />
      </button>
    </form>
  );
};

// Page Components
const HomePage = () => {
  // 注：页面组件内导航栏设置
  // pt-0：设置顶部边距，确保导航栏与页面顶部有适当间距
  // Navigation组件：显示导航栏，currentPage参数用于高亮当前页面
  // 使用CSS变量--navbar-height设置内容区域顶部内边距，与导航栏高度保持一致
  return (
    <div className="pt-0">
      <Navigation currentPage="首页" />
      
      <div style={{ paddingTop: 'var(--navbar-height)' }} className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">邮联星课</h1>
          <p className="text-xl text-blue-200 mb-8">数智赋能定制化工程思政云平台</p>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg mb-8">
              聚焦ICT全产业链卓越工程人才培养，推动"思政教育+工程实践+行业特色"深度融合，打造理论共学、技术共研、难题共克的校企协同育人新生态
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/fields" className="bg-yellow-400 text-blue-900 font-bold px-6 py-3 rounded-lg hover:bg-yellow-300 transition duration-300">
                星途领航
              </Link>
              <Link to="/red-engineers" className="bg-red-500 text-white font-bold px-6 py-3 rounded-lg hover:bg-red-600 transition duration-300">
                红邮铸魂
              </Link>
              <Link to="/enterprises" className="bg-green-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-green-700 transition duration-300">
                星联企迹
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-md p-6 border border-blue-100">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <GraduationCap className="w-6 h-6 text-blue-700" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">星途领航</h3>
            <p className="text-gray-600 mb-4">聚焦六大核心领域，构建领域专属思政内容体系，实现技术知识点与思政育人点有机融合。</p>
            <Link to="/fields" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
              进入模块 <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
            </Link>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border border-red-100">
            <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Star className="w-6 h-6 text-red-700" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">红邮铸魂</h3>
            <p className="text-gray-600 mb-4">收录红色工程师案例与卓越工程师标杆，深度挖掘工程背后的家国情怀与奋斗精神。</p>
            <Link to="/red-engineers" className="text-red-600 hover:text-red-800 font-medium flex items-center">
              进入模块 <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
            </Link>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border border-green-100">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6 text-green-700" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">星联企迹</h3>
            <p className="text-gray-600 mb-4">展示联培企业大事记、行业时政动态与发展脉络，提供全景式行业认知窗口。</p>
            <Link to="/enterprises" className="text-green-600 hover:text-green-800 font-medium flex items-center">
              进入模块 <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-purple-100">
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-purple-700" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">精神传承</h3>
            <p className="text-gray-600 mb-4">系统展示两弹一星精神、载人航天精神等宝贵精神财富，加固学生思想根基。</p>
            <Link to="/spirits" className="text-purple-600 hover:text-purple-800 font-medium flex items-center">
              进入模块 <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
            </Link>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border border-yellow-100">
            <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Network className="w-6 h-6 text-yellow-800" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">政通星联</h3>
            <p className="text-gray-600 mb-4">实现与官方思政平台互联互通，扩大工程思政教育覆盖面与影响力。</p>
            <Link to="/platforms" className="text-yellow-800 hover:text-yellow-900 font-medium flex items-center">
              进入模块 <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
            </Link>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border border-indigo-100">
            <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-indigo-700" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">数智定制</h3>
            <p className="text-gray-600 mb-4">基于专业方向与学习偏好，智能推荐思政内容，实现个性化学习体验。</p>
            <Link to="/personalized" className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
              进入模块 <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
            </Link>
          </div>
        </div>
      </div>
      
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">邮联星课</h3>
              <p className="text-gray-400 mb-4">
                数智赋能定制化工程思政云平台，培养兼具家国情怀、工程素养、创新能力与行业视野的新时代卓越工程师。
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">合作单位</h3>
              <ul className="space-y-2 text-gray-400">
                <li>北京邮电大学国家卓越工程师学院</li>
                <li>中国卫星网络集团有限公司</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">联系我们</h3>
              <p className="text-gray-400">service@youlianxingke.edu.cn</p>
              <p className="text-gray-400 mt-2">北京市海淀区西土城路10号</p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-500 text-sm">
            © 2023 邮联星课数智赋能定制化工程思政云平台 版权所有
          </div>
        </div>
      </footer>
    </div>
  );
};

const FieldsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFields, setFilteredFields] = useState(mockData.fields);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredFields(mockData.fields);
    } else {
      setFilteredFields(
        mockData.fields.filter(field => 
          field.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          field.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm]);
  
  const handleViewDetails = (fieldId: number) => {
    // 使用字段ID作为URL参数
    navigate(`/fields/${fieldId}`);
  };
  
  // 注：FieldsPage页面的导航栏设置
  // 每个页面组件独立管理导航栏，通过currentPage参数控制高亮状态
  return (
    <div className="pt-0">
      <Navigation currentPage="星途领航" />
      {/* 使用CSS变量--navbar-height设置内容区域顶部内边距，与导航栏高度保持一致 */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-12" style={{ paddingTop: 'var(--navbar-height)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">星途领航・领域思政</h1>
              <p className="text-blue-200 max-w-2xl">
                聚焦六大核心领域，构建领域专属思政内容体系，实现技术知识点与思政育人点的有机融合
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="搜索领域..."
                  className="pl-10 pr-4 py-2 rounded-lg w-full md:w-64 bg-blue-800 text-white border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-3 w-4 h-4 text-blue-300" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredFields.map((field) => (
            <div key={field.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-100 hover:shadow-lg transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-start">
                  <div className="bg-blue-100 text-blue-800 rounded-lg p-2 mr-4 mt-1">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{field.name}</h3>
                    <p className="text-gray-600 mb-4">{field.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {field.subSections.map((section, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                          {section}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-blue-50">
                      <span className="text-sm text-blue-600 font-medium">思政培养矩阵</span>
                      <button 
                        onClick={() => handleViewDetails(field.id)}
                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                      >
                        详情 <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredFields.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">未找到与 "{searchTerm}" 相关的领域</p>
            <button 
              onClick={() => setSearchTerm('')} 
              className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
            >
              清除搜索条件
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const RedEngineersPage = () => {
  const [activeTab, setActiveTab] = useState('cases');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCases, setFilteredCases] = useState(mockData.redEngineerCases);
  const [filteredModels, setFilteredModels] = useState(mockData.engineerModels);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCases(mockData.redEngineerCases);
      setFilteredModels(mockData.engineerModels);
    } else {
      setFilteredCases(
        mockData.redEngineerCases.filter(item => 
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
          item.field.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.background.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredModels(
        mockData.engineerModels.filter(item => 
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          item.field.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm]);
  
  return (
    <div className="pt-0">
      <Navigation currentPage="红邮铸魂" />
      {/* 使用CSS变量--navbar-height设置内容区域顶部内边距，与导航栏高度保持一致 */}
      <div className="bg-gradient-to-r from-red-900 to-red-800 text-white py-12" style={{ paddingTop: 'var(--navbar-height)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">红邮铸魂・榜样示范</h1>
              <p className="text-red-200 max-w-2xl">
                聚焦红色工程师与行业标杆，传递初心使命与职业担当，明确新时代卓越工程师画像
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="搜索案例或人物..."
                  className="pl-10 pr-4 py-2 rounded-lg w-full md:w-64 bg-red-800 text-white border border-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <Search className="absolute left-3 top-3 w-4 h-4 text-red-300" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('cases')}
              className={`px-1 py-4 text-sm font-medium ${
                activeTab === 'cases'
                  ? 'text-red-600 border-b-2 border-red-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              红色工程案例库
            </button>
            <button
              onClick={() => setActiveTab('models')}
              className={`px-1 py-4 text-sm font-medium ${
                activeTab === 'models'
                  ? 'text-red-600 border-b-2 border-red-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              卓越工程师标杆库
            </button>
          </nav>
        </div>
        
        {activeTab === 'cases' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredCases.map((item: typeof mockData.redEngineerCases[0]) => (
              <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-red-100 hover:shadow-lg transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex items-start">
                    <div className="bg-red-100 text-red-800 rounded-lg p-2 mr-4 mt-1">
                      <Rocket className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="px-2 py-1 bg-red-50 text-red-700 rounded text-xs font-medium">{item.field}</span>
                        <span className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded text-xs font-medium">{item.era}</span>
                        {item.themes.map((theme, index) => (
                          <span key={index} className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs font-medium">
                            {theme}
                          </span>
                        ))}
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                      <p className="text-gray-600 mb-4">{item.background}</p>
                      
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-red-50">
                        <span className="text-sm text-red-600 font-medium">历史意义：{item.significance}</span>
                        <button 
                          onClick={() => navigate(`/cases/${item.id}`)}
                          className="text-red-600 hover:text-red-800 font-medium flex items-center"
                        >
                          详情 <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'models' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredModels.map((item: typeof mockData.engineerModels[0]) => (
              <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-yellow-100 hover:shadow-lg transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex items-start">
                    <div className={`rounded-lg p-2 mr-4 mt-1 ${
                      item.type === '个人' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {item.type === '个人' ? (
                        <Users className="w-6 h-6" />
                      ) : (
                        <Users className="w-6 h-6" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className={`px-2 py-1 ${
                          item.type === '个人' 
                            ? 'bg-blue-50 text-blue-700' 
                            : 'bg-green-50 text-green-700'
                        } rounded text-xs font-medium`}>
                          {item.type}标杆
                        </span>
                        <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs font-medium">
                          {item.field}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{item.name}</h3>
                      <p className="text-gray-600 mb-2">{item.title}</p>
                      <p className="text-sm text-yellow-700 font-medium bg-yellow-50 p-2 rounded-lg mb-4">
                        精神内核：{item.spirit}
                      </p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <button 
                          onClick={() => navigate(`/engineer-stories/${item.id}`)}
                          className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                        >
                          成长故事 <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
                        </button>
                        <button 
                          onClick={() => navigate(`/engineer-achievements/${item.id}`)}
                          className="text-green-600 hover:text-green-800 font-medium flex items-center"
                        >
                          事迹详情 <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {(activeTab === 'cases' && filteredCases.length === 0) || (activeTab === 'models' && filteredModels.length === 0) && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">未找到与 "{searchTerm}" 相关的内容</p>
            <button 
              onClick={() => setSearchTerm('')} 
              className="mt-4 text-red-600 hover:text-red-800 font-medium"
            >
              清除搜索条件
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const EnterprisesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNews, setFilteredNews] = useState(mockData.enterpriseNews);
  
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredNews(mockData.enterpriseNews);
    } else {
      setFilteredNews(
        mockData.enterpriseNews.filter(item => 
          item.enterprise.toLowerCase().includes(searchTerm.toLowerCase()) || 
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.content.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm]);
  
  // 注：EnterprisesPage页面的导航栏设置
  // 页面组件内嵌入导航栏的方式允许各页面有独立的顶部布局
  return (
      <div className="pt-0">
       <Navigation currentPage="星联企迹" />
      
      {/* 使用CSS变量--navbar-height设置内容区域顶部内边距，与导航栏高度保持一致 */}
      <div className="bg-gradient-to-r from-green-900 to-emerald-800 text-white py-12" style={{ paddingTop: 'var(--navbar-height)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">星联企迹・行业纵览</h1>
              <p className="text-green-200 max-w-2xl">
                聚焦校企合作企业大事记、行业时政动态与发展脉络，提供全景式行业认知窗口
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="搜索企业或动态..."
                  className="pl-10 pr-4 py-2 rounded-lg w-full md:w-64 bg-green-800 text-white border border-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <Search className="absolute left-3 top-3 w-4 h-4 text-green-300" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">联培企业名录</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              '中国航天科工集团', '中国ships集团', '中国电子科技集团', '中国石油化工集团',
              '国家石油天然气管网集团', '国家电网有限公司', '中国电信集团', '中国联通集团',
              '中国移动通信集团', '中国卫星网络集团', '中国铁路通信信号集团', '北方华创科技集团',
              '北京微芯区块链研究院', '北京燕东微电子', '华为技术有限公司', '小米科技',
              '奇安信科技集团', '中关村国家实验室'
            ].map((enterprise, index) => (
              <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-3 text-center hover:bg-green-100 transition-colors duration-200">
                <p className="text-green-800 text-sm font-medium">{enterprise}</p>
              </div>
            ))}
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-6">企业大事记</h2>
        <div className="space-y-6">
          {filteredNews.map((news) => (
            <div key={news.id} className="bg-white rounded-xl shadow-md p-6 border border-green-100 hover:shadow-lg transition-shadow duration-300">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                <div className="mb-4 md:mb-0 md:w-3/4">
                  <div className="flex items-center mb-2">
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded mr-3">
                      {news.enterprise}
                    </span>
                    <span className="text-gray-500 text-sm">{news.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{news.title}</h3>
                  <p className="text-gray-600">{news.content}</p>
                </div>
                <button className="text-green-600 hover:text-green-800 font-medium flex items-center whitespace-nowrap">
                  详情 <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {filteredNews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">未找到与 "{searchTerm}" 相关的企业动态</p>
            <button 
              onClick={() => setSearchTerm('')} 
              className="mt-4 text-green-600 hover:text-green-800 font-medium"
            >
              清除搜索条件
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const SpiritsPage = () => {
  const [activeSpirit, setActiveSpirit] = useState<typeof mockData.greatSpirits[0] | null>(null);
  
  // 注：SpiritsPage页面的导航栏设置
  // currentPage参数决定了导航栏中哪个菜单项会被高亮显示
  return (
    <div className="pt-0">
      <Navigation currentPage="精神传承" />
      
      {/* 使用CSS变量--navbar-height设置内容区域顶部内边距，与导航栏高度保持一致 */}
      <div className="bg-gradient-to-r from-purple-900 to-violet-800 text-white py-12" style={{ paddingTop: 'var(--navbar-height)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">精神传承・思政溯源</h1>
          <p className="text-purple-200 max-w-2xl">
            系统展示两弹一星精神、载人航天精神等宝贵精神财富，加固学生思想根基
          </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeSpirit ? (
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-purple-100">
            <button 
              onClick={() => setActiveSpirit(null)}
              className="flex items-center text-purple-600 hover:text-purple-800 px-6 py-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> 返回精神列表
            </button>
            <div className="border-t border-purple-100 p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{activeSpirit.name}</h2>
              
              <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-6">
                <p className="text-lg text-purple-800 font-medium">"{activeSpirit.core}"</p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">历史背景</h3>
                <p className="text-gray-600">{activeSpirit.background}</p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">实践案例</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  {activeSpirit.cases.map((caseItem: string, index) => (
                    <div key={index} className="border border-purple-200 rounded-lg p-4 hover:bg-purple-50 transition-colors duration-200">
                      <p className="font-medium text-gray-800">{caseItem}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mockData.greatSpirits.map((spirit) => (
              <div 
                key={spirit.id} 
                onClick={() => setActiveSpirit(spirit)}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-purple-100 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              >
                <div className="p-6">
                  <div className="bg-purple-100 text-purple-800 rounded-lg p-3 mb-4 flex items-center justify-center">
                    <Shield className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{spirit.name}</h3>
                  <p className="text-purple-700 font-medium mb-3">"{spirit.core.split('，')[0]}..."</p>
                  <p className="text-gray-600 mb-4">{spirit.background}</p>
                  <div className="flex flex-wrap gap-2">
                    {spirit.cases.slice(0, 2).map((caseItem, index) => (
                      <span key={index} className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-sm">
                        {caseItem}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-purple-50 px-6 py-3 text-right">
                  <span className="text-purple-600 font-medium flex items-center justify-end">
                    详情 <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const PlatformsPage = () => {
  // 注：PlatformsPage页面的导航栏设置
  // 导航栏在每个页面组件中的位置可以根据需要调整
  return (
    <div className="pt-0">
      <Navigation currentPage="政通星联" />
      
      {/* 使用CSS变量--navbar-height设置内容区域顶部内边距，与导航栏高度保持一致 */}
      <div style={{ paddingTop: 'var(--navbar-height)' }} className="bg-gradient-to-r from-yellow-900 to-amber-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">政通星联・平台互通</h1>
          <p className="text-yellow-900 max-w-2xl">
            实现与官方思政平台的互联互通，扩大工程思政教育覆盖面与影响力
          </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {mockData.officialPlatforms.map((platform) => (
            <a 
              key={platform.id} 
              href={platform.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white rounded-xl shadow-md overflow-hidden border border-yellow-100 hover:shadow-lg transition-shadow duration-300 block"
            >
              <div className="p-6">
                <div className="flex items-start">
                  <div className="bg-yellow-100 text-yellow-800 rounded-lg p-2 mr-4 mt-1">
                    <Network className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{platform.name}</h3>
                    <p className="text-gray-600 mb-4">{platform.description}</p>
                    
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-yellow-50">
                      <span className="text-sm text-yellow-800 font-medium break-all">{platform.url}</span>
                      <span className="text-yellow-600 hover:text-yellow-800 font-medium flex items-center">
                        访问 <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
        
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">数据共享接口</h2>
            <p className="text-gray-600 mb-6">
              本平台预留与北邮校内思政教育平台、中国星网内部培训平台的数据对接接口，实现用户信息、学习数据的互联互通（遵循数据安全规范），支撑校企多元协同。
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-medium">
                北邮校内思政教育平台
              </div>
              <div className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-lg font-medium">
                中国星网内部培训平台
              </div>
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-medium">
                API 数据接口规范
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PersonalizedPage = () => {
  // 注：PersonalizedPage页面的导航栏设置
  // 如果需要改为全局导航栏，可以在Router组件下的顶层div中添加Navigation组件
  return (
    <div className="pt-0">
      <Navigation currentPage="数智定制" />
      
      {/* 使用CSS变量--navbar-height设置内容区域顶部内边距，与导航栏高度保持一致 */}
      <div style={{ paddingTop: 'var(--navbar-height)' }} className="bg-gradient-to-r from-indigo-900 to-blue-800 text-white py-12">
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
              <h2 className="text-xl font-bold text-gray-800 mb-4">智能推荐内容</h2>
              
              <div className="space-y-4">
                <div className="flex items-start p-4 bg-indigo-50 rounded-lg">
                  <div className="bg-indigo-100 text-indigo-800 rounded-lg p-2 mr-3 mt-1">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">新一代信息通信技术领域思政课程</h3>
                    <p className="text-gray-600 mt-1">基于您的专业方向和学习偏好推荐</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">推荐指数：95%</span>
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs">思政融合度：高</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start p-4 bg-green-50 rounded-lg">
                  <div className="bg-green-100 text-green-800 rounded-lg p-2 mr-3 mt-1">
                    <Star className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">孙家栋：航天报国的赤子之心</h3>
                    <p className="text-gray-600 mt-1">基于您对航天领域的兴趣推荐</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">匹配度：92%</span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">学习时长：25分钟</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start p-4 bg-purple-50 rounded-lg">
                  <div className="bg-purple-100 text-purple-800 rounded-lg p-2 mr-3 mt-1">
                    <Rocket className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">北斗导航系统：自主创新的中国力量</h3>
                    <p className="text-gray-600 mt-1">基于您对科技报国的关注推荐</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">匹配度：89%</span>
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">思政元素：自主创新</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 border border-indigo-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4">学习数据分析</h2>
              
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
              <h2 className="text-xl font-bold text-gray-800 mb-4">学习计划定制</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">专业方向</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">学习目标</label>
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
              <h2 className="text-xl font-bold text-gray-800 mb-4">工程师画像</h2>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">家国情怀</span>
                    <span className="text-sm text-indigo-600">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">专业素养</span>
                    <span className="text-sm text-indigo-600">92%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">创新精神</span>
                    <span className="text-sm text-indigo-600">78%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">工匠精神</span>
                    <span className="text-sm text-indigo-600">88%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '88%' }}></div>
                  </div>
                </div>
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

export default App;
