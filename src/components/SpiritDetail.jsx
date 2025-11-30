import React, { useState } from "react";
import { spiritDetails } from "../data/spirits";

const SpiritDetail = ({ selectedSpirits, onClearSelection }) => {
  const [expanded, setExpanded] = useState({});
  const [viewMode, setViewMode] = useState("detail");

  const getSpiritDetail = (spirit) => {
    for (const [key, detail] of Object.entries(spiritDetails)) {
      if (spirit.name.includes(key) || key.includes(spirit.name)) {
        return detail;
      }
    }
    let description;
    switch (spirit.period) {
      case "新民主主义革命时期":
        description = `${spirit.name}形成于中国共产党领导人民进行新民主主义革命的伟大实践中，是中国共产党和中国人民的宝贵精神财富。这种精神激励着一代又一代中国人民为民族独立和人民解放而奋斗。`;
        break;
      case "社会主义革命和建设时期":
        description = `${spirit.name}形成于社会主义革命和建设时期，体现了中国人民在艰苦条件下自力更生、艰苦奋斗的精神风貌。这种精神为新中国的建设和发展奠定了坚实的思想基础。`;
        break;
      case "改革开放和社会主义现代化建设新时期":
        description = `${spirit.name}形成于改革开放和社会主义现代化建设新时期，彰显了中国人民解放思想、实事求是、与时俱进、开拓创新的时代精神。这种精神推动着中国特色社会主义事业不断向前发展。`;
        break;
      case "中国特色社会主义新时代":
        description = `${spirit.name}形成于中国特色社会主义新时代，反映了中国人民为实现中华民族伟大复兴中国梦而努力奋斗的精神追求。这种精神激励着全体中华儿女为全面建设社会主义现代化国家而团结奋斗。`;
        break;
      default:
        description = `${spirit.name}是中国共产党人精神谱系的重要组成部分，体现了中国共产党人的优秀品质和革命传统。`;
    }
    return {
      slogan: "传承红色基因，弘扬革命精神",
      description: description,
    };
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return selectedSpirits.length === 0 ? (
    <div className="selected-spirit-empty">
      <div className="empty-icon">📚</div>
      <p>请选择要查看的精神</p>
    </div>
  ) : (
    <div className="selected-spirit-detail">
      <div className="detail-header">
        <h2 className="detail-title">选中精神详情</h2>
        <div className="detail-controls">
          <div className="display-mode-switch">
            <button
              className={`mode-button ${viewMode === "list" ? "active" : ""}`}
              onClick={() => setViewMode("list")}
            >
              列表视图
            </button>
            <button
              className={`mode-button ${viewMode === "detail" ? "active" : ""}`}
              onClick={() => setViewMode("detail")}
            >
              详情视图
            </button>
          </div>
          <button className="clear-button" onClick={onClearSelection}>
            清除选择
          </button>
        </div>
      </div>
      <div className="spirit-details-list">
        {selectedSpirits.map((spirit) => {
          const detail = getSpiritDetail(spirit);
          const isExpanded = expanded[spirit.id] || viewMode === "detail";
          return (
            <div key={spirit.id} className={`spirit-detail-card ${viewMode}`}>
              <div
                className="card-header"
                onClick={() => toggleExpand(spirit.id)}
              >
                <div>
                  <h3 className="spirit-detail-name">{spirit.name}</h3>
                  <span className="spirit-period">{spirit.period}</span>
                </div>
                <div className={`expand-icon ${isExpanded ? "expanded" : ""}`}>
                  {isExpanded ? "▼" : "▶"}
                </div>
              </div>
              {isExpanded && (
                <>
                  {detail.slogan && (
                    <div className="spirit-slogan">
                      <strong>精神内涵：</strong>
                      {detail.slogan}
                    </div>
                  )}
                  {detail.description && (
                    <div className="spirit-description">
                      <strong>详细描述：</strong>
                      {detail.description}
                    </div>
                  )}
                  {spirit.description && (
                    <div className="custom-description">
                      {spirit.description}
                    </div>
                  )}
                  <div className="related-spirits">
                    <strong>相关链接：</strong>
                    <a
                      href={`https://baike.baidu.com/search/word?word=${encodeURIComponent(
                        spirit.name
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="related-link"
                    >
                      百度百科了解更多
                    </a>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
      <style>{`
        .selected-spirit-detail {
          padding: 20px;
          background-color: #f8f9fa;
          border-radius: 8px;
          margin-top: 20px;
        }

        .detail-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 15px;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px solid #e0e0e0;
        }

        .detail-title {
          color: #c8102e;
          font-size: 24px;
          margin: 0;
          text-align: center;
        }

        .detail-controls {
          display: flex;
          gap: 15px;
          align-items: center;
        }

        .display-mode-switch {
          display: flex;
          background-color: #f0f0f0;
          border-radius: 4px;
          overflow: hidden;
        }

        .mode-button {
          padding: 8px 16px;
          border: none;
          background: none;
          cursor: pointer;
          font-size: 14px;
          color: #666;
          transition: all 0.3s;
        }

        .mode-button.active {
          background-color: #003a8c;
          color: white;
        }

        .clear-button {
          padding: 8px 16px;
          background-color: #c8102e;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.3s;
        }

        .clear-button:hover {
          background-color: #a80d27;
        }

        .spirit-details-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .spirit-detail-card {
          background-color: white;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .spirit-detail-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .spirit-detail-card.list .card-header {
          cursor: pointer;
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
        }

        .spirit-detail-name {
          color: #003a8c;
          font-size: 18px;
          margin: 0;
        }

        .spirit-period {
          color: #666;
          font-size: 14px;
          padding: 4px 12px;
          background-color: #f0f8ff;
          border-radius: 16px;
          display: inline-block;
        }

        .expand-icon {
          font-size: 12px;
          transition: transform 0.3s;
          color: #666;
        }

        .expand-icon.expanded {
          transform: rotate(0deg);
        }

        .spirit-slogan {
          background-color: #f0f8ff;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 15px;
          font-size: 16px;
          color: #333;
          margin-top: 15px;
        }

        .spirit-description, .custom-description {
          color: #555;
          line-height: 1.6;
          font-size: 14px;
          margin-bottom: 15px;
        }

        .related-spirits {
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px dashed #ccc;
        }

        .related-link {
          color: #003a8c;
          text-decoration: none;
          margin-left: 10px;
        }

        .related-link:hover {
          text-decoration: underline;
        }

        .selected-spirit-empty {
          padding: 60px 20px;
          text-align: center;
          color: #666;
          background-color: #f8f9fa;
          border-radius: 8px;
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 20px;
        }

        @media (max-width: 768px) {
          .spirit-details-list {
            grid-template-columns: 1fr;
          }

          .detail-header {
            flex-direction: column;
            align-items: stretch;
          }

          .detail-controls {
            flex-direction: column;
            align-items: stretch;
          }

          .card-header {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default SpiritDetail;
