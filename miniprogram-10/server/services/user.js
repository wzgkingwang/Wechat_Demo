const base = require('./base')

// 未完成
// 登陆,post,获取账号名，和头像
exports.addtags = async function (id) {
    const sql = `insert into tags(tagsName) value (?);`;
    const [results] = await base.execute(sql, [id]);
}

// 注销,post
exports.addtags = async function (id) {
    const sql = `insert into tags(tagsName) value (?);`;
    const [results] = await base.execute(sql, [id]);
}

// 注册,post
exports.addtags = async function (id) {
    const sql = `insert into tags(tagsName) value (?);`;
    const [results] = await base.execute(sql, [id]);
}

// 我是谁,get
exports.gettags = async function () {
    const sql = `select DISTINCT tagsName from tags order by id desc limit 0,30`;
    const [results] = await base.execute(sql);
    return results
}