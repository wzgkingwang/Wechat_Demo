const base = require('./base')

exports.addEverySentences = async function (content,author) {
  // 创建一个数据库连接
  const sql = `insert into everydaysentences(content,author) value(?,?);`;
  const [results] = await base.execute(sql, [content,author]);
}


exports.getEverySentences = async function (){
  const sql = `select content,author from everydaysentences order by id desc limit 0,5`;
  const [results] = await base.execute(sql);
  return results
}