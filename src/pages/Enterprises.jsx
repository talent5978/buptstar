import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { enterpriseNews } from "../data/news";
import { ArrowLeft, Search, Yl } from "lucide-react";

const Enterprises = () => {
  const [search, setSearch] = useState("");
  const [filteredNews, setFilteredNews] = useState(enterpriseNews);

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredNews(enterpriseNews);
    } else {
      const lowerSearch = search.toLowerCase();
      setFilteredNews(
        enterpriseNews.filter(
          (item) =>
            item.enterprise.toLowerCase().includes(lowerSearch) ||
            item.title.toLowerCase().includes(lowerSearch) ||
            item.content.toLowerCase().includes(lowerSearch)
        )
      );
    }
  }, [search]);

  const enterpriseLinks = [
    { name: "中国航天科工集团", url: "http://www.casic.com.cn" },
    { name: "中国船舶集团", url: "http://www.cssc.net.cn" },
    { name: "中国电子科技集团", url: "http://www.cetc.com.cn" },
    { name: "中国石油化工集团", url: "http://www.sinopec.com" },
    { name: "国家石油天然气管网集团", url: "http://www.pipechina.com.cn" },
    { name: "国家电网有限公司", url: "http://www.sgcc.com.cn" },
    { name: "中国电信集团", url: "http://www.chinatelecom.com.cn" },
    { name: "中国联通集团", url: "http://www.chinaunicom.com.cn" },
    { name: "中国移动通信集团", url: "http://www.10086.cn" },
    { name: "中国卫星网络集团", url: "http://www.chinastarnet.cn" },
    { name: "中国信息通信科技集团", url: "http://www.cict.com.cn" },
    { name: "中国铁路通信信号集团", url: "http://www.crsc.cn" },
    { name: "中国信息通信集团有限公司", url: "http://www.cic.cn" },
    { name: "北方华创科技集团", url: "http://www.naura.com" },
    { name: "北京微芯区块链研究院", url: "http://www.bjbca.net" },
    { name: "北京燕东微电子", url: "http://www.yd-electronics.com" },
    { name: "华为技术有限公司", url: "http://www.huawei.com" },
    { name: "小米科技", url: "http://www.mi.com" },
    { name: "奇安信科技集团", url: "http://www.qianxin.com" },
    { name: "中关村国家实验室", url: "http://www.zgc.gov.cn" },
  ];

  return (
    <div className="pt-0">
      <Navbar currentPage="星联企迹" />
      <div
        className="bg-gradient-to-r from-green-900 to-emerald-800 text-white py-12"
        style={{ paddingTop: "var(--navbar-height)" }}
      >
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
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
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
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            联培企业名录
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {enterpriseLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-green-50 border border-green-200 rounded-lg p-3 text-center hover:bg-green-100 transition-colors duration-200 hover:shadow-md group"
              >
                <p className="text-green-800 text-sm font-medium group-hover:text-green-700 group-hover:underline">
                  {link.name}
                </p>
              </a>
            ))}
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center justify-between">
          企业大事记
          <a
            href="https://www.cac.gov.cn/xxgk/gzk/content_4205484.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center hover:underline"
          >
            查看更多 <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
          </a>
        </h2>
        <div className="space-y-6">
          {filteredNews.map((news) => (
            <div
              key={news.id}
              className="bg-white rounded-xl shadow-md p-6 border border-green-100 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                <div className="mb-4 md:mb-0 md:w-3/4">
                  <div className="flex items-center mb-2">
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded mr-3">
                      {news.enterprise}
                    </span>
                    <span className="text-gray-500 text-sm">{news.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {news.title}
                  </h3>
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
            <p className="text-gray-500 text-lg">
              未找到与 "{search}" 相关的企业动态
            </p>
            <button
              onClick={() => setSearch("")}
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

export default Enterprises;
