const Koa = require('koa');
const body = require('koa-body');
const staticServe = require('koa-static');
const mount = require('koa-mount');
const config = require('./config');
const camelizeQuery = require('./middlewares/camelize-query');
const connect = require('./utils/connect');

// connect to mongodb
connect();

const app = new Koa();

// routes must be place after models
const router = require('./routes');

app.use(camelizeQuery);

app.use(body());

app.use(mount('/static', staticServe(config.staticPath)));

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(config.port);
console.log(`Listening on port ${config.port}`);
