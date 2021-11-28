const Router = require('@koa/router')
const articles = require('../../services/articles')
const getResult = require('../getSendResult').getResult

const router = new Router({
    prefix: '/api/blog'
});

// post
// 添加博客
router.post("/", async (ctx) => {
    ctx.body = (getResult('博客提交成功'))
    await articles.addArticles(ctx.request.body['content'], ctx.request.body['author'], ctx.request.body['title'], ctx.request.body['tags'], ctx.request.body['tagId'], ctx.request.body['userId']);
});

// put
// 修改博客
router.put("/:id", async (ctx) => {
    // ctx.request.url.slice(10) //获取id的方式
    ctx.body = (getResult('博客修改成功'))
    await articles.putArticles(ctx.request.body['content'], ctx.request.body['title'], ctx.request.body['tags'], ctx.request.url.slice(10));
});

// 修改博客阅读量view
router.put("/view/:id", async (ctx) => {
    ctx.body = (getResult('view修改成功'))
    await articles.putArticlesView(ctx.request.body['view'], ctx.request.url.slice(15));
});

// 删除博客
router.put("/delete/:id", async (ctx) => {
    ctx.body = (getResult('博客删除成功'))
    await articles.deleteArticles(ctx.request.url.slice(10));
});

// get
// 获取博客默认4条
router.get("/", async (ctx) => {
    // console.log(ctx.req.url)
    //正则表达式获取skip的值
    let skip = (ctx.req.url.slice(15)&&ctx.req.url.slice(15).match(/\d+/)[0] )|| 0;
    // //正则表达式获取limit的值
    let limit = (ctx.req.url.slice(15)&&ctx.req.url.slice(15).match(/=\d+/)[0]).slice(1) || 4;
    // console.log(skip,limit)
    const res = await articles.getArticles(skip,limit);
    ctx.body = (getResult(res))
});

// 获取热门博客默认5条
router.get("/hot", async (ctx) => {
    //正则表达式获取skip的值
    let skip = (ctx.req.url.slice(15)&&ctx.req.url.slice(15).match(/\d+/)[0] )|| 0;
    // //正则表达式获取limit的值
    let limit = (ctx.req.url.slice(15)&&ctx.req.url.slice(15).match(/=\d+/)[0]).slice(1) || 5;
    // console.log(skip,limit)
    const res = await articles.getArticlesHot(skip,limit);
    ctx.body = (getResult(res))
});

// 获取博客指定id的博客
router.get("/:id", async (ctx) => {
    const res = await articles.getArticleId(ctx.request.url.slice(10));
    ctx.body = (getResult(res))
});

// 获取当前view数据
router.get('/view/:id', async (ctx) => {
    const res = await articles.getArticlesView(ctx.request.url.slice(15));
    ctx.body = (getResult(res))
})

module.exports = router.routes();