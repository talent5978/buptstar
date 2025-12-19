import React from 'react';
import { EXTERNAL_LINKS } from '../constants';
import { ExternalLink as LinkIcon, Globe, Book, Users, Award, Building, Shield } from 'lucide-react';

const PlatformLinks: React.FC = () => {
  // 对链接进行分类
  const linkCategories = {
    思政教育: {
      links: EXTERNAL_LINKS,
      icon: <Book className="w-6 h-6" />,
      color: "bg-blue-100 text-blue-600"
    },
    行业资源: {
      links: [
        { name: '中国通信学会', url: 'https://www.china-cic.cn/', description: '中国通信行业权威学术组织' },
        { name: '中国卫星网络集团', url: 'http://www.chinastarwin.cn/', description: '国家卫星互联网建设主体' },
        { name: '工信部官网', url: 'https://www.miit.gov.cn/', description: '工业和信息化部官方网站' },
        { name: '中国航天科技集团', url: 'http://www.spacechina.com/', description: '航天科技领域国家队' }
      ],
      icon: <Building className="w-6 h-6" />,
      color: "bg-purple-100 text-purple-600"
    },
    学习平台: {
      links: [
        { name: '中国大学MOOC', url: 'https://www.icourse163.org/', description: '国家精品在线开放课程平台' },
        { name: '学堂在线', url: 'https://www.xuetangx.com/', description: '清华大学主导的在线教育平台' },
        { name: 'Coursera', url: 'https://www.coursera.org/', description: '国际知名在线课程平台' },
        { name: 'edX', url: 'https://www.edx.org/', description: 'MIT和哈佛联合创办的在线教育平台' }
      ],
      icon: <Globe className="w-6 h-6" />,
      color: "bg-green-100 text-green-600"
    },
    认证考试: {
      links: [
        { name: '国家计算机技术与软件专业技术资格（水平）考试', url: 'https://www.ruankao.org.cn/', description: '计算机行业权威认证' },
        { name: '华为认证', url: 'https://e.huawei.com/cn/talent/#/certification/', description: 'ICT行业专业认证体系' },
        { name: '思科认证', url: 'https://www.cisco.com/c/zh_cn/training-events/training-certifications/certifications.html', description: '网络技术领域专业认证' },
        { name: '阿里云认证', url: 'https://edu.aliyun.com/certification/', description: '云计算领域专业认证' }
      ],
      icon: <Award className="w-6 h-6" />,
      color: "bg-orange-100 text-orange-600"
    },
    安全资源: {
      links: [
        { name: '国家网络安全宣传周', url: 'https://www.cac.gov.cn/2024-09/02/c_1738449485541043.htm', description: '国家网络安全宣传活动平台' },
        { name: '中国网络安全产业联盟', url: 'https://www.cnsia.cn/', description: '网络安全产业权威组织' },
        { name: '国家信息安全漏洞共享平台', url: 'https://www.cverc.org.cn/', description: '信息安全漏洞信息共享平台' }
      ],
      icon: <Shield className="w-6 h-6" />,
      color: "bg-red-100 text-red-600"
    }
  };

  return (
    <section id="links" className="py-16 bg-gradient-to-b from-white to-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* 页面标题和介绍 */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            政通星联 · 平台互通
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            汇聚优质思政教育资源、行业平台和学习工具，构建政产学研用一体化的工程思政生态系统，
            为学生提供全方位的学习支持和成长路径。
          </p>
        </div>

        {/* 链接分类展示 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(linkCategories).map(([category, { links, icon, color }]) => (
            <div key={category} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              {/* 分类头部 */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-5 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${color}`}>
                    {icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{category}</h3>
                </div>
              </div>

              {/* 链接列表 */}
              <div className="p-4 space-y-3">
                {links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-bupt-blue hover:bg-blue-50 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-800 group-hover:text-bupt-blue transition-colors">
                        {link.name}
                      </h4>
                      <LinkIcon size={16} className="text-gray-400 group-hover:text-bupt-blue transition-colors" />
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {link.description}
                    </p>
                  </a>
                ))}
              </div>

              {/* 分类底部 */}
              <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
                <p className="text-xs text-gray-500">共 {links.length} 个资源</p>
              </div>
            </div>
          ))}
        </div>

        {/* 底部说明 */}
        <div className="mt-16 text-center text-gray-500 text-sm max-w-3xl mx-auto">
          <p className="mb-4">
            本平台提供的外部链接仅供学习参考，内容版权归原作者所有。
          </p>
          <p>
            我们将持续更新和优化资源链接，欢迎您的宝贵建议和反馈。
          </p>
        </div>
      </div>
    </section>
  );
};

export default PlatformLinks;