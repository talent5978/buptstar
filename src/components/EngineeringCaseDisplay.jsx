import React, { useState, useMemo } from "react";
import { redEngineerCases } from "../data/cases";

const EngineeringCaseDisplay = () => {
  const [period, setPeriod] = useState("全部");
  const [category, setCategory] = useState("全部");
  const [search, setSearch] = useState("");
  const [selectedCase, setSelectedCase] = useState(null);

  const categories = Array.from(
    new Set(redEngineerCases.map((e) => e.category))
  ).sort();
  const periods = Array.from(
    new Set(redEngineerCases.map((e) => e.period))
  ).sort();

  const filteredCases = useMemo(() => {
    return redEngineerCases.filter((c) => {
      const matchPeriod = period === "全部" || c.period === period;
      const matchCategory = category === "全部" || c.category === category;
      const matchSearch =
        search === "" ||
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.summary.toLowerCase().includes(search.toLowerCase()) ||
        c.location.toLowerCase().includes(search.toLowerCase());
      return matchPeriod && matchCategory && matchSearch;
    });
  }, [period, category, search]);

  const groupedCases = useMemo(() => {
    return filteredCases.reduce((acc, curr) => {
      if (!acc[curr.period]) {
        acc[curr.period] = [];
      }
      acc[curr.period].push(curr);
      return acc;
    }, {});
  }, [filteredCases]);

  const clearFilters = () => {
    setPeriod("全部");
    setCategory("全部");
    setSearch("");
  };

  return (
    <div className="engineering-case-display">
      <div className="case-header">
        <h2 className="section-title">红色工程案例库</h2>
        <p className="section-subtitle">
          回顾中国共产党领导下的重大工程建设成就，传承红色基因，弘扬工程师精神
        </p>
      </div>
      <div className="case-filter">
        <div className="filter-controls">
          <div className="filter-group">
            <label htmlFor="period-filter">历史时期：</label>
            <select
              id="period-filter"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="filter-select"
            >
              <option value="全部">全部时期</option>
              {periods.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="category-filter">工程类别：</label>
            <select
              id="category-filter"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="filter-select"
            >
              <option value="全部">全部类别</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="search-group">
            <input
              type="text"
              placeholder="搜索案例名称、地点或概述..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="clear-button"
                title="清除搜索"
              >
                ✕
              </button>
            )}
          </div>
          {(period !== "全部" || category !== "全部" || search) && (
            <button onClick={clearFilters} className="clear-filters-button">
              清除筛选
            </button>
          )}
        </div>
      </div>
      <div className="case-content">
        {filteredCases.length === 0 ? (
          <div className="no-results">
            <p>没有找到匹配的工程案例，请尝试调整筛选条件。</p>
          </div>
        ) : (
          Object.entries(groupedCases).map(([p, cases]) => (
            <div key={p} className="period-group">
              <h3 className="period-title">{p}</h3>
              <div className="case-grid">
                {cases.map((c) => (
                  <div
                    key={c.id}
                    className={`case-card ${
                      selectedCase?.id === c.id ? "selected" : ""
                    }`}
                    onClick={() => setSelectedCase(c)}
                  >
                    <div className="case-card-header">
                      <h4 className="case-title">{c.title}</h4>
                      <span className="case-year">{c.year}</span>
                    </div>
                    <div className="case-card-content">
                      <p className="case-summary">{c.summary}</p>
                      <div className="case-meta">
                        <span className="case-category">{c.category}</span>
                        <span className="case-location">📍 {c.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
      {selectedCase && (
        <div className="case-detail-overlay">
          <div className="case-detail-modal">
            <button
              className="close-button"
              onClick={() => setSelectedCase(null)}
              aria-label="关闭"
            >
              ✕
            </button>
            <div className="case-detail-content">
              <h3 className="detail-title">{selectedCase.title}</h3>
              <div className="detail-meta">
                <span className="detail-period">{selectedCase.period}</span>
                <span className="detail-year">{selectedCase.year}年</span>
                <span className="detail-category">{selectedCase.category}</span>
                <span className="detail-location">{selectedCase.location}</span>
              </div>
              {selectedCase.imageUrl && (
                <div className="detail-image">
                  <img
                    src={selectedCase.imageUrl}
                    alt={selectedCase.title}
                  />
                </div>
              )}
              <div className="detail-section">
                <h4>项目概述</h4>
                <p>{selectedCase.summary}</p>
              </div>
              <div className="detail-section">
                <h4>主要成就</h4>
                <ul className="achievement-list">
                  {selectedCase.keyAchievements.map((ach, i) => (
                    <li key={i}>{ach}</li>
                  ))}
                </ul>
              </div>
              <div className="detail-section">
                <h4>面临挑战</h4>
                <p>{selectedCase.challenges}</p>
              </div>
              <div className="detail-section">
                <h4>体现的红色精神</h4>
                <div className="spirit-tags">
                  {selectedCase.redSpirit.map((s, i) => (
                    <span key={i} className="spirit-tag">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="detail-section">
                <h4>历史意义与现实启示</h4>
                <p>{selectedCase.significance}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <style>{`
          .engineering-case-display {
            width: 100%;
          }

          .case-header {
            text-align: center;
            margin-bottom: 30px;
          }

          .section-title {
            font-size: 28px;
            color: #c8102e;
            margin-bottom: 10px;
            font-weight: bold;
          }

          .section-subtitle {
            font-size: 16px;
            color: #555;
            max-width: 800px;
            margin: 0 auto;
          }

          .case-filter {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }

          .filter-controls {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            align-items: center;
          }

          .filter-group {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .filter-group label {
            font-weight: 500;
            color: #333;
            white-space: nowrap;
          }

          .filter-select {
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background-color: white;
            font-size: 14px;
            cursor: pointer;
          }

          .filter-select:focus {
            outline: none;
            border-color: #c8102e;
            box-shadow: 0 0 0 2px rgba(200, 16, 46, 0.1);
          }

          .search-group {
            position: relative;
            flex: 1;
            min-width: 200px;
          }

          .search-input {
            width: 100%;
            padding: 8px 40px 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
          }

          .search-input:focus {
            outline: none;
            border-color: #c8102e;
            box-shadow: 0 0 0 2px rgba(200, 16, 46, 0.1);
          }

          .clear-button {
            position: absolute;
            right: 8px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            font-size: 16px;
            cursor: pointer;
            color: #666;
            padding: 4px;
          }

          .clear-button:hover {
            color: #c8102e;
          }

          .clear-filters-button {
            padding: 8px 16px;
            background-color: #003a8c;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 14px;
            cursor: pointer;
          }

          .clear-filters-button:hover {
            background-color: #002a66;
          }

          .case-content {
            margin-top: 20px;
          }

          .no-results {
            text-align: center;
            padding: 60px 20px;
            color: #666;
          }

          .period-group {
            margin-bottom: 40px;
          }

          .period-title {
            font-size: 20px;
            color: #003a8c;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e9ecef;
          }

          .case-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
          }

          .case-card {
            background-color: white;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }

          .case-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            border-color: #c8102e;
          }

          .case-card.selected {
            border-color: #c8102e;
            box-shadow: 0 0 0 2px rgba(200, 16, 46, 0.2);
            background-color: #fdf2f4;
          }

          .case-card-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 10px;
          }

          .case-title {
            font-size: 18px;
            color: #333;
            margin: 0;
            font-weight: 600;
            flex: 1;
          }

          .case-year {
            background-color: #003a8c;
            color: white;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
          }

          .case-summary {
            color: #666;
            font-size: 14px;
            margin-bottom: 12px;
            line-height: 1.5;
          }

          .case-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            font-size: 12px;
            color: #888;
          }

          .case-category {
            background-color: #e9ecef;
            padding: 2px 8px;
            border-radius: 4px;
          }

          /* 详情弹窗样式 */
          .case-detail-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: 20px;
          }

          .case-detail-modal {
            background-color: white;
            border-radius: 12px;
            max-width: 800px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          }

          .close-button {
            position: absolute;
            top: 15px;
            right: 15px;
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #666;
            padding: 5px;
            z-index: 10;
          }

          .close-button:hover {
            color: #c8102e;
          }

          .case-detail-content {
            padding: 30px;
          }

          .detail-title {
            font-size: 24px;
            color: #c8102e;
            margin-bottom: 15px;
            font-weight: bold;
          }

          .detail-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid #e9ecef;
          }

          .detail-meta span {
            background-color: #f8f9fa;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 14px;
            color: #555;
          }

          .detail-image {
            margin-bottom: 25px;
            text-align: center;
          }

          .detail-image img {
            max-width: 100%;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }

          .detail-section {
            margin-bottom: 25px;
          }

          .detail-section h4 {
            font-size: 18px;
            color: #003a8c;
            margin-bottom: 12px;
            font-weight: 600;
          }

          .detail-section p {
            line-height: 1.6;
            color: #333;
          }

          .achievement-list {
            list-style-type: disc;
            padding-left: 20px;
          }

          .achievement-list li {
            margin-bottom: 8px;
            line-height: 1.5;
            color: #333;
          }

          .spirit-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
          }

          .spirit-tag {
            background-color: #c8102e;
            color: white;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 14px;
          }

          /* 响应式设计 */
          @media (max-width: 768px) {
            .filter-controls {
              flex-direction: column;
              align-items: stretch;
            }

            .filter-group {
              flex-direction: column;
              align-items: stretch;
            }

            .search-group {
              width: 100%;
            }

            .case-grid {
              grid-template-columns: 1fr;
            }

            .case-detail-modal {
              margin: 10px;
            }

            .case-detail-content {
              padding: 20px;
            }

            .detail-meta {
              flex-direction: column;
              gap: 8px;
            }
          }
        `}</style>
    </div>
  );
};

export default EngineeringCaseDisplay;
