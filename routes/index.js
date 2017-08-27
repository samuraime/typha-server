const Router = require('koa-router');
const koaJwt = require('koa-jwt');
const config = require('../config');
const users = require('../controllers/users');
const albums = require('../controllers/albums');
const photos = require('../controllers/photos');
const tools = require('../controllers/tools');
const APIError = require('../middlewares/api-error');

const jwtMiddleware = koaJwt({
  secret: config.jwtSecret,
  key: 'user',
});
const router = new Router();

// handle all uncaught exceptions
router.use(APIError);

router.get('/sync', tools.sync);

router.post('/login', users.login);

router.use(jwtMiddleware);

router.get('/user', users.find);
router.put('/user', users.update);

router.get('/albums', albums.list);
router.get('/albums/:id', albums.findById);
router.put('/album/starred/:id', albums.star);
router.delete('/album/starred/:id', albums.unstar);

router.get('/photos', photos.list);
router.put('/photo/starred/:id', photos.star);
router.delete('/photo/starred/:id', photos.unstar);
router.put('/photo/views/:id', photos.view);

module.exports = router;
