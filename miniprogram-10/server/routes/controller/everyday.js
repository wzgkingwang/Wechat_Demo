const Router = require('@koa/router')
const every = require('../../services/everydaysentences')
const getResult=require('../getSendResult').getResult

const router = new Router({
  prefix:'/api/everyday'
});

// 添加每日一句
router.post("/", async (ctx) => {
  // body的数据会保存在res.data上
  ctx.body=(getResult('提交成功'))
  // axios的post获取的参数
  // console.log(ctx.request.body)
  await every.addEverySentences(ctx.request.body['content'],ctx.request.body['author']);
});

// 获取每日一句5条
router.get("/", async (ctx) => {
  const res = await every.getEverySentences();
  ctx.body=(getResult(res))
});

module.exports = router.routes();