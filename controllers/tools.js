const mongoose = require('mongoose');
const list = require('../utils/list');

const Album = mongoose.model('Album');
const Photo = mongoose.model('Photo');

const sync = async (ctx) => {
  if (ctx.query.pwd !== 'uuddlrlrba') {
    ctx.throw(401);
  }

  // const prefix = 'http://osrpgr4dd.bkt.clouddn.com';
  // typha-img.samuraime.com
  const CDN = 'http://typha-img.samuraime.com';
  await Promise.all(Array(1000).fill(0).map(async (_, i) => {
    const items = await list({ prefix: 2000 + i });
    const photos = await Promise.all(items.map(item => Photo.create({ url: `${CDN}/${item.key}` })));
    await Album.create({ description: i, photos, cover: `${CDN}/${photos[0].url}` });
  }));

  ctx.body = 'done';
};

module.exports = {
  sync,
};
