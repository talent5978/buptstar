import React, { useState } from "react";
import { spiritsData } from "../data/spirits";

const SpiritFilter = ({ onFilterChange }) => {
  const [period, setPeriod] = useState("全部");
  const [search, setSearch] = useState("");

  const periods = ["全部", ...spiritsData.map((u) => u.period)];

  const handlePeriodChange = (val) => {
    setPeriod(val);
    onFilterChange(val, search);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    onFilterChange(period, val);
  };

  const clearFilters = () => {
    setPeriod("全部");
    setSearch("");
    onFilterChange("全部", "");
  };

  return (
    <div className="spirit-filter-container">
      <div className="filter-controls">
        <div className="period-filter">
          <label htmlFor="period-select">按时期筛选：</label>
          <select
            id="period-select"
            value={period}
            onChange={(e) => handlePeriodChange(e.target.value)}
          >
            {periods.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div className="search-filter">
          <label htmlFor="search-input">搜索精神：</label>
          <input
            type="text"
            id="search-input"
            value={search}
            onChange={handleSearchChange}
            placeholder="输入精神名称关键词"
          />
        </div>
        {(period !== "全部" || search) && (
          <button className="clear-button" onClick={clearFilters}>
            清除筛选
          </button>
        )}
      </div>
      <style>{`
        .spirit-filter-container {
          background-color: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .filter-controls {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 15px;
        }

        .period-filter,
        .search-filter {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        label {
          color: #333;
          font-size: 14px;
          font-weight: 500;
          white-space: nowrap;
        }

        select,
        input {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          transition: border-color 0.3s;
        }

        select:focus,
        input:focus {
          outline: none;
          border-color: #c8102e;
          box-shadow: 0 0 0 2px rgba(200, 16, 46, 0.1);
        }

        .clear-button {
          padding: 8px 16px;
          background-color: #003a8c;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .clear-button:hover {
          background-color: #002966;
        }

        @media (max-width: 768px) {
          .filter-controls {
            flex-direction: column;
            align-items: stretch;
          }

          .period-filter,
          .search-filter {
            flex-direction: column;
            align-items: stretch;
          }

          label {
            text-align: left;
          }
        }
      `}</style>
    </div>
  );
};

export default SpiritFilter;
