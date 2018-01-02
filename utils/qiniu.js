const qiniu = require('qiniu');
const { accessKey, secretKey, bucket } = require('../config/qiniu');

function QiniuError(error) {
  const message = typeof error === 'string' ? error : error.message;
  return new Error(`Qiniu Error: ${message}`);
}

const promisify = (original, context) => (...args) => new Promise((resolve, reject) => {
  const callback = (err, resBody, resInfo) => {
    if (err) {
      reject(new QiniuError(err.message));
      return;
    }
    if (resInfo.statusCode !== 200) {
      reject(new QiniuError(resInfo.statusCode));
      return;
    }
    resolve(resBody);
  };
  original.call(context, ...args, callback);
});

const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
const config = new qiniu.conf.Config();
// config.useHttpsDomain = true;
config.zone = qiniu.zone.Zone_z0;
const bucketManager = new qiniu.rs.BucketManager(mac, config);

const promisifiedList = promisify(bucketManager.listPrefix, bucketManager);
const promisifiedFetch = promisify(bucketManager.fetch, bucketManager);

/**
 * 列出bucket内资源
 * @param {Object} options 列举操作的可选参数
 * @param {String} options.prefix 列举的文件前缀
 * @param {String} options.marker 上一次列举返回的位置标记，作为本次列举的起点信息
 * @param {Number} options.limit 每次返回的最大列举文件数量
 * @param {String} options.delimiter 指定目录分隔符
 */
const list = async (options = {}) => (
  // 如果这个nextMarker不为空，那么还有未列举完毕的文件列表，下次调用listPrefix的时候，
  // 指定options里面的marker为这个值
  // const nextMarker = respBody.marker;
  // const commonPrefixes = respBody.commonPrefixes;
  // const items = respBody.items;
  // items.forEach(function(item) {
  //   console.log(item.key);
  //   console.log(item.putTime);
  //   console.log(item.hash);
  //   console.log(item.fsize);
  //   console.log(item.mimeType);
  //   console.log(item.endUser);
  //   console.log(item.type);
  // });
  promisifiedList(bucket, options)
);

/**
 * 直接抓取第三方资源至bucket
 * @param {String} url 源地址
 * @param {String} key 结果key
 */
const fetch = async (url, key) => (
  // console.log(respBody.key);
  // console.log(respBody.hash);
  // console.log(respBody.fsize);
  // console.log(respBody.mimeType);
  promisifiedFetch(url, bucket, key)
);

module.exports = {
  list,
  fetch,
};
