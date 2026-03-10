// Express server setup
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const multer = require('multer');

const llmService = require('./services/llmService');
const kolorsService = require('./services/kolorsService');
const database = require('./database');
const scoreService = require('./services/scoreService');
const { ensureDefaultUsers } = require('./services/userBootstrap');
const { signToken, authenticate, requireRole, buildSafeUser } = require('./middleware/auth');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

if (!process.env.JWT_SECRET) {
  console.warn('[WARN] JWT_SECRET is not set. Using insecure fallback secret for development only.');
}

ensureDefaultUsers();

const uploadDir = path.join(__dirname, 'uploads', 'score-proofs');
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext || '.bin'}`);
  }
});

const uploadProof = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    const isImage = file.mimetype.startsWith('image/');
    const isPdf = file.mimetype === 'application/pdf';
    if (!isImage && !isPdf) return cb(new Error('仅支持图片或 PDF 文件'));
    cb(null, true);
  },
  limits: { files: 10, fileSize: 10 * 1024 * 1024 }
});

app.use(cors());
app.use(express.json({ limit: '4mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const SHA256_HEX_RE = /^[a-f0-9]{64}$/i;

const resolvePasswordDigest = (passwordDigest) => {
  const normalizedDigest = String(passwordDigest || '').trim().toLowerCase();
  if (SHA256_HEX_RE.test(normalizedDigest)) return normalizedDigest;
  return '';
};

const ensureScoreEntryOpen = (req, res, next) => {
  if (!database.getScoreEntryEnabled()) {
    return res.status(403).json({ error: '综测上报入口当前已关闭，请联系管理员', code: 'ENTRY_DISABLED' });
  }
  return next();
};

// ==================== Auth APIs ====================
app.post('/api/auth/login', (req, res) => {
  try {
    const { role, username, passwordDigest } = req.body || {};
    if (!role || !username) {
      return res.status(400).json({ error: 'role、username 为必填项' });
    }
    if (!['student', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'role 仅支持 student 或 admin' });
    }
    const resolvedPasswordDigest = resolvePasswordDigest(passwordDigest);
    if (!SHA256_HEX_RE.test(resolvedPasswordDigest)) {
      return res.status(400).json({ error: 'passwordDigest 必须是 SHA-256 64位十六进制字符串' });
    }

    const user = database.getUserByUsernameAndRole(String(username).trim(), role);
    if (!user) return res.status(401).json({ error: '账号不存在或身份不匹配' });
    if (!bcrypt.compareSync(resolvedPasswordDigest, user.password_hash)) {
      return res.status(401).json({ error: '密码错误' });
    }

    return res.json({ token: signToken(user), user: buildSafeUser(user) });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: '登录失败，请稍后重试' });
  }
});

app.get('/api/auth/me', authenticate, (req, res) => res.json({ user: req.user }));
app.post('/api/auth/logout', authenticate, (_req, res) => res.json({ success: true }));

// ==================== User Admin APIs ====================
app.get('/api/admin/users', authenticate, requireRole('admin'), (_req, res) => {
  try {
    res.json({ users: database.listUsers() });
  } catch (error) {
    console.error('List users error:', error);
    res.status(500).json({ error: '获取用户列表失败' });
  }
});

app.post('/api/admin/users', authenticate, requireRole('admin'), (req, res) => {
  try {
    const { username, displayName, role, passwordDigest } = req.body || {};
    if (!username || !role) {
      return res.status(400).json({ error: 'username、role 为必填项' });
    }
    if (!['student', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'role 仅支持 student 或 admin' });
    }
    const resolvedPasswordDigest = resolvePasswordDigest(passwordDigest);
    if (!SHA256_HEX_RE.test(resolvedPasswordDigest)) {
      return res.status(400).json({ error: 'passwordDigest 必须是 SHA-256 64位十六进制字符串' });
    }

    const existing = database.getAnyUserByUsernameAndRole(String(username).trim(), role);
    if (existing) return res.status(409).json({ error: '该身份下用户名已存在' });

    const result = database.createUser({
      username: String(username).trim(),
      displayName: displayName ? String(displayName).trim() : null,
      role,
      passwordHash: bcrypt.hashSync(resolvedPasswordDigest, 10)
    });

    res.status(201).json({ user: database.getUserById(Number(result.lastInsertRowid)) });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: '创建用户失败' });
  }
});

app.post('/api/admin/users/bulk', authenticate, requireRole('admin'), (req, res) => {
  try {
    const { users } = req.body || {};
    if (!Array.isArray(users) || !users.length) {
      return res.status(400).json({ error: 'users 必须是非空数组' });
    }

    const result = { created: 0, updated: 0, failed: [] };

    users.forEach((item, index) => {
      try {
        const username = String(item.username || '').trim();
        const role = item.role === 'admin' ? 'admin' : 'student';
        const displayName = item.displayName ? String(item.displayName).trim() : username;
        const passwordDigest = resolvePasswordDigest(item.passwordDigest);

        if (!username || !SHA256_HEX_RE.test(passwordDigest)) throw new Error('用户名为空或密码摘要无效');

        const upsert = database.upsertUser({
          username,
          displayName,
          role,
          passwordHash: bcrypt.hashSync(passwordDigest, 10)
        });

        if (upsert.updated) result.updated += 1;
        else result.created += 1;
      } catch (error) {
        result.failed.push({ index, error: error.message || '导入失败' });
      }
    });

    res.json(result);
  } catch (error) {
    console.error('Bulk import users error:', error);
    res.status(500).json({ error: '批量导入失败' });
  }
});

app.patch('/api/admin/users/:id/password', authenticate, requireRole('admin'), (req, res) => {
  try {
    const userId = Number(req.params.id);
    const { passwordDigest } = req.body || {};
    const resolvedPasswordDigest = resolvePasswordDigest(passwordDigest);

    if (!Number.isFinite(userId) || userId <= 0) return res.status(400).json({ error: '无效用户ID' });
    if (!SHA256_HEX_RE.test(resolvedPasswordDigest)) {
      return res.status(400).json({ error: 'passwordDigest 必须是 SHA-256 64位十六进制字符串' });
    }

    const result = database.updateUserPassword(userId, bcrypt.hashSync(resolvedPasswordDigest, 10));
    if (!result.changes) return res.status(404).json({ error: '用户不存在' });

    res.json({ success: true });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ error: '重置密码失败' });
  }
});

app.patch('/api/admin/users/:id/profile', authenticate, requireRole('admin'), (req, res) => {
  try {
    const userId = Number(req.params.id);
    const { displayName, isActive } = req.body || {};

    if (!Number.isFinite(userId) || userId <= 0) return res.status(400).json({ error: '无效用户ID' });

    const result = database.updateUserProfile(userId, {
      displayName: displayName ? String(displayName).trim() : null,
      isActive: Boolean(isActive)
    });

    if (!result.changes) return res.status(404).json({ error: '用户不存在' });
    res.json({ user: database.getUserById(userId) });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: '更新用户信息失败' });
  }
});

// ==================== Score Entry Switch ====================
app.get('/api/score/entry-status', (_req, res) => {
  res.json({ enabled: database.getScoreEntryEnabled() });
});

app.get('/api/admin/score/entry-status', authenticate, requireRole('admin'), (_req, res) => {
  res.json({ enabled: database.getScoreEntryEnabled() });
});

app.patch('/api/admin/score/entry-status', authenticate, requireRole('admin'), (req, res) => {
  const { enabled } = req.body || {};
  if (typeof enabled !== 'boolean') {
    return res.status(400).json({ error: 'enabled 必须为 boolean' });
  }
  database.setScoreEntryEnabled(enabled);
  return res.json({ enabled });
});

app.get('/api/admin/score-config', authenticate, requireRole('admin'), (_req, res) => {
  try {
    const config = scoreService.getRawScoreConfig();
    return res.json({ config });
  } catch (error) {
    console.error('Get score config error:', error);
    return res.status(500).json({ error: '读取综测配置失败' });
  }
});

app.put('/api/admin/score-config', authenticate, requireRole('admin'), (req, res) => {
  try {
    const config = req.body?.config;
    if (!config || typeof config !== 'object') {
      return res.status(400).json({ error: 'config 必须是 JSON 对象' });
    }
    const saved = scoreService.saveRawScoreConfig(config);
    return res.json({ config: saved });
  } catch (error) {
    if (error.code === 'CONFIG_INVALID') {
      return res.status(error.status || 400).json({ error: error.message, code: error.code });
    }
    console.error('Save score config error:', error);
    return res.status(500).json({ error: '保存综测配置失败' });
  }
});

// ==================== Score Draft/Submit APIs ====================
app.get('/api/score/config', (_req, res) => {
  res.json({ config: scoreService.getScoreConfig(), entryEnabled: database.getScoreEntryEnabled() });
});

app.post('/api/score-proofs', authenticate, requireRole('student'), ensureScoreEntryOpen, uploadProof.array('files', 10), (req, res) => {
  const proofFiles = (req.files || []).map((file) => ({
    filename: file.filename,
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    url: `/uploads/score-proofs/${file.filename}`
  }));
  res.json({ proofFiles });
});

app.get('/api/score-draft', authenticate, requireRole('student'), ensureScoreEntryOpen, (req, res) => {
  const draft = database.getScoreDraftByUser(req.user.id);
  res.json({ ...draft, entryEnabled: true });
});

app.put('/api/score-draft', authenticate, requireRole('student'), ensureScoreEntryOpen, (req, res) => {
  try {
    const sanitized = scoreService.sanitizeDraftItems(req.body?.items || []);
    database.saveScoreDraftByUser(req.user.id, sanitized);
    const draft = database.getScoreDraftByUser(req.user.id);
    return res.json({ ...draft });
  } catch (error) {
    console.error('Save draft error:', error);
    return res.status(500).json({ error: '保存草稿失败' });
  }
});

app.post('/api/score-reports/submit-draft', authenticate, requireRole('student'), ensureScoreEntryOpen, (req, res) => {
  try {
    const draft = database.getScoreDraftByUser(req.user.id);
    const validItems = scoreService.validateSubmitItems({
      items: draft.items,
      userId: req.user.id,
      database
    });

    const submissionId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const ids = database.createScoreReportsBatch({
      userId: req.user.id,
      submissionId,
      items: validItems
    });

    database.clearScoreDraftByUser(req.user.id);

    const created = ids.map((id) => database.getScoreReportV2ById(id)).filter(Boolean);
    return res.status(201).json({ submissionId, reports: created });
  } catch (error) {
    if (error.code === 'VALIDATION_ERROR' || error.code === 'LIMIT_EXCEEDED') {
      return res.status(error.status || 400).json({ error: error.message, code: error.code, detail: error.detail || null });
    }
    console.error('Submit draft error:', error);
    return res.status(500).json({ error: '提交失败' });
  }
});

app.get('/api/score-reports/mine', authenticate, requireRole('student'), (req, res) => {
  try {
    const reports = database.listScoreReportsV2ByUser(req.user.id);
    const summary = scoreService.buildSummary(reports);
    res.json({ reports, summary, entryEnabled: database.getScoreEntryEnabled() });
  } catch (error) {
    console.error('List my reports error:', error);
    res.status(500).json({ error: '获取个人上报记录失败' });
  }
});

// 兼容旧接口（已改为提交草稿）
app.post('/api/score-reports', authenticate, requireRole('student'), ensureScoreEntryOpen, (req, res) => {
  res.status(400).json({ error: '请使用批量提交流程：先保存草稿，再调用 /api/score-reports/submit-draft' });
});

// ==================== Admin Review APIs ====================
app.get('/api/admin/score-review/students', authenticate, requireRole('admin'), (req, res) => {
  const search = String(req.query.search || '').trim();
  const students = database.listScoreReviewStudents(search);
  res.json({ students });
});

app.get('/api/admin/score-review/students/:userId', authenticate, requireRole('admin'), (req, res) => {
  const userId = Number(req.params.userId);
  if (!Number.isFinite(userId) || userId <= 0) {
    return res.status(400).json({ error: '无效用户ID' });
  }

  const reports = database.listScoreReportsV2ByUserForReview(userId);
  const user = database.getUserById(userId);
  return res.json({ user, reports, summary: scoreService.buildSummary(reports) });
});

app.get('/api/admin/score-rankings', authenticate, requireRole('admin'), (_req, res) => {
  try {
    const rankings = database.listScoreRankings();
    return res.json({ rankings });
  } catch (error) {
    console.error('List score rankings error:', error);
    return res.status(500).json({ error: '获取积分排名失败' });
  }
});

app.patch('/api/admin/score-review/batch', authenticate, requireRole('admin'), (req, res) => {
  try {
    const { reportIds, status, reviewComment } = req.body || {};
    if (!Array.isArray(reportIds) || !reportIds.length) {
      return res.status(400).json({ error: 'reportIds 不能为空' });
    }
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'status 仅支持 approved/rejected' });
    }
    if (status === 'rejected' && !String(reviewComment || '').trim()) {
      return res.status(400).json({ error: '驳回时必须填写原因' });
    }

    const normalizedIds = reportIds.map((id) => Number(id)).filter((id) => Number.isFinite(id) && id > 0);
    if (!normalizedIds.length) {
      return res.status(400).json({ error: 'reportIds 无有效ID' });
    }

    const result = database.batchReviewScoreReports({
      reportIds: normalizedIds,
      status,
      reviewerId: req.user.id,
      reviewComment: reviewComment ? String(reviewComment) : null
    });

    return res.json({ success: true, changes: result.changes });
  } catch (error) {
    console.error('Batch review error:', error);
    return res.status(500).json({ error: '批量审核失败' });
  }
});

// 兼容旧管理接口
app.get('/api/admin/score-reports', authenticate, requireRole('admin'), (_req, res) => {
  res.json({ reports: database.listScoreReportsV2All() });
});

app.patch('/api/admin/score-reports/:id/review', authenticate, requireRole('admin'), (req, res) => {
  const reportId = Number(req.params.id);
  const { status, reviewComment } = req.body || {};
  if (!Number.isFinite(reportId) || reportId <= 0) return res.status(400).json({ error: '无效上报ID' });
  if (!['approved', 'rejected'].includes(status)) return res.status(400).json({ error: 'status 仅支持 approved/rejected' });
  if (status === 'rejected' && !String(reviewComment || '').trim()) return res.status(400).json({ error: '驳回时必须填写原因' });

  database.batchReviewScoreReports({
    reportIds: [reportId],
    status,
    reviewerId: req.user.id,
    reviewComment: reviewComment ? String(reviewComment) : null
  });

  return res.json({ report: database.getScoreReportV2ById(reportId) });
});

// ==================== AI APIs ====================
app.post('/api/study-plan', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: 'Query parameter is required' });
    const result = await llmService.generateStudyPlan(query);
    return res.json({ result });
  } catch (error) {
    console.error('Error in API endpoint:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Image generation prompt is required' });

    const apiKey = process.env.LLM_API_KEY || process.env.SILICON_FLOW_API_KEY;
    if (!process.env.LLM_API_KEY && process.env.SILICON_FLOW_API_KEY) {
      console.warn('SILICON_FLOW_API_KEY is deprecated. Please migrate to LLM_API_KEY.');
    }

    const imageUrl = await kolorsService.generateImage(prompt, apiKey);
    return res.json({ imageUrl });
  } catch (error) {
    console.error('Error in image generation endpoint:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// ==================== Existing Data APIs ====================
app.get('/api/knowledge', (_req, res) => {
  try {
    return res.json(database.getAllKnowledge());
  } catch (error) {
    console.error('Error fetching knowledge:', error);
    return res.status(500).json({ error: error.message });
  }
});

app.get('/api/knowledge/:id', (req, res) => {
  try {
    const data = database.getKnowledgeById(req.params.id);
    if (!data) return res.status(404).json({ error: 'Knowledge not found' });
    return res.json(data);
  } catch (error) {
    console.error('Error fetching knowledge by id:', error);
    return res.status(500).json({ error: error.message });
  }
});

app.get('/api/cases', (req, res) => {
  try {
    const { category } = req.query;
    return res.json(category ? database.getCasesByCategory(category) : database.getAllCases());
  } catch (error) {
    console.error('Error fetching cases:', error);
    return res.status(500).json({ error: error.message });
  }
});

app.get('/api/cases/:id', (req, res) => {
  try {
    const data = database.getCaseById(req.params.id);
    if (!data) return res.status(404).json({ error: 'Case not found' });
    return res.json(data);
  } catch (error) {
    console.error('Error fetching case by id:', error);
    return res.status(500).json({ error: error.message });
  }
});

app.get('/api/spirits', (_req, res) => {
  try {
    return res.json(database.getAllSpirits());
  } catch (error) {
    console.error('Error fetching spirits:', error);
    return res.status(500).json({ error: error.message });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Backend server is running' });
});

app.use((err, _req, res, _next) => {
  if (err) {
    console.error('Unhandled backend error:', err);
    return res.status(400).json({ error: err.message || '请求处理失败' });
  }
  return res.status(500).json({ error: '服务器内部错误' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log('API endpoints ready');
});
