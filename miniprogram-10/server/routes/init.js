const cors = require("cors");
const koa = require('koa')
const c2k = require("koa-connect")
const bodyParser=require('koa-bodyparser')

const app = new koa();

// cors
app.use(c2k(cors()));

// 前端axios的post数据解析(将json数据转化)
app.use(bodyParser())

// 加入cookie-parser 中间件
// 加入之后，会在req对象中注入cookies属性，用于获取所有请求传递过来的cookie
// 加入之后，会在res对象中注入cookie方法，用于设置cookie
// const cookieParser = require("cookie-parser");
// app.use(cookieParser());

// 应用token中间件，token解析
// app.use(require("./tokenMiddleware"));


// 处理 api 的请求
app.use(require("./controller/everyday"));
app.use(require('./controller/tags'))
app.use(require('./controller/articles'))

const port = 7001;
app.listen(port, () => {
  console.log(`server listen on ${port}`);
});
