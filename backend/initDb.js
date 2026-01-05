// 数据迁移脚本 - 将静态数据导入SQLite数据库
const database = require('./database');

// 从后端data目录导入静态数据
const FIELD_KNOWLEDGE_DB = require('./data/knowledgeData');
const CASE_DB = require('./data/redSoulData');
const SPIRIT_DATA = require('./data/spiritData');

console.log('开始数据迁移...');

// 迁移知识库数据
console.log('\n[1/3] 迁移知识库数据...');
let knowledgeCount = 0;
Object.values(FIELD_KNOWLEDGE_DB).forEach(field => {
  database.insertKnowledge(field);
  knowledgeCount++;
  console.log(`  - 已导入: ${field.name}`);
});
console.log(`知识库数据迁移完成，共 ${knowledgeCount} 条记录`);

// 迁移案例数据
console.log('\n[2/3] 迁移案例数据...');
let caseCount = 0;
Object.values(CASE_DB).forEach(caseItem => {
  database.insertCase(caseItem);
  caseCount++;
  console.log(`  - 已导入: ${caseItem.title}`);
});
console.log(`案例数据迁移完成，共 ${caseCount} 条记录`);

// 迁移精神谱系数据
console.log('\n[3/3] 迁移精神谱系数据...');
database.clearSpirits(); // 清除现有数据以避免重复
let spiritCount = 0;
SPIRIT_DATA.forEach(category => {
  category.spirits.forEach((row, rowIndex) => {
    row.forEach((spirit, colIndex) => {
      database.insertSpirit(category.period, rowIndex, colIndex, spirit);
      spiritCount++;
    });
  });
  console.log(`  - 已导入时期: ${category.period}`);
});
console.log(`精神谱系数据迁移完成，共 ${spiritCount} 条记录`);

console.log('\n========================================');
console.log('数据迁移全部完成！');
console.log(`  - 知识库: ${knowledgeCount} 条`);
console.log(`  - 案例: ${caseCount} 条`);
console.log(`  - 精神谱系: ${spiritCount} 条`);
console.log('========================================');

process.exit(0);
