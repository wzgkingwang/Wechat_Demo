const base = require('./base')

// 时间模块
const moment = require("moment");
// 输出时间的格式
const formats = ["YYYY-MM-DD HH:mm:ss", "YYYY-M-D H:m:s", "x"];
// 时间显示为中文
moment.locale("zh-cn");
// 得到当前时间戳(get)
// console.log( +moment.utc());
// 根据时间戳，显示（发生在客户端）utc时间转换成本地(transform)
// const m = moment.utc(value, formats, true);
// console.log(m.local().format("YYYY年MM月DD日 HH点mm分ss秒")); //local是转换为本地时间

// 添加文章
exports.addArticles = async function (content, author, title, tags, tagId, userId) {
    const createdAt = +moment.utc();
    const updatedAt = +moment.utc();
    // insert into articles(content,author,title,tags,createdAt,updatedAt,tagId,userId) value('asdasdasasdasd','jonas','帅','前端','1607683375179','1607683375179',2,1)
    const sql = `insert into articles(content,author,title,tags,createdAt,updatedAt,tagId,userId) value(?,?,?,?,?,?,?,?);`;
    const [results] = await base.execute(sql, [content, author, title, tags, createdAt, updatedAt, tagId, userId]);
}

// 修改文章
exports.putArticles = async function (content, title, tags, id) {
    const updateAt = +moment.utc();
    const sql = `update articles set content=?,title=?,tags=?,updatedAt=? where id= ?`;
    const [results] = await base.execute(sql, [content, title, tags, updateAt, id]);
}

// 获取view值
exports.getArticlesView = async function (id) {
    const sql = `select view from articles where id=?`;
    const [results] = await base.execute(sql, [id]);
    return results
}

// 修改文章阅读量view
exports.putArticlesView = async function (view, id) {
    const sql = `update articles set view=? where id=?`;
    const [results] = await base.execute(sql, [view, id]);
}

// 删除文章
exports.deleteArticles = async function (id) {
    const deletedAt = +moment.utc()
    const sql = `update articles set deletedAt=? where id= ?`;
    const [results] = await base.execute(sql, [deletedAt, id]);
}

// 热门博客，默认5条
exports.getArticlesHot = async function (skip = 0, limit = 5) {
    const sql = `select *, count(DISTINCT title) from articles where deletedAt is null group by title order by view desc limit ?,?`;
    let [results] = await base.execute(sql, [skip, limit]);
    return results.map((item) => {
        let resObj = { ...item }
        resObj.createdAt = moment.utc(item.createdAt, formats, true).local().format("YYYY年MM月DD日 HH点mm分ss秒")
        // 更新时间
        resObj.updatedAt = moment.utc(item.updatedAt, formats, true).local().format("YYYY年MM月DD日 HH点mm分ss秒")
        return resObj
    })
}

// 执行上面三个业务api后，需要执行一次get页面更新数据
// 获取文章,默认：跳过0条，只获取4条
exports.getArticles = async function (skip = 0, limit = 4) {
    // console.log(skip, limit)
    const sqlArr = `select * from articles where deletedAt is null order by id asc limit ?,?`;
    // console.log(skip)
    let [arr] = await base.execute(sqlArr, [skip, limit]);
    const sqlCount = `select count(id) from articles where deletedAt is null`;
    let [count] = await base.execute(sqlCount);
    // 对每个对象映射处理create和update
    arr = arr.map((item) => {
        let resObj = { ...item }
        resObj.createdAt = moment.utc(item.createdAt, formats, true).local().format("YYYY年MM月DD日 HH点mm分ss秒")
        // 更新时间
        resObj.updatedAt = moment.utc(item.updatedAt, formats, true).local().format("YYYY年MM月DD日 HH点mm分ss秒")
        return resObj
    })
    return {
        arr,
        count
    }
    // 将数据库的时间戳转换为本地的时间展示
    // const m = moment.utc(value, formats, true); //value数据库的时间戳
    // m.local().format("YYYY年MM月DD日 HH点mm分ss秒")
}

// 获取博客指定id的博客
exports.getArticleId = async function (id) {
    const sql = `select * from articles where deletedAt is null and id=?`;
    const [results] = await base.execute(sql, [id]);
    // 将数据库的时间戳转换为本地的时间展示
    // 创建时间
    const c = moment.utc(results[0].createdAt, formats, true);
    results[0].createdAt = c.local().format("YYYY年MM月DD日 HH点mm分ss秒")
    // 更新时间
    const u = moment.utc(results[0].updatedAt, formats, true);
    results[0].createdAt = u.local().format("YYYY年MM月DD日 HH点mm分ss秒")
    return results
}