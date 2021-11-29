const cors = require("cors");
const koa = require('koa')
const c2k = require("koa-connect")
const bodyParser = require('koa-bodyparser')

const app = new koa();

// cors,处理跨域问题，如果没解决在使用http-proxy-middleware
app.use(c2k(cors()));

// 前端axios的post数据解析(将json数据转化)
app.use(bodyParser())

// 处理 api 的请求
app.use(require("./controller/articles"));

const port = 7001;
app.listen(port, () => {
  console.log(`server listen on ${port}`);
});