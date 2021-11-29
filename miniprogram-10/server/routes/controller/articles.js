const Router = require('@koa/router')
const articles = require('../../services/articles')
const getResult = require('../getSendResult').getResult

const router = new Router({
    prefix: '/api/comment'
});

// 添加文章
router.post("/", async (ctx) => {
    ctx.body = (getResult('博客提交成功'))
    await articles.addArticles(ctx.request.body.Ctime, ctx.request.body.Ctext, ctx.request.body.Cpicture, ctx.request.body.Cvideo, ctx.request.body.Caddress);
});

// 删除文章
router.delete("/delete/:id", async (ctx) => {
    ctx.body = (getResult('博客删除成功'))
    // console.log(ctx.request.url.slice(20));
    await articles.deleteArticles(ctx.request.url.slice(20));
});

// 获取文章,默认4条
router.get("/", async (ctx) => { //跳过skip条，需要limit条数据
    // localhost:7001/api/comment?skip=0&limit=5
    // ctx.req.url.slice(18)的例子：20&limit=3

    //正则表达式获取skip的值
    let skip = (ctx.req.url.slice(18) && ctx.req.url.slice(18).match(/\d+/)[0]) || 0; //正则表达式只获取，数字

    //正则表达式获取limit的值
    let limit = (ctx.req.url.slice(18) && ctx.req.url.slice(18).match(/=\d+/)[0]).slice(1) || 4; //正则表达式只获取，=数字，获取到‘=数字’后slice获取从序列1之后的字符串

    const res = await articles.getArticles(skip, limit);
    ctx.body = (getResult(res))
});

module.exports = router.routes();