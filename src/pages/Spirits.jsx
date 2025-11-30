import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { greatSpirits } from "../data/greatSpirits";
import { Shield, ArrowLeft } from "lucide-react";

const Spirits = () => {
  const [selectedSpirit, setSelectedSpirit] = useState(null);

  const getBaiduSearchLink = (keyword) => {
    return `https://chat.baidu.com/search?word=${encodeURIComponent(
      keyword
    )}&dyTabStr=MTIsMCwzLDEsMiwxMyw3LDYsNSw5&pd=csaitab&setype=csaitab&extParamsJson=%7B%22enter_type%22%3A%22search_a_tab%22%2C%22sa%22%3A%22vs_tab%22%2C%22apagelid%22%3A%2217876247506266883231%22%2C%22ori_lid%22%3A%2217876247506266883231%22%7D`;
  };

  return (
    <div className="pt-0">
      <Navbar currentPage="精神传承" />
      <div
        className="bg-gradient-to-r from-purple-900 to-violet-800 text-white py-12"
        style={{ paddingTop: "var(--navbar-height)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">精神传承・思政溯源</h1>
          <p className="text-purple-200 max-w-2xl">
            系统展示两弹一星精神、载人航天精神等宝贵精神财富，加固学生思想根基
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {selectedSpirit ? (
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-purple-100">
            <button
              onClick={() => setSelectedSpirit(null)}
              className="flex items-center text-purple-600 hover:text-purple-800 px-6 py-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> 返回精神列表
            </button>
            <div className="border-t border-purple-100 p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {selectedSpirit.name}
              </h2>
              <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-6">
                <p className="text-lg text-purple-800 font-medium">
                  "{selectedSpirit.core}"
                </p>
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  历史背景
                </h3>
                <p className="text-gray-600">{selectedSpirit.background}</p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  实践案例
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  {selectedSpirit.cases.map((c, i) => (
                    <div
                      key={i}
                      className="border border-purple-200 rounded-lg p-4 hover:bg-purple-50 transition-colors duration-200"
                    >
                      <p className="font-medium text-gray-800">{c}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {greatSpirits.map((spirit) => (
              <div
                key={spirit.id}
                onClick={() => setSelectedSpirit(spirit)}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-purple-100 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              >
                <div className="p-6">
                  <div className="bg-purple-100 text-purple-800 rounded-lg p-3 mb-4 flex items-center justify-center">
                    <Shield className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {spirit.name}
                  </h3>
                  <p className="text-purple-700 font-medium mb-3">
                    "{spirit.core.split("，")[0]}..."
                  </p>
                  <p className="text-gray-600 mb-4">{spirit.background}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {spirit.cases.slice(0, 2).map((c, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-sm"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                  <a
                    href={getBaiduSearchLink(`${spirit.name} 精神内涵`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    查看更多内涵 <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
                  </a>
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

export default Spirits;
