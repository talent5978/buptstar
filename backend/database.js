// SQLite数据库模块
const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, 'buptstar.db');
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

const now = () => new Date().toISOString();
const ACTIVE_REVIEW_STATUSES = ['pending', 'approved'];

const safeParseJsonArray = (value) => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const initTables = () => {
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

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      display_name TEXT,
      role TEXT NOT NULL CHECK(role IN ('student', 'admin')),
      password_hash TEXT NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      UNIQUE(username, role)
    )
  `);

  // V1表保留用于兼容历史数据
  db.exec(`
    CREATE TABLE IF NOT EXISTS score_reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      module_key TEXT NOT NULL,
      category_name TEXT NOT NULL,
      item_label TEXT NOT NULL,
      base_score REAL,
      self_score REAL NOT NULL,
      first_unit_confirmed INTEGER NOT NULL DEFAULT 0,
      activity_name TEXT,
      activity_duration TEXT,
      proof_files TEXT,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
      reviewer_id INTEGER,
      review_comment TEXT,
      reviewed_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(reviewer_id) REFERENCES users(id)
    )
  `);

  // V2：支持草稿与批量提交
  db.exec(`
    CREATE TABLE IF NOT EXISTS score_reports_v2 (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      submission_id TEXT NOT NULL,
      user_id INTEGER NOT NULL,
      module_key TEXT NOT NULL,
      category_name TEXT NOT NULL,
      item_label TEXT NOT NULL,
      custom_item_label TEXT,
      custom_description TEXT,
      is_other INTEGER NOT NULL DEFAULT 0,
      base_score REAL,
      self_score REAL NOT NULL,
      first_unit_confirmed INTEGER NOT NULL DEFAULT 0,
      activity_name TEXT,
      activity_duration TEXT,
      proof_files TEXT,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
      reviewer_id INTEGER,
      review_comment TEXT,
      reviewed_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(reviewer_id) REFERENCES users(id)
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS score_drafts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL UNIQUE,
      items_json TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS system_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  db.exec('CREATE INDEX IF NOT EXISTS idx_score_reports_v2_user ON score_reports_v2(user_id)');
  db.exec('CREATE INDEX IF NOT EXISTS idx_score_reports_v2_status ON score_reports_v2(status)');
  db.exec('CREATE INDEX IF NOT EXISTS idx_score_reports_v2_submission ON score_reports_v2(submission_id)');

  const exists = db.prepare('SELECT key FROM system_settings WHERE key = ?').get('score_entry_enabled');
  if (!exists) {
    db.prepare('INSERT INTO system_settings (key, value, updated_at) VALUES (?, ?, ?)').run('score_entry_enabled', '1', now());
  }
};

initTables();

const mapScoreReportRow = (row) => {
  if (!row) return null;
  return {
    ...row,
    is_other: !!row.is_other,
    first_unit_confirmed: !!row.first_unit_confirmed,
    proofFiles: safeParseJsonArray(row.proof_files)
  };
};

const getScoreStatusPlaceholders = (statuses) => statuses.map(() => '?').join(',');

module.exports = {
  db,
  ACTIVE_REVIEW_STATUSES,

  // 知识库操作
  getAllKnowledge: () => db.prepare('SELECT * FROM knowledge').all(),
  getKnowledgeById: (id) => db.prepare('SELECT * FROM knowledge WHERE id = ?').get(id),
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
    return rows.map((row) => ({
      ...row,
      tags: safeParseJsonArray(row.tags),
      images: safeParseJsonArray(row.images),
      relatedTech: safeParseJsonArray(row.related_tech)
    }));
  },
  getCaseById: (id) => {
    const row = db.prepare('SELECT * FROM cases WHERE id = ?').get(id);
    if (!row) return null;
    return {
      ...row,
      tags: safeParseJsonArray(row.tags),
      images: safeParseJsonArray(row.images),
      relatedTech: safeParseJsonArray(row.related_tech)
    };
  },
  getCasesByCategory: (category) => {
    const rows = db.prepare('SELECT * FROM cases WHERE category = ?').all(category);
    return rows.map((row) => ({
      ...row,
      tags: safeParseJsonArray(row.tags),
      images: safeParseJsonArray(row.images),
      relatedTech: safeParseJsonArray(row.related_tech)
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
    const rows = db.prepare('SELECT * FROM spirits ORDER BY period ASC, row_index ASC, col_index ASC').all();
    const periods = {};
    rows.forEach((row) => {
      if (!periods[row.period]) {
        periods[row.period] = { period: row.period, spirits: [] };
      }
      while (periods[row.period].spirits.length <= row.row_index) {
        periods[row.period].spirits.push([]);
      }
      periods[row.period].spirits[row.row_index][row.col_index] = {
        name: row.name,
        note: row.note,
        details: row.details
      };
    });
    return Object.values(periods).map((period) => ({
      ...period,
      spirits: period.spirits.map((row) => row.filter(Boolean))
    }));
  },
  insertSpirit: (period, rowIndex, colIndex, spirit) => {
    const stmt = db.prepare(`
      INSERT INTO spirits (period, row_index, col_index, name, note, details)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(period, rowIndex, colIndex, spirit.name, spirit.note || null, spirit.details);
  },
  clearSpirits: () => db.prepare('DELETE FROM spirits').run(),

  // 用户操作
  getUserByUsernameAndRole: (username, role) =>
    db.prepare('SELECT * FROM users WHERE username = ? AND role = ? AND is_active = 1').get(username, role),
  getAnyUserByUsernameAndRole: (username, role) =>
    db.prepare('SELECT * FROM users WHERE username = ? AND role = ?').get(username, role),
  getUserById: (id) =>
    db.prepare('SELECT id, username, display_name, role, is_active, created_at, updated_at FROM users WHERE id = ?').get(id),
  listUsers: () =>
    db
      .prepare(
        'SELECT id, username, display_name, role, is_active, created_at, updated_at FROM users ORDER BY role ASC, username ASC'
      )
      .all(),
  createUser: ({ username, displayName, role, passwordHash }) => {
    const ts = now();
    return db
      .prepare('INSERT INTO users (username, display_name, role, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)')
      .run(username, displayName || null, role, passwordHash, ts, ts);
  },
  upsertUser: ({ username, displayName, role, passwordHash }) => {
    const ts = now();
    const existing = db.prepare('SELECT id FROM users WHERE username = ? AND role = ?').get(username, role);
    if (existing) {
      db.prepare('UPDATE users SET display_name = ?, password_hash = ?, is_active = 1, updated_at = ? WHERE id = ?').run(
        displayName || null,
        passwordHash,
        ts,
        existing.id
      );
      return { id: existing.id, updated: true };
    }
    const inserted = db
      .prepare('INSERT INTO users (username, display_name, role, password_hash, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, 1, ?, ?)')
      .run(username, displayName || null, role, passwordHash, ts, ts);
    return { id: inserted.lastInsertRowid, updated: false };
  },
  updateUserPassword: (id, passwordHash) => db.prepare('UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?').run(passwordHash, now(), id),
  updateUserProfile: (id, { displayName, isActive }) =>
    db
      .prepare('UPDATE users SET display_name = ?, is_active = ?, updated_at = ? WHERE id = ?')
      .run(displayName || null, isActive ? 1 : 0, now(), id),

  // 系统设置
  getScoreEntryEnabled: () => {
    const row = db.prepare('SELECT value FROM system_settings WHERE key = ?').get('score_entry_enabled');
    return row ? row.value === '1' : true;
  },
  setScoreEntryEnabled: (enabled) => {
    const ts = now();
    return db
      .prepare(
        `INSERT INTO system_settings (key, value, updated_at)
         VALUES ('score_entry_enabled', ?, ?)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`
      )
      .run(enabled ? '1' : '0', ts);
  },

  // 草稿
  getScoreDraftByUser: (userId) => {
    const row = db.prepare('SELECT items_json, updated_at FROM score_drafts WHERE user_id = ?').get(userId);
    if (!row) return { items: [], updatedAt: null };
    return {
      items: safeParseJsonArray(row.items_json),
      updatedAt: row.updated_at
    };
  },
  saveScoreDraftByUser: (userId, items) => {
    const ts = now();
    return db
      .prepare(
        `INSERT INTO score_drafts (user_id, items_json, updated_at)
         VALUES (?, ?, ?)
         ON CONFLICT(user_id) DO UPDATE SET items_json = excluded.items_json, updated_at = excluded.updated_at`
      )
      .run(userId, JSON.stringify(items || []), ts);
  },
  clearScoreDraftByUser: (userId) => db.prepare('DELETE FROM score_drafts WHERE user_id = ?').run(userId),

  // V2综测上报
  createScoreReportsBatch: ({ userId, submissionId, items }) => {
    const ts = now();
    const insert = db.prepare(`
      INSERT INTO score_reports_v2 (
        submission_id, user_id, module_key, category_name, item_label,
        custom_item_label, custom_description, is_other,
        base_score, self_score, first_unit_confirmed,
        activity_name, activity_duration, proof_files,
        status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)
    `);

    const tx = db.transaction((payloadItems) => {
      const ids = [];
      payloadItems.forEach((item) => {
        const result = insert.run(
          submissionId,
          userId,
          item.moduleKey,
          item.categoryName,
          item.itemLabel,
          item.customItemLabel || null,
          item.customDescription || null,
          item.isOther ? 1 : 0,
          item.baseScore ?? null,
          item.selfScore,
          item.firstUnitConfirmed ? 1 : 0,
          item.activityName || null,
          item.activityDuration || null,
          JSON.stringify(item.proofFiles || []),
          ts,
          ts
        );
        ids.push(Number(result.lastInsertRowid));
      });
      return ids;
    });

    return tx(items);
  },

  getScoreReportV2ById: (id) => {
    const row = db
      .prepare(
        `SELECT r.*, u.username, u.display_name,
                rv.username AS reviewer_username, rv.display_name AS reviewer_name
         FROM score_reports_v2 r
         JOIN users u ON u.id = r.user_id
         LEFT JOIN users rv ON rv.id = r.reviewer_id
         WHERE r.id = ?`
      )
      .get(id);
    return mapScoreReportRow(row);
  },

  listScoreReportsV2ByUser: (userId) => {
    const rows = db
      .prepare(
        `SELECT r.*, u.username, u.display_name,
                rv.username AS reviewer_username, rv.display_name AS reviewer_name
         FROM score_reports_v2 r
         JOIN users u ON u.id = r.user_id
         LEFT JOIN users rv ON rv.id = r.reviewer_id
         WHERE r.user_id = ?
         ORDER BY datetime(r.created_at) DESC, r.id DESC`
      )
      .all(userId);
    return rows.map(mapScoreReportRow);
  },

  listScoreReportsV2ByUserForReview: (userId) => {
    const rows = db
      .prepare(
        `SELECT r.*, u.username, u.display_name,
                rv.username AS reviewer_username, rv.display_name AS reviewer_name
         FROM score_reports_v2 r
         JOIN users u ON u.id = r.user_id
         LEFT JOIN users rv ON rv.id = r.reviewer_id
         WHERE r.user_id = ?
         ORDER BY datetime(r.created_at) DESC, r.id DESC`
      )
      .all(userId);
    return rows.map(mapScoreReportRow);
  },

  listScoreReportsV2All: () => {
    const rows = db
      .prepare(
        `SELECT r.*, u.username, u.display_name,
                rv.username AS reviewer_username, rv.display_name AS reviewer_name
         FROM score_reports_v2 r
         JOIN users u ON u.id = r.user_id
         LEFT JOIN users rv ON rv.id = r.reviewer_id
         ORDER BY datetime(r.created_at) DESC, r.id DESC`
      )
      .all();
    return rows.map(mapScoreReportRow);
  },

  listScoreReviewStudents: (searchText = '') => {
    const q = `%${searchText}%`;
    return db
      .prepare(
        `SELECT
           u.id AS user_id,
           u.username,
           u.display_name,
           SUM(CASE WHEN r.status = 'pending' THEN 1 ELSE 0 END) AS pending_count,
           COUNT(1) AS total_count,
           MAX(r.updated_at) AS latest_updated_at
         FROM score_reports_v2 r
         JOIN users u ON u.id = r.user_id
         WHERE (? = '' OR u.username LIKE ? OR u.display_name LIKE ?)
         GROUP BY u.id, u.username, u.display_name
         ORDER BY pending_count DESC, datetime(latest_updated_at) DESC`
      )
      .all(searchText, q, q);
  },

  batchReviewScoreReports: ({ reportIds, status, reviewerId, reviewComment }) => {
    if (!Array.isArray(reportIds) || reportIds.length === 0) {
      return { changes: 0 };
    }
    const ts = now();
    const placeholders = reportIds.map(() => '?').join(',');
    const sql = `
      UPDATE score_reports_v2
      SET status = ?, reviewer_id = ?, review_comment = ?, reviewed_at = ?, updated_at = ?
      WHERE id IN (${placeholders})
    `;
    return db.prepare(sql).run(status, reviewerId, reviewComment || null, ts, ts, ...reportIds);
  },

  // 规则校验统计
  sumSelfScoreByModuleV2: (userId, moduleKey, statuses = ACTIVE_REVIEW_STATUSES) => {
    if (!statuses.length) return 0;
    const placeholders = getScoreStatusPlaceholders(statuses);
    const row = db
      .prepare(
        `SELECT COALESCE(SUM(self_score), 0) AS total
         FROM score_reports_v2
         WHERE user_id = ? AND module_key = ? AND status IN (${placeholders})`
      )
      .get(userId, moduleKey, ...statuses);
    return Number(row?.total || 0);
  },

  sumSelfScoreByModuleAndCategoryV2: (userId, moduleKey, categoryName, statuses = ACTIVE_REVIEW_STATUSES) => {
    if (!statuses.length) return 0;
    const placeholders = getScoreStatusPlaceholders(statuses);
    const row = db
      .prepare(
        `SELECT COALESCE(SUM(self_score), 0) AS total
         FROM score_reports_v2
         WHERE user_id = ? AND module_key = ? AND category_name = ? AND status IN (${placeholders})`
      )
      .get(userId, moduleKey, categoryName, ...statuses);
    return Number(row?.total || 0);
  },

  countReportsByTextV2: (userId, moduleKey, text, statuses = ACTIVE_REVIEW_STATUSES) => {
    if (!statuses.length) return 0;
    const placeholders = getScoreStatusPlaceholders(statuses);
    const like = `%${text}%`;
    const row = db
      .prepare(
        `SELECT COUNT(1) AS count
         FROM score_reports_v2
         WHERE user_id = ?
           AND module_key = ?
           AND (
             item_label LIKE ? OR
             IFNULL(custom_item_label, '') LIKE ? OR
             IFNULL(custom_description, '') LIKE ?
           )
           AND status IN (${placeholders})`
      )
      .get(userId, moduleKey, like, like, like, ...statuses);
    return Number(row?.count || 0);
  },

  sumSelfScoreByTextV2: (userId, moduleKey, text, statuses = ACTIVE_REVIEW_STATUSES) => {
    if (!statuses.length) return 0;
    const placeholders = getScoreStatusPlaceholders(statuses);
    const like = `%${text}%`;
    const row = db
      .prepare(
        `SELECT COALESCE(SUM(self_score), 0) AS total
         FROM score_reports_v2
         WHERE user_id = ?
           AND module_key = ?
           AND (
             item_label LIKE ? OR
             IFNULL(custom_item_label, '') LIKE ? OR
             IFNULL(custom_description, '') LIKE ?
           )
           AND status IN (${placeholders})`
      )
      .get(userId, moduleKey, like, like, like, ...statuses);
    return Number(row?.total || 0);
  }
};
