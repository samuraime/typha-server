const querystring = require('querystring');
const mongoose = require('mongoose');
const fetch = require('isomorphic-fetch');
const jwt = require('jsonwebtoken');
const config = require('../config');

const User = mongoose.model('User');

const login = async (ctx) => {
  const { code } = ctx.request.body;
  const params = {
    appid: config.appId,
    secret: config.appSecret,
    js_code: code,
    grant_type: 'authorization_code',
  };
  const response = await fetch(`https://api.weixin.qq.com/sns/jscode2session?${querystring.stringify(params)}`);
  const res = await response.json();
  // { session_key, expires_in, openid }
  let user = await User.findOne({ openid: res.openid });
  if (!user) {
    user = await User.create({ openid: res.openid });
  }
  const token = jwt.sign({
    id: user._id,
  }, config.jwtSecret, {
    expiresIn: 86400 * 30,
  });
  ctx.body = { token };
};

const find = async (ctx) => {
  const user = await User.findById(ctx.state.user.id, {
    albums: {
      $slice: -5,
    },
    photos: {
      $slice: -5,
    },
  }).populate({
    path: 'albums photos',
    select: {
      photos: false,
    },
  });
  ctx.body = user;
};

const update = async (ctx) => {
  const user = await User.findByIdAndUpdate(ctx.state.user.id, ctx.request.body, {
    new: true,
    select: {
      albums: {
        $slice: -5,
      },
      photos: {
        $slice: -5,
      },
    },
  }).populate({
    path: 'albums photos',
    select: {
      photos: false,
    },
  });
  ctx.body = user;
};

const getStarAlbums = async (ctx) => {
  const { albums } = await User.findById(ctx.state.user.id, { albums: true }).populate('albums');
  ctx.body = albums;
};

const getStarPhotos = async (ctx) => {
  const { photos } = await User.findById(ctx.state.user.id, { photos: true }).populate('photos');
  ctx.body = photos;
};

module.exports = {
  login,
  find,
  update,
  getStarAlbums,
  getStarPhotos,
};
