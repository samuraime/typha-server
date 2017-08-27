const fs = require('fs');
const { join } = require('path');
const Koa = require('koa');
const mongoose = require('mongoose');
const body = require('koa-body');
const staticServe = require('koa-static');
const mount = require('koa-mount');
const config = require('./config');
const camelizeQuery = require('./middlewares/camelize-query');

const app = new Koa();

// load all models
mongoose.Promise = global.Promise;
const models = join(__dirname, 'models');
fs.readdirSync(models)
  .filter(file => ~file.search(/^[^.].*\.js$/)) // eslint-disable-line
  .forEach((file) => {
    require(join(models, file)); // eslint-disable-line
  });

// routes must be place after models
const router = require('./routes');

app.use(camelizeQuery);

app.use(body());

app.use(mount('/static', staticServe(config.staticPath)));

app.use(router.routes());
app.use(router.allowedMethods());

mongoose.connect(config.db, {
  useMongoClient: true,
  socketTimeoutMS: 0,
  keepAlive: true,
  reconnectTries: 30,
})
  .then(() => {
    app.listen(config.port);
    console.log(`Listening on port ${config.port}`);
  })
  .catch(console.log);
