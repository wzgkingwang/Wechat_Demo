const Router = require('@koa/router')
const tags = require('../../services/tags')
const getResult=require('../getSendResult').getResult

const router = new Router({
  prefix:'/api/tags'
});

// 添加标签
router.post("/", async (ctx) => {
  ctx.body=(getResult('提交成功'))
  await tags.addtags(ctx.request.body.tag);
});

// 获取标签30条
router.get("/", async (ctx) => {
  const res = await tags.gettags();
  ctx.body=(getResult(res))
});

module.exports = router.routes();