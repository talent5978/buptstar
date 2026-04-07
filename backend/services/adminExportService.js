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

const createCsv = (headers, rows) => {
  const lines = [headers.map(escapeCsvCell).join(',')];
  rows.forEach((row) => {
    lines.push(headers.map((header) => escapeCsvCell(row[header])).join(','));
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
    headers: [
      'exported_at',
      'user_id',
      'username',
      'display_name',
      'role',
      'is_active',
      'user_created_at',
      'user_updated_at',
      'ranking_total_score',
      'ranking_moral_score',
      'ranking_intellectual_score',
      'ranking_physical_score',
      'ranking_approved_count',
      'ranking_pending_count',
      'ranking_total_count',
      'draft_updated_at',
      'draft_item_count',
      'draft_items_json',
      'report_id',
      'submission_id',
      'module_key',
      'module_name',
      'category_name',
      'item_label',
      'display_item_label',
      'is_other',
      'custom_item_label',
      'custom_description',
      'base_score',
      'self_score',
      'first_unit_confirmed',
      'activity_name',
      'activity_duration',
      'review_status',
      'review_comment',
      'reviewer_username',
      'reviewer_name',
      'report_created_at',
      'report_reviewed_at',
      'proof_file_count',
      'proof_files_json'
    ],
    rows
  };
};

const buildAdminExportCsv = (database) => {
  const dataset = buildAdminExportDataset(database);
  return createCsv(dataset.headers, dataset.rows);
};

module.exports = {
  buildAdminExportCsv
};
