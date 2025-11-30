import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { spiritsData } from "../data/spirits";
import SpiritList from "../components/SpiritList";
import SpiritDetail from "../components/SpiritDetail";
import EngineeringCaseDisplay from "../components/EngineeringCaseDisplay";
import EngineeringRoleModelDisplay from "../components/EngineeringRoleModelDisplay";

const RedSpirit = () => {
  const [selectedSpirits, setSelectedSpirits] = useState([]);
  const [activeTab, setActiveTab] = useState("spirit");

  useEffect(() => {
    // Initialize with selected spirits from data
    const initialSelected = spiritsData.flatMap((period) =>
      period.spirits.filter((s) => s.selected)
    );
    setSelectedSpirits(initialSelected);
  }, []);

  const handleSpiritClick = (spirit) => {
    setSelectedSpirits((prev) => {
      const exists = prev.some((s) => s.id === spirit.id);
      if (exists) {
        return prev.filter((s) => s.id !== spirit.id);
      } else {
        return [...prev, spirit];
      }
    });
  };

  const handleClearSelection = () => {
    setSelectedSpirits([]);
  };

  return (
    <div className="pt-0">
      <Navbar currentPage="红邮铸魂" />
      <div
        className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-12"
        style={{ paddingTop: "var(--navbar-height)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">红邮铸魂</h1>
              <p className="text-lg opacity-90">
                传承红色基因，弘扬工程师精神，培养新时代卓越工程师
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="tab-navigation bg-white p-2 rounded-lg shadow-md">
          <button
            className={`tab-button ${activeTab === "spirit" ? "active" : ""}`}
            onClick={() => setActiveTab("spirit")}
          >
            红色精神谱系
          </button>
          <button
            className={`tab-button ${
              activeTab === "engineering" ? "active" : ""
            }`}
            onClick={() => setActiveTab("engineering")}
          >
            红色工程案例库
          </button>
          <button
            className={`tab-button ${
              activeTab === "role-model" ? "active" : ""
            }`}
            onClick={() => setActiveTab("role-model")}
          >
            卓越工程师标杆库
          </button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "spirit" && (
          <>
            <section className="spirit-section">
              <SpiritList
                onSpiritClick={handleSpiritClick}
                selectedSpirits={selectedSpirits}
              />
            </section>
            {selectedSpirits.length > 0 && (
              <section className="detail-section mt-8">
                <SpiritDetail
                  selectedSpirits={selectedSpirits}
                  onClearSelection={handleClearSelection}
                />
              </section>
            )}
          </>
        )}
        {activeTab === "engineering" && (
          <section className="engineering-section">
            <EngineeringCaseDisplay />
          </section>
        )}
        {activeTab === "role-model" && (
          <section className="role-model-section">
            <EngineeringRoleModelDisplay />
          </section>
        )}
      </div>
      <style>{`
        /* 标签按钮样式 */
        .tab-button {
          padding: 15px 30px;
          background: none;
          border: none;
          font-size: 16px;
          font-weight: 500;
          color: #666;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .tab-button:hover {
          color: #c8102e;
        }

        .tab-button.active {
          color: #c8102e;
          font-weight: bold;
        }

        .tab-button.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background-color: #c8102e;
          border-radius: 2px;
        }

        @media (max-width: 768px) {
          /* 移动端标签导航 */
          .tab-navigation {
            overflow-x: auto;
            padding: 0 10px;
            -webkit-overflow-scrolling: touch;
          }

          .tab-button {
            padding: 15px 20px;
            font-size: 14px;
            white-space: nowrap;
          }
        }
      `}</style>
    </div>
  );
};

export default RedSpirit;
