import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  Star,
  Building2,
  Shield,
  Network,
  Brain,
  ArrowLeft,
} from "lucide-react";
import background from "../assets/background.jpg";

const Home = () => {
  useEffect(() => {
    document.documentElement.style.setProperty("--navbar-height", "64px");
  }, []);

  return (
    <div>
      <Navbar currentPage="首页" />
      <div
        style={{ paddingTop: "var(--navbar-height)" }}
        className="relative py-10 sm:py-20 min-h-[600px] sm:min-h-[1000px] flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={background}
            alt="背景图片"
            className="w-full h-full object-cover sm:object-cover absolute top-0 left-0 z-0"
            style={{ minHeight: "80vh", width: "100%", height: "auto" }}
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="max-w-3xl mx-auto"></div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-md p-6 border border-blue-100">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <GraduationCap className="w-6 h-6 text-blue-700" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">星途领航</h3>
            <p className="text-gray-600 mb-4">
              聚焦六大核心领域，构建领域专属思政内容体系，实现技术知识点与思政育人点的有机融合。
            </p>
            <Link
              to="/fields"
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
            >
              进入模块 <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
            </Link>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-red-100">
            <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Star className="w-6 h-6 text-red-700" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">红邮铸魂</h3>
            <p className="text-gray-600 mb-4">
              收录红色工程师案例与卓越工程师标杆，深度挖掘工程背后的家国情怀与奋斗精神。
            </p>
            <Link
              to="/red-engineers"
              className="text-red-600 hover:text-red-800 font-medium flex items-center"
            >
              进入模块 <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
            </Link>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-green-100">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6 text-green-700" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">星联企迹</h3>
            <p className="text-gray-600 mb-4">
              展示联培企业大事记、行业时政动态与发展脉络，提供全景式行业认知窗口。
            </p>
            <Link
              to="/enterprises"
              className="text-green-600 hover:text-green-800 font-medium flex items-center"
            >
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
            <p className="text-gray-600 mb-4">
              系统展示两弹一星精神、载人航天精神等宝贵精神财富，加固学生思想根基。
            </p>
            <Link
              to="/spirits"
              className="text-purple-600 hover:text-purple-800 font-medium flex items-center"
            >
              进入模块 <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
            </Link>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-yellow-100">
            <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Network className="w-6 h-6 text-yellow-800" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">政通星联</h3>
            <p className="text-gray-600 mb-4">
              实现与官方思政平台互联互通，扩大工程思政教育覆盖面与影响力。
            </p>
            <Link
              to="/platforms"
              className="text-yellow-800 hover:text-yellow-900 font-medium flex items-center"
            >
              进入模块 <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
            </Link>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-indigo-100">
            <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-indigo-700" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">数智定制</h3>
            <p className="text-gray-600 mb-4">
              基于专业方向与学习偏好，智能推荐思政内容，实现个性化学习体验。
            </p>
            <Link
              to="/personalized"
              className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
            >
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
              <p className="text-gray-400 mt-2">
                北京市海淀区西土城路10号
              </p>
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

export default Home;
