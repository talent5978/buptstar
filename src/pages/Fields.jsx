import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { fields } from "../data/fieldList";
import {
  GraduationCap,
  Search,
  ArrowLeft,
  Building2,
  Brain,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Fields = () => {
  const [query, setQuery] = useState("");
  const [filteredFields, setFilteredFields] = useState(fields);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.trim() === "") {
      setFilteredFields(fields);
    } else {
      setFilteredFields(
        fields.filter(
          (field) =>
            field.name.toLowerCase().includes(query.toLowerCase()) ||
            field.description.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  }, [query]);

  const handleDetailsClick = (id) => {
    navigate(`/fields/${id}`);
  };

  const getBaiduSearchLink = (keyword) => {
    return `https://chat.baidu.com/search?word=${encodeURIComponent(
      keyword
    )}&dyTabStr=MTIsMCwzLDEsMiwxMyw3LDYsNSw5&pd=csaitab&setype=csaitab&extParamsJson=%7B%22enter_type%22%3A%22search_a_tab%22%2C%22sa%22%3A%22vs_tab%22%2C%22apagelid%22%3A%2217876247506266883231%22%2C%22ori_lid%22%3A%2217876247506266883231%22%7D`;
  };

  return (
    <div className="pt-0">
      <Navbar currentPage="星途领航" />
      <div
        className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-12"
        style={{ paddingTop: "var(--navbar-height)" }}
      >
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
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
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
        {filteredFields.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredFields.map((field) => (
                <div
                  key={field.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-100 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-start">
                      <div className="bg-blue-100 text-blue-800 rounded-lg p-2 mr-4 mt-1">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                          {field.name}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {field.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {field.subSections.map((sub, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                            >
                              {sub}
                            </span>
                          ))}
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between mt-4 pt-4 border-t border-blue-50 gap-3">
                          <span className="text-sm text-blue-600 font-medium">
                            思政培养矩阵
                          </span>
                          <div className="flex gap-4">
                            <button
                              onClick={() => handleDetailsClick(field.id)}
                              className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                            >
                              详情 <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
                            </button>
                            <a
                              href={getBaiduSearchLink(
                                `${field.name} 领域 最新资讯`
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                            >
                              查看更多资讯 <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <a
                href={getBaiduSearchLink("ICT领域 最新技术发展 产业趋势")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-full hover:from-blue-700 hover:to-indigo-700 transition-colors duration-300"
              >
                查看全部领域最新动态 <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
              </a>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              未找到与 "{query}" 相关的领域
            </p>
            <button
              onClick={() => setQuery("")}
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

export default Fields;
