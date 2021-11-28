const base = require('./base')

// 添加标签
exports.addtags = async function (id) {
  const sql = `insert into tags(tagsName) value (?);`;
  const [results] = await base.execute(sql, [id]);
}

// 获取标签30条
exports.gettags = async function (){
  const sql = `select DISTINCT tagsName from tags order by id desc limit 0,30`;
  const [results] = await base.execute(sql);
  return results
}