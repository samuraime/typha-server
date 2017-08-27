const mongoose = require('mongoose');

const { Schema } = mongoose;

const Photo = new Schema({
  title: { type: String, default: '' },
  url: String,
  views: { type: Number, default: 0 },
  stars: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

Photo.statics = {
  list(options = {}) {
    const criteria = options.criteria || {};
    const page = options.page || 0;
    const perPage = options.perPage || 10;
    return this.find(criteria)
      .sort({ createdAt: -1 })
      .limit(perPage)
      .skip(perPage * page)
      .exec();
  },
};

mongoose.model('Photo', Photo);
