const moduleTextMap = {
  moral_education: '德育加分',
  intellectual_education: '智育加分',
  physical_aesthetic_labor: '体美劳育'
};

const escapeCsvCell = (value) => {
  if (value === null || value === undefined) return '';
  const text = String(value);
  if (/[",\r\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
};

const toJsonCell = (value) => {
  if (value === null || value === undefined) return '';
  return JSON.stringify(value);
};

const createCsv = (columns, rows) => {
  const lines = [columns.map((column) => escapeCsvCell(column.label)).join(',')];
  rows.forEach((row) => {
    lines.push(columns.map((column) => escapeCsvCell(row[column.key])).join(','));
  });
  return lines.join('\r\n');
};

const buildAdminExportDataset = (database) => {
  const users = database.listUsers();
  const rankings = database.listScoreRankings();
  const drafts = database.listScoreDraftsAll();
  const reports = database.listScoreReportsV2All();

  const rankingByUserId = new Map(rankings.map((item) => [item.user_id, item]));
  const draftByUserId = new Map(drafts.map((item) => [item.user_id, item]));
  const reportsByUserId = new Map();

  reports.forEach((report) => {
    const list = reportsByUserId.get(report.user_id) || [];
    list.push(report);
    reportsByUserId.set(report.user_id, list);
  });

  const rows = [];

  users
    .filter((user) => user.role === 'student')
    .forEach((user) => {
      const ranking = rankingByUserId.get(user.id) || null;
      const draft = draftByUserId.get(user.id) || null;
      const userReports = reportsByUserId.get(user.id) || [null];

      userReports.forEach((report) => {
        const proofFiles = report?.proofFiles || [];
        const draftItems = Array.isArray(draft?.items) ? draft.items : [];

        rows.push({
          exported_at: new Date().toISOString(),
          user_id: user.id,
          username: user.username,
          display_name: user.display_name || '',
          role: user.role,
          is_active: user.is_active ? '1' : '0',
          user_created_at: user.created_at,
          user_updated_at: user.updated_at,
          ranking_total_score: ranking ? Number(ranking.total_score).toFixed(2) : '',
          ranking_moral_score: ranking ? Number(ranking.moral_score).toFixed(2) : '',
          ranking_intellectual_score: ranking ? Number(ranking.intellectual_score).toFixed(2) : '',
          ranking_physical_score: ranking ? Number(ranking.physical_score).toFixed(2) : '',
          ranking_approved_count: ranking?.approved_count ?? '',
          ranking_pending_count: ranking?.pending_count ?? '',
          ranking_total_count: ranking?.total_count ?? '',
          draft_updated_at: draft?.updated_at || '',
          draft_item_count: draftItems.length,
          draft_items_json: toJsonCell(draftItems),
          report_id: report?.id ?? '',
          submission_id: report?.submission_id ?? '',
          module_key: report?.module_key ?? '',
          module_name: report ? moduleTextMap[report.module_key] || report.module_key : '',
          category_name: report?.category_name ?? '',
          item_label: report?.item_label ?? '',
          display_item_label: report
            ? report.is_other
              ? report.custom_item_label || '其它'
              : report.item_label
            : '',
          is_other: report ? (report.is_other ? '1' : '0') : '',
          custom_item_label: report?.custom_item_label ?? '',
          custom_description: report?.custom_description ?? '',
          base_score: report?.base_score ?? '',
          self_score: report?.self_score ?? '',
          first_unit_confirmed: report ? (report.first_unit_confirmed ? '1' : '0') : '',
          activity_name: report?.activity_name ?? '',
          activity_duration: report?.activity_duration ?? '',
          review_status: report?.status ?? '',
          review_comment: report?.review_comment ?? '',
          reviewer_username: report?.reviewer_username ?? '',
          reviewer_name: report?.reviewer_name ?? '',
          report_created_at: report?.created_at ?? '',
          report_reviewed_at: report?.reviewed_at ?? '',
          proof_file_count: proofFiles.length,
          proof_files_json: toJsonCell(proofFiles)
        });
      });
    });

  return {
    columns: [
      { key: 'exported_at', label: '导出时间' },
      { key: 'user_id', label: '用户ID' },
      { key: 'username', label: '学号' },
      { key: 'display_name', label: '姓名' },
      { key: 'role', label: '角色' },
      { key: 'is_active', label: '启用状态' },
      { key: 'user_created_at', label: '用户创建时间' },
      { key: 'user_updated_at', label: '用户更新时间' },
      { key: 'ranking_total_score', label: '当前总分' },
      { key: 'ranking_moral_score', label: '德育得分' },
      { key: 'ranking_intellectual_score', label: '智育得分' },
      { key: 'ranking_physical_score', label: '体美劳得分' },
      { key: 'ranking_approved_count', label: '已通过条数' },
      { key: 'ranking_pending_count', label: '待审条数' },
      { key: 'ranking_total_count', label: '总条数' },
      { key: 'draft_updated_at', label: '草稿更新时间' },
      { key: 'draft_item_count', label: '草稿条数' },
      { key: 'draft_items_json', label: '草稿明细JSON' },
      { key: 'report_id', label: '上报记录ID' },
      { key: 'submission_id', label: '批次提交ID' },
      { key: 'module_key', label: '模块键名' },
      { key: 'module_name', label: '模块名称' },
      { key: 'category_name', label: '类别名称' },
      { key: 'item_label', label: '原始加分项' },
      { key: 'display_item_label', label: '展示加分项' },
      { key: 'is_other', label: '是否自定义项' },
      { key: 'custom_item_label', label: '自定义加分项' },
      { key: 'custom_description', label: '自定义说明' },
      { key: 'base_score', label: '参考分值' },
      { key: 'self_score', label: '自评分值' },
      { key: 'first_unit_confirmed', label: '是否确认第一单位' },
      { key: 'activity_name', label: '活动名称' },
      { key: 'activity_duration', label: '活动时长' },
      { key: 'review_status', label: '审核状态' },
      { key: 'review_comment', label: '审核意见' },
      { key: 'reviewer_username', label: '审核人账号' },
      { key: 'reviewer_name', label: '审核人姓名' },
      { key: 'report_created_at', label: '上报创建时间' },
      { key: 'report_reviewed_at', label: '审核时间' },
      { key: 'proof_file_count', label: '证明材料数量' },
      { key: 'proof_files_json', label: '证明材料JSON' }
    ],
    rows
  };
};

const buildAdminExportCsv = (database) => {
  const dataset = buildAdminExportDataset(database);
  return createCsv(dataset.columns, dataset.rows);
};

module.exports = {
  buildAdminExportCsv
};
