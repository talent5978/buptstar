import React from "react";
import Navbar from "../components/Navbar";
import { officialPlatforms } from "../data/platforms";
import { Network, ArrowLeft } from "lucide-react";

const Platforms = () => {
  return (
    <div className="pt-0">
      <Navbar currentPage="政通星联" />
      <div
        style={{ paddingTop: "var(--navbar-height)" }}
        className="bg-gradient-to-r from-yellow-900 to-amber-800 text-white py-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">政通星联・平台互通</h1>
          <p className="text-yellow-900 max-w-2xl">
            实现与官方思政平台的互联互通，扩大工程思政教育覆盖面与影响力
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {officialPlatforms.map((platform) => (
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
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {platform.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{platform.description}</p>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-yellow-50">
                      <span className="text-sm text-yellow-800 font-medium break-all">
                        {platform.url}
                      </span>
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
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              数据共享接口
            </h2>
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

export default Platforms;
