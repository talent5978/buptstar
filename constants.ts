import { Field, ExternalLink, Company, TimelineEvent } from './types';

export const SIX_FIELDS: Field[] = [
  { id: 'ict', name: '新一代信息通信技术', description: '探索5G/6G前沿，筑牢国家数字底座', icon: 'Signal' },
  { id: 'software', name: '关键软件', description: '攻克核心算法，实现软件自主可控', icon: 'Code' },
  { id: 'security', name: '网络安全', description: '筑牢网络防线，守护国家数据安全', icon: 'ShieldCheck' },
  { id: 'ai', name: '人工智能', description: '赋能千行百业，引领智能时代变革', icon: 'Cpu' },
  { id: 'semi', name: '半导体', description: '突破芯片壁垒，铸造中国科技“芯”', icon: 'Zap' },
  { id: 'satellite', name: '航天卫星互联网', description: '星网互联互通，构建天地一体化网络', icon: 'Globe' },
];

export const EXTERNAL_LINKS: ExternalLink[] = [
  { name: '大思政课云平台', url: 'http://m.people.cn/305554/index.html', description: '人民网大思政课' },
  { name: '新华思政', url: 'https://xhsz.news.cn/course/node?pid=7', description: '全国高校课程思政教学资源服务平台' },
  { name: '思政频道', url: 'https://www.eol.cn/sizheng/', description: '中国教育在线思政频道' },
  { name: '全国高校思想政治工作网', url: 'https://www.sizhengwang.cn/?pageId=138727&wfwfid=851&websiteId=90087', description: '高校思政工作网' },
  { name: '数字思政', url: 'https://dxs.moe.gov.cn/zx/gxdt/szszyzszhfwypt/szszzyk/', description: '一站式综合服务云平台' },
];

export const PARTNER_COMPANIES: Company[] = [
    { name: '中国航天科工集团有限公司', logoInitial: '科', url: 'http://www.casic.com.cn/' },
    { name: '中国船舶集团有限公司', logoInitial: '船', url: 'http://www.cssc.net.cn/' },
    { name: '中国电子科技集团有限公司', logoInitial: '电', url: 'http://www.cetc.com.cn/' },
    { name: '中国石油化工集团有限公司', logoInitial: '化', url: 'http://www.sinopecgroup.com/' },
    { name: '国家石油天然气管网集团有限公司', logoInitial: '管', url: 'http://www.pipechina.com.cn/' },
    { name: '国家电网有限公司', logoInitial: '网', url: 'http://www.sgcc.com.cn/' },
    { name: '中国电信集团有限公司', logoInitial: '信', url: 'http://www.chinatelecom.com.cn/' },
    { name: '中国联合网络通信集团有限公司', logoInitial: '通', url: 'https://www.chinaunicom.com.cn/' },
    { name: '中国移动通信集团有限公司', logoInitial: '移', url: 'https://www.chinamobile.com/' },
    { name: '中国卫星网络集团有限公司', logoInitial: '星', url: 'https://baike.baidu.com/search/word?word=中国星网' },
    { name: '中国电子信息产业集团有限公司', logoInitial: '产', url: 'https://www.cec.com.cn/' },
    { name: '中国铁路通信信号集团有限公司', logoInitial: '铁', url: 'http://www.crsc.cn/' },
    { name: '中国信息通信科技集团有限公司', logoInitial: '信', url: 'http://www.cict.com/' },
    { name: '北方华创科技集团股份有限公司', logoInitial: '北', url: 'https://www.naura.com/' },
    { name: '北京微芯区块链与边缘计算研究院', logoInitial: '微', url: 'https://www.bjwxy.org.cn/' },
    { name: '北京燕东微电子股份有限公司', logoInitial: '燕', url: 'http://www.ydme.com.cn/' },
    { name: '华为技术有限公司', logoInitial: '华', url: 'https://www.huawei.com/' },
    { name: '奇安信科技集团股份有限公司', logoInitial: '奇', url: 'https://www.qianxin.com/' },
    { name: '小米科技有限责任公司', logoInitial: '米', url: 'https://www.mi.com/' },
    { name: '中关村国家实验室', logoInitial: '中', url: 'http://www.zgclab.edu.cn/' },
];


export const HISTORY_TIMELINE: TimelineEvent[] = [
  { year: '1955', title: '北京邮电学院成立', description: '新中国第一所邮电高等学府，开启通信人才培养征程。', url: 'https://www.bupt.edu.cn/xxgk/xxjs.htm' },
  { year: '1970', title: '东方红一号发射成功', description: '中国第一颗人造地球卫星，开启航天时代。', url: 'https://www.cast.cn/news/5101' },
  { year: '1999', title: '两弹一星表彰大会', description: '隆重表彰为研制“两弹一星”作出突出贡献的科技专家。', url: 'http://cpc.people.com.cn/GB/64162/64164/4415814.html' },
  { year: '2020', title: '北斗三号开通', description: '北斗三号全球卫星导航系统正式开通，迈进全球服务新时代。', url: 'http://www.beidou.gov.cn/' },
  { year: '2021', title: '中国星网集团成立', description: '承担国家卫星互联网战略使命，引领行业新发展。', url: 'http://www.chinastarwin.cn/' },
  { year: '2024', title: '邮联星课平台启动', description: '北邮与中国星网共建数智赋能思政云平台。' },
];