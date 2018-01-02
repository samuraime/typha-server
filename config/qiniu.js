module.exports = {
  domain: process.env.QINIU_DOMAIN || '',
  bucket: process.env.QINIU_BUCKET || '',
  accessKey: process.env.QINIU_ACCESS_KEY || '',
  secretKey: process.env.QINIU_SECRET_KEY || '',
};
