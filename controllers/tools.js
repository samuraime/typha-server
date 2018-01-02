const http = require('http');
const mongoose = require('mongoose');
const lodash = require('lodash');
const qiniu = require('../utils/qiniu');
const config = require('../config/qiniu');

const Album = mongoose.model('Album');
const Photo = mongoose.model('Photo');

const sync = async (ctx) => {
  if (ctx.query.pwd !== 'uuddlrlrba') {
    ctx.throw(401);
  }

  await Promise.all(Array(1000).fill(0).map(async (_, i) => {
    const index = 2000 + i;
    const { items } = await qiniu.list({ prefix: index });
    const photos = await Promise.all(items.map(item => Photo.create({ url: `${config.domain}/${item.key}` })));
    await Album.create({ description: index, photos, cover: photos[0] ? photos[0].url : '' });
  }));

  ctx.body = 'done';
};

const getURL = (id, index) => `/pic/${id}/${index}.jpg`;

const exists = url => new Promise(async (resolve) => {
  http.get(url, (res) => {
    if (res.statusCode !== 200) {
      res.destroy();
      resolve(false);
    } else {
      resolve(true);
    }
  });
});

const getRange = async (albumIndex) => {
  let end = 1;
  let shouldContinue = true;
  while (shouldContinue) {
    const isExists = await exists(getURL(albumIndex, end)); // eslint-disable-line
    end += 1;
    if (!isExists) {
      shouldContinue = false;
    }
  }
  return lodash.range(1, end);
};

/**
 * @deprecated
 */
const update = async (ctx) => {
  const lastestAlbum = await Album.findOne()
    .sort({ description: -1 })
    .limit(1);

  const albumIndex = +lastestAlbum.description + 1;
  const range = await getRange(albumIndex);
  if (range.length < 5) {
    ctx.body = 'no more';
    return;
  }
  const fetchedPhotos = await Promise.all(range.map(index => (
    qiniu.fetch(getURL(albumIndex, index))
  )));
  const photos = await Promise.all(fetchedPhotos.map(item => Photo.create({ url: `${config.domain}/${item.key}` })));
  const album = await Album.create({ description: albumIndex, photos, cover: photos[0] ? photos[0].url : '' });

  ctx.body = album;
};

module.exports = {
  sync,
  update,
};
