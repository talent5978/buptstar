import React, { useState } from "react";
import SpiritFilter from "./SpiritFilter";
import { spiritsData } from "../data/spirits";

const SpiritList = ({ onSpiritClick, selectedSpirits }) => {
  const [data, setData] = useState(spiritsData);

  const handleFilterChange = (period, search) => {
    let filteredData = [...spiritsData];
    if (period !== "全部") {
      filteredData = filteredData.filter((u) => u.period === period);
    }
    if (search) {
      const lowerSearch = search.toLowerCase();
      filteredData = filteredData
        .map((m) => ({
          ...m,
          spirits: m.spirits.filter((f) =>
            f.name.toLowerCase().includes(lowerSearch)
          ),
        }))
        .filter((m) => m.spirits.length > 0);
    }
    setData(filteredData);
  };

  return (
    <div className="red-spirit-container">
      <h2 className="red-spirit-title">中国共产党人精神谱系</h2>
      <SpiritFilter onFilterChange={handleFilterChange} />
      {data.length === 0 || data.every((o) => o.spirits.length === 0) ? (
        <div className="no-results">
          <p>没有找到匹配的精神，请尝试其他筛选条件</p>
        </div>
      ) : (
        <div className="spirit-grid">
          {data.map(
            (o) =>
              o.spirits.length > 0 && (
                <div key={o.period} className="period-section">
                  <h3 className="period-title">{o.period}</h3>
                  <div className="spirit-cards">
                    {o.spirits.map((a) => (
                      <div
                        key={a.id}
                        className={`spirit-card ${
                          selectedSpirits.some((c) => c.id === a.id)
                            ? "selected"
                            : ""
                        }`}
                        onClick={() => onSpiritClick && onSpiritClick(a)}
                      >
                        <div className="spirit-name">{a.name}</div>
                        {a.selected && (
                          <div className="selected-indicator">★</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
          )}
        </div>
      )}
      <style>{`
        .red-spirit-container {
          font-family: 'Microsoft YaHei', sans-serif;
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .red-spirit-title {
          text-align: center;
          color: #c8102e;
          font-size: 28px;
          margin-bottom: 30px;
          font-weight: bold;
        }

        .spirit-grid {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .period-section {
          background-color: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .period-title {
          color: #003a8c;
          font-size: 20px;
          margin-bottom: 15px;
          border-left: 4px solid #c8102e;
          padding-left: 10px;
        }

        .spirit-cards {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 15px;
        }

        .spirit-card {
          background-color: white;
          border: 2px solid #e0e0e0;
          border-radius: 6px;
          padding: 15px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          min-height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .spirit-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .no-results {
          text-align: center;
          padding: 40px;
          color: #666;
          background-color: white;
          border-radius: 8px;
          margin-top: 20px;
        }

        .no-results p {
          font-size: 16px;
        }

        .spirit-card.selected {
          border-color: #c8102e;
          background-color: #fff5f5;
          box-shadow: 0 0 0 2px rgba(200, 16, 46, 0.2);
        }

        .spirit-name {
          font-size: 16px;
          color: #333;
          font-weight: 500;
        }

        .selected-indicator {
          position: absolute;
          top: 5px;
          right: 5px;
          color: #c8102e;
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .spirit-cards {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          }

          .spirit-name {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default SpiritList;
