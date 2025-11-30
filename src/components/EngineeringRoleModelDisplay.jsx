import React, { useState, useMemo } from "react";
import { engineerModels } from "../data/engineers";

const EngineeringRoleModelDisplay = () => {
  const [era, setEra] = useState("全部");
  const [field, setField] = useState("全部");
  const [search, setSearch] = useState("");
  const [selectedEngineer, setSelectedEngineer] = useState(null);

  const eras = Array.from(new Set(engineerModels.map((e) => e.era))).sort();
  const fields = Array.from(new Set(engineerModels.map((e) => e.field))).sort();

  const filteredEngineers = useMemo(() => {
    return engineerModels.filter((eng) => {
      const matchEra = era === "全部" || eng.era === era;
      const matchField = field === "全部" || eng.field === field;
      const matchSearch =
        search === "" ||
        eng.name.toLowerCase().includes(search.toLowerCase()) ||
        eng.mainAchievements.some((ach) =>
          ach.toLowerCase().includes(search.toLowerCase())
        ) ||
        eng.organization.toLowerCase().includes(search.toLowerCase());
      return matchEra && matchField && matchSearch;
    });
  }, [era, field, search]);

  const groupedEngineers = useMemo(() => {
    return filteredEngineers.reduce((acc, curr) => {
      if (!acc[curr.era]) {
        acc[curr.era] = [];
      }
      acc[curr.era].push(curr);
      return acc;
    }, {});
  }, [filteredEngineers]);

  const clearFilters = () => {
    setEra("全部");
    setField("全部");
    setSearch("");
  };

  return (
    <div className="engineering-role-model-display">
      <div className="model-header">
        <h2 className="section-title">卓越工程师标杆库</h2>
        <p className="section-subtitle">
          传承工程大师精神，弘扬工匠精神，培养新一代卓越工程师
        </p>
      </div>
      <div className="model-filter">
        <div className="filter-controls">
          <div className="filter-group">
            <label htmlFor="era-filter">历史时期：</label>
            <select
              id="era-filter"
              value={era}
              onChange={(e) => setEra(e.target.value)}
              className="filter-select"
            >
              <option value="全部">全部时期</option>
              {eras.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="field-filter">专业领域：</label>
            <select
              id="field-filter"
              value={field}
              onChange={(e) => setField(e.target.value)}
              className="filter-select"
            >
              <option value="全部">全部领域</option>
              {fields.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
          <div className="search-group">
            <input
              type="text"
              placeholder="搜索工程师姓名、单位或成就..."
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
          {(era !== "全部" || field !== "全部" || search) && (
            <button onClick={clearFilters} className="clear-filters-button">
              清除筛选
            </button>
          )}
        </div>
      </div>
      <div className="model-content">
        {filteredEngineers.length === 0 ? (
          <div className="no-results">
            <p>没有找到匹配的工程师，请尝试调整筛选条件。</p>
          </div>
        ) : (
          Object.entries(groupedEngineers).map(([e, engineers]) => (
            <div key={e} className="epoch-group">
              <h3 className="epoch-title">{e}</h3>
              <div className="engineer-grid">
                {engineers.map((eng) => (
                  <div
                    key={eng.id}
                    className={`engineer-card ${
                      selectedEngineer?.id === eng.id ? "selected" : ""
                    }`}
                    onClick={() => setSelectedEngineer(eng)}
                  >
                    <div className="engineer-card-header">
                      <div className="engineer-avatar">
                        {eng.imageUrl ? (
                          <img src={eng.imageUrl} alt={eng.name} />
                        ) : (
                          <div className="avatar-placeholder">
                            {eng.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="engineer-card-header-info">
                        <h4 className="engineer-name">{eng.name}</h4>
                        <span className="engineer-epoch">{eng.era}</span>
                      </div>
                    </div>
                    <div className="engineer-card-content">
                      <p className="engineer-accomplishments">
                        {eng.mainAchievements.slice(0, 2).join("，")}
                      </p>
                      <div className="engineer-meta">
                        <span className="engineer-field">{eng.field}</span>
                        <span className="engineer-institution">
                          🏢 {eng.organization}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
      {selectedEngineer && (
        <div className="engineer-detail-overlay">
          <div className="engineer-detail-modal">
            <button
              className="close-button"
              onClick={() => setSelectedEngineer(null)}
              aria-label="关闭"
            >
              ✕
            </button>
            <div className="engineer-detail-content">
              <div className="engineer-detail-header">
                <div className="engineer-detail-avatar">
                  {selectedEngineer.imageUrl ? (
                    <img
                      src={selectedEngineer.imageUrl}
                      alt={selectedEngineer.name}
                    />
                  ) : (
                    <div className="avatar-placeholder-large">
                      {selectedEngineer.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="engineer-detail-header-info">
                  <h3 className="detail-name">{selectedEngineer.name}</h3>
                  <div className="detail-meta">
                    <span className="detail-epoch">{selectedEngineer.era}</span>
                    <span className="detail-field">
                      {selectedEngineer.field}
                    </span>
                    <span className="detail-institution">
                      {selectedEngineer.organization}
                    </span>
                  </div>
                </div>
              </div>
              <div className="detail-section">
                <h4>主要成就</h4>
                <ul>
                  {selectedEngineer.mainAchievements.map((ach, i) => (
                    <li key={i}>{ach}</li>
                  ))}
                </ul>
              </div>
              <div className="detail-section">
                <h4>个人背景</h4>
                <p>{selectedEngineer.education}</p>
              </div>
              <div className="detail-section">
                <h4>代表作品/项目</h4>
                <ul>
                  {selectedEngineer.representativeWorks.map((work, i) => (
                    <li key={i}>{work}</li>
                  ))}
                </ul>
              </div>
              <div className="detail-section">
                <h4>获得荣誉</h4>
                <div className="spirit-traits">
                  {selectedEngineer.honors.map((honor, i) => (
                    <span key={i} className="spirit-trait">
                      {honor}
                    </span>
                  ))}
                </div>
              </div>
              <div className="detail-section">
                <h4>红色精神体现</h4>
                <p>{selectedEngineer.redSpiritManifestation}</p>
              </div>
              {selectedEngineer.quote && (
                <div className="detail-section">
                  <h4>经典名句</h4>
                  <blockquote className="engineer-quote">
                    {selectedEngineer.quote}
                  </blockquote>
                </div>
              )}
              <div className="detail-section">
                <h4>励志故事</h4>
                <p>{selectedEngineer.inspirationalStory}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <style>{`
          .engineering-role-model-display {
            width: 100%;
          }

          .model-header {
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

          .model-filter {
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

          .model-content {
            margin-top: 20px;
          }

          .no-results {
            text-align: center;
            padding: 60px 20px;
            color: #666;
          }

          .epoch-group {
            margin-bottom: 40px;
          }

          .epoch-title {
            font-size: 20px;
            color: #003a8c;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e9ecef;
          }

          .engineer-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
          }

          .engineer-card {
            background-color: white;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
            gap: 15px;
          }

          .engineer-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            border-color: #c8102e;
          }

          .engineer-card.selected {
            border-color: #c8102e;
            box-shadow: 0 0 0 2px rgba(200, 16, 46, 0.2);
            background-color: #fdf2f4;
          }

          .engineer-card-header {
            display: flex;
            align-items: center;
            gap: 15px;
          }

          .engineer-avatar {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            overflow: hidden;
            flex-shrink: 0;
          }

          .engineer-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .avatar-placeholder {
            width: 100%;
            height: 100%;
            background-color: #003a8c;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: bold;
          }

          .engineer-card-header-info {
            flex: 1;
          }

          .engineer-name {
            font-size: 18px;
            color: #333;
            margin: 0 0 5px 0;
            font-weight: 600;
          }

          .engineer-epoch {
            background-color: #e9ecef;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 12px;
            color: #666;
          }

          .engineer-accomplishments {
            color: #666;
            font-size: 14px;
            line-height: 1.5;
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }

          .detail-section ul {
            padding-left: 20px;
            margin: 0;
          }

          .detail-section li {
            margin-bottom: 8px;
            line-height: 1.6;
            color: #333;
          }

          .engineer-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            font-size: 12px;
            color: #888;
          }

          .engineer-field {
            background-color: #e9ecef;
            padding: 2px 8px;
            border-radius: 4px;
          }

          /* 详情弹窗样式 */
          .engineer-detail-overlay {
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

          .engineer-detail-modal {
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

          .engineer-detail-content {
            padding: 30px;
          }

          .engineer-detail-header {
            display: flex;
            align-items: center;
            gap: 30px;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid #e9ecef;
          }

          .engineer-detail-avatar {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            overflow: hidden;
            flex-shrink: 0;
          }

          .engineer-detail-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .avatar-placeholder-large {
            width: 100%;
            height: 100%;
            background-color: #003a8c;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 48px;
            font-weight: bold;
          }

          .engineer-detail-header-info {
            flex: 1;
          }

          .detail-name {
            font-size: 28px;
            color: #c8102e;
            margin: 0 0 15px 0;
            font-weight: bold;
          }

          .detail-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
          }

          .detail-meta span {
            background-color: #f8f9fa;
            padding: 8px 16px;
            border-radius: 4px;
            font-size: 14px;
            color: #555;
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

          .spirit-traits {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
          }

          .spirit-trait {
            background-color: #c8102e;
            color: white;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 14px;
          }

          .engineer-quote {
            background-color: #f8f9fa;
            border-left: 4px solid #003a8c;
            padding: 15px 20px;
            font-style: italic;
            margin: 0;
            color: #555;
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

            .engineer-grid {
              grid-template-columns: 1fr;
            }

            .engineer-detail-modal {
              margin: 10px;
            }

            .engineer-detail-content {
              padding: 20px;
            }

            .engineer-detail-header {
              flex-direction: column;
              text-align: center;
            }

            .detail-meta {
              justify-content: center;
            }
          }
        `}</style>
    </div>
  );
};

export default EngineeringRoleModelDisplay;
