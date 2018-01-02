const mongoose = require('mongoose');

const { Schema } = mongoose;

const Album = new Schema({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  cover: String,
  photos: [{ type: Schema.Types.ObjectId, ref: 'Photo' }],
  tags: [String],
  views: { type: Number, default: 0 },
  stars: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

Album.statics = {
  list(options = {}) {
    const criteria = options.criteria || {};
    const page = options.page || 0;
    const perPage = options.perPage || 10;
    return this.find(criteria)
      .populate('photos')
      .sort({ stars: -1, views: -1, createdAt: -1 })
      .limit(perPage)
      .skip(perPage * page)
      .exec();
  },
};

mongoose.model('Album', Album);
