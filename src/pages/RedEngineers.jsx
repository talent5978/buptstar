import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { redEngineerCases } from "../data/cases";
import { engineerModels } from "../data/engineers";
import { useNavigate } from "react-router-dom";
import { Rocket, Users, ArrowLeft } from "lucide-react";

const RedEngineers = () => {
  const [activeTab, setActiveTab] = useState("cases");
  const [search, setSearch] = useState("");
  const [cases, setCases] = useState(redEngineerCases);
  const [models, setModels] = useState(engineerModels);
  const navigate = useNavigate();

  useEffect(() => {
    if (search.trim() === "") {
      setCases(redEngineerCases);
      setModels(engineerModels);
    } else {
      const lowerSearch = search.toLowerCase();
      setCases(
        redEngineerCases.filter(
          (u) =>
            u.title.toLowerCase().includes(lowerSearch) ||
            u.field.toLowerCase().includes(lowerSearch) ||
            u.background.toLowerCase().includes(lowerSearch)
        )
      );
      setModels(
        engineerModels.filter(
          (u) =>
            u.name.toLowerCase().includes(lowerSearch) ||
            u.field.toLowerCase().includes(lowerSearch) ||
            u.title.toLowerCase().includes(lowerSearch)
        )
      );
    }
  }, [search]);

  const getBaiduSearchLink = (keyword) => {
    return `https://chat.baidu.com/search?word=${encodeURIComponent(
      keyword
    )}&dyTabStr=MTIsMCwzLDEsMiwxMyw3LDYsNSw5&pd=csaitab&setype=csaitab&extParamsJson=%7B%22enter_type%22%3A%22search_a_tab%22%2C%22sa%22%3A%22vs_tab%22%2C%22apagelid%22%3A%2217876247506266883231%22%2C%22ori_lid%22%3A%2217876247506266883231%22%7D`;
  };

  return (
    <div className="pt-0">
      <Navbar currentPage="红邮铸魂" />
      <div
        className="bg-gradient-to-r from-red-900 to-red-800 text-white py-12"
        style={{ paddingTop: "var(--navbar-height)" }}
      >
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
                  value={search}
                  onChange={(u) => setSearch(u.target.value)}
                  placeholder="搜索案例或人物..."
                  className="pl-10 pr-4 py-2 rounded-lg w-full md:w-64 bg-red-800 text-white border border-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <div className="absolute left-3 top-3 w-4 h-4 text-red-300">
                  🔍
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("cases")}
              className={`px-1 py-4 text-sm font-medium ${
                activeTab === "cases"
                  ? "text-red-600 border-b-2 border-red-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              红色工程案例库
            </button>
            <button
              onClick={() => setActiveTab("models")}
              className={`px-1 py-4 text-sm font-medium ${
                activeTab === "models"
                  ? "text-red-600 border-b-2 border-red-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              卓越工程师标杆库
            </button>
          </nav>
        </div>
        {activeTab === "cases" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cases.map((u) => (
              <div
                key={u.id}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-red-100 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex items-start">
                    <div className="bg-red-100 text-red-800 rounded-lg p-2 mr-4 mt-1">
                      <Rocket className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="px-2 py-1 bg-red-50 text-red-700 rounded text-xs font-medium">
                          {u.field}
                        </span>
                        <span className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded text-xs font-medium">
                          {u.era}
                        </span>
                        {u.themes &&
                          u.themes.map((m, f) => (
                            <span
                              key={f}
                              className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs font-medium"
                            >
                              {m}
                            </span>
                          ))}
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {u.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{u.background}</p>
                      <div className="mt-4 pt-4 border-t border-red-50">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm text-red-600 font-medium">
                            历史意义：{u.significance}
                          </span>
                          <button
                            onClick={() => navigate(`/cases/${u.id}`)}
                            className="text-red-600 hover:text-red-800 font-medium flex items-center"
                          >
                            详情 <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
                          </button>
                        </div>
                        <a
                          href={getBaiduSearchLink(`${u.title} ${u.field}`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center text-sm"
                        >
                          查看更多相关资料{" "}
                          <ArrowLeft className="w-4 h-4 ml-1 rotate-180 transition-transform duration-300 hover:translate-x-1" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {activeTab === "models" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {models.map((u) => (
              <div
                key={u.id}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-yellow-100 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex items-start">
                    <div
                      className={`rounded-lg p-2 mr-4 mt-1 ${
                        u.type === "个人"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {u.type === "个人" ? (
                        <Users className="w-6 h-6" />
                      ) : (
                        <Users className="w-6 h-6" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span
                          className={`px-2 py-1 ${
                            u.type === "个人"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-green-50 text-green-700"
                          } rounded text-xs font-medium`}
                        >
                          {u.type}标杆
                        </span>
                        <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs font-medium">
                          {u.field}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {u.name}
                      </h3>
                      <p className="text-gray-600 mb-2">{u.title}</p>
                      <p className="text-sm text-yellow-700 font-medium bg-yellow-50 p-2 rounded-lg mb-4">
                        精神内核：{u.spirit}
                      </p>
                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-3">
                          <button
                            onClick={() =>
                              navigate(`/engineer-stories/${u.id}`)
                            }
                            className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                          >
                            成长故事{" "}
                            <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
                          </button>
                          <button
                            onClick={() =>
                              navigate(`/engineer-achievements/${u.id}`)
                            }
                            className="text-green-600 hover:text-green-800 font-medium flex items-center"
                          >
                            事迹详情{" "}
                            <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
                          </button>
                        </div>
                        <a
                          href={getBaiduSearchLink(
                            `${u.name} ${u.field} 事迹`
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center text-sm"
                        >
                          查看更多相关资料{" "}
                          <ArrowLeft className="w-4 h-4 ml-1 rotate-180 transition-transform duration-300 hover:translate-x-1" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {((activeTab === "cases" && cases.length === 0) ||
          (activeTab === "models" && models.length === 0)) && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              未找到与 "{search}" 相关的内容
            </p>
            <button
              onClick={() => setSearch("")}
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

export default RedEngineers;
