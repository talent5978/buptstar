// SQLite数据库模块
const Database = require('better-sqlite3');
const path = require('path');

// 数据库文件路径
const DB_PATH = path.join(__dirname, 'buptstar.db');

// 初始化数据库连接
const db = new Database(DB_PATH);

// 启用外键约束
db.pragma('journal_mode = WAL');

// 创建表结构
const initTables = () => {
  // 知识库表
  db.exec(`
    CREATE TABLE IF NOT EXISTS knowledge (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      icon TEXT,
      overview TEXT,
      ideological_point TEXT,
      history TEXT,
      future TEXT
    )
  `);

  // 案例表（红色工程案例 + 卓越工程师）
  db.exec(`
    CREATE TABLE IF NOT EXISTS cases (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      summary TEXT,
      tags TEXT,
      quote TEXT,
      images TEXT,
      related_tech TEXT,
      source_url TEXT,
      full_content TEXT
    )
  `);

  // 精神谱系表
  db.exec(`
    CREATE TABLE IF NOT EXISTS spirits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      period TEXT NOT NULL,
      row_index INTEGER NOT NULL,
      col_index INTEGER NOT NULL,
      name TEXT NOT NULL,
      note TEXT,
      details TEXT
    )
  `);
};

// 初始化表
initTables();

// 导出数据库实例和辅助函数
module.exports = {
  db,

  // 知识库操作
  getAllKnowledge: () => {
    return db.prepare('SELECT * FROM knowledge').all();
  },

  getKnowledgeById: (id) => {
    return db.prepare('SELECT * FROM knowledge WHERE id = ?').get(id);
  },

  insertKnowledge: (data) => {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO knowledge (id, name, icon, overview, ideological_point, history, future)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(data.id, data.name, data.icon, data.overview, data.ideologicalPoint, data.history, data.future);
  },

  // 案例操作
  getAllCases: () => {
    const rows = db.prepare('SELECT * FROM cases').all();
    return rows.map(row => ({
      ...row,
      tags: JSON.parse(row.tags || '[]'),
      images: JSON.parse(row.images || '[]'),
      relatedTech: JSON.parse(row.related_tech || '[]')
    }));
  },

  getCaseById: (id) => {
    const row = db.prepare('SELECT * FROM cases WHERE id = ?').get(id);
    if (!row) return null;
    return {
      ...row,
      tags: JSON.parse(row.tags || '[]'),
      images: JSON.parse(row.images || '[]'),
      relatedTech: JSON.parse(row.related_tech || '[]')
    };
  },

  getCasesByCategory: (category) => {
    const rows = db.prepare('SELECT * FROM cases WHERE category = ?').all(category);
    return rows.map(row => ({
      ...row,
      tags: JSON.parse(row.tags || '[]'),
      images: JSON.parse(row.images || '[]'),
      relatedTech: JSON.parse(row.related_tech || '[]')
    }));
  },

  insertCase: (data) => {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO cases (id, title, category, summary, tags, quote, images, related_tech, source_url, full_content)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(
      data.id,
      data.title,
      data.category,
      data.summary,
      JSON.stringify(data.tags || []),
      data.quote,
      JSON.stringify(data.images || []),
      JSON.stringify(data.relatedTech || []),
      data.sourceUrl,
      data.fullContent
    );
  },

  // 精神谱系操作
  getAllSpirits: () => {
    const rows = db.prepare('SELECT * FROM spirits ORDER BY id').all();

    // 重构为原始的嵌套结构
    const periods = {};
    rows.forEach(row => {
      if (!periods[row.period]) {
        periods[row.period] = { period: row.period, spirits: [] };
      }
      const period = periods[row.period];

      // 确保行数组存在
      while (period.spirits.length <= row.row_index) {
        period.spirits.push([]);
      }

      // 添加精神条目
      period.spirits[row.row_index].push({
        name: row.name,
        note: row.note,
        details: row.details
      });
    });

    return Object.values(periods);
  },

  insertSpirit: (period, rowIndex, colIndex, spirit) => {
    const stmt = db.prepare(`
      INSERT INTO spirits (period, row_index, col_index, name, note, details)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(period, rowIndex, colIndex, spirit.name, spirit.note || null, spirit.details);
  },

  clearSpirits: () => {
    db.prepare('DELETE FROM spirits').run();
  }
};
