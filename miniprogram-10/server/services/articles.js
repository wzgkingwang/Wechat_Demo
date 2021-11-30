const base = require('./base')

// 添加文章
exports.addArticles = async function (Ctime, Ctext, Cpicture, Cvideo, Caddress) {
    const sql = `insert into comment(Ctime,Ctext,Cpicture,Cvideo,Caddress) value(?,?,?,?,?);`;
    const [results] = await base.execute(sql, [Ctime, Ctext, Cpicture, Cvideo, Caddress]);
}

// 删除文章
exports.deleteArticles = async function (id) {
    const sql = `delete from comment where id=?`;
    const [results] = await base.execute(sql, [id]);
}

// 获取文章,默认：跳过0条，只获取4条
exports.getArticles = async function (skip = 0, limit = 4) {
    // console.log(skip, limit)
    const sqlArr = `select * from comment order by id desc limit ?,?`;
    // console.log(skip)
    let [arr] = await base.execute(sqlArr, [skip, limit]);

    const sqlCount = `select count(id) from comment`;
    let [count] = await base.execute(sqlCount);
    return {
        arr,
        count
    }
}