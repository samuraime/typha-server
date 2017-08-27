const mongoose = require('mongoose');

const { Schema } = mongoose;

const User = new Schema({
  openid: String, // wechat openid
  nickName: { type: String, default: '' },
  avatarUrl: { type: String, default: '' },
  gender: { type: Number, default: 0 }, // 0：未知、1：男、2：女
  province: { type: String, default: '' },
  city: { type: String, default: '' },
  country: { type: String, default: '' },
  albums: [{ type: Schema.Types.ObjectId, ref: 'Album', starredAt: Date }],
  photos: [{ type: Schema.Types.ObjectId, ref: 'Photo', starredAt: Date }],
  createdAt: { type: Date, default: Date.now },
});

mongoose.model('User', User);
