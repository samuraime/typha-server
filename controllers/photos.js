const mongoose = require('mongoose');

const Photo = mongoose.model('Photo');
const User = mongoose.model('User');

const list = async (ctx) => {
  const { page } = ctx.params;
  const photos = await Photo.list({ page });
  ctx.body = photos;
};

const star = async (ctx) => {
  const { id } = ctx.params;
  const [album] = await Promise.all([
    Photo.findByIdAndUpdate(id, {
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
        photos: mongoose.Types.ObjectId(id),
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
    Photo.findByIdAndUpdate(id, {
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
        photos: mongoose.Types.ObjectId(id),
      },
    }),
  ]);
  ctx.body = {
    stars: album.stars,
    starred: false,
  };
};

const view = async (ctx) => {
  await Photo.findByIdAndUpdate(ctx.state.user.id, {
    $inc: {
      views: 1,
    },
  });
  ctx.status = 204;
};

module.exports = {
  list,
  star,
  unstar,
  view,
};
