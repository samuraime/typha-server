const mongoose = require('mongoose');

const Album = mongoose.model('Album');
const User = mongoose.model('User');

const list = async (ctx) => {
  const { page, perPage } = ctx.query;
  const [albums, user] = await Promise.all([
    Album.list({ page: +page, perPage: +perPage }),
    User.findById(ctx.state.user.id, { albums: true }),
  ]);
  ctx.body = albums.map(album => Object.assign({}, album._doc, {
    starred: user.albums.indexOf(album._id) !== -1,
  }));
};

const findById = async (ctx) => {
  const { id } = ctx.params;
  const collection = await Album.findByIdAndUpdate(id, {
    $inc: {
      views: 1,
    },
  }).populate('photos', {
    title: true,
    url: true,
    views: true,
    stars: true,
  });
  ctx.body = collection;
};

const star = async (ctx) => {
  const { id } = ctx.params;
  const [album] = await Promise.all([
    Album.findByIdAndUpdate(id, {
      $inc: {
        stars: 1,
      },
    }, {
      new: true,
      select: {
        stars: true,
      },
    }),
    User.findByIdAndUpdate(ctx.state.user.id, {
      $addToSet: {
        albums: mongoose.Types.ObjectId(id),
      },
    }),
  ]);
  ctx.body = {
    stars: album.stars,
    starred: true,
  };
};

const unstar = async (ctx) => {
  const { id } = ctx.params;
  const [album] = await Promise.all([
    Album.findByIdAndUpdate(id, {
      $inc: {
        stars: -1,
      },
    }, {
      new: true,
      select: {
        stars: true,
      },
    }),
    User.findByIdAndUpdate(ctx.state.user.id, {
      $pull: {
        albums: mongoose.Types.ObjectId(id),
      },
    }),
  ]);
  ctx.body = {
    stars: album.stars,
    starred: false,
  };
};

module.exports = {
  list,
  findById,
  star,
  unstar,
};
