const qiniu = require('qiniu');

const accessKey = 'yTXU8GEW2t1nXqNwr6nm6PkqlhDeKZtDBx8hIs46';
const secretKey = 'VQ2teEPE7yLE-3xZa7lu4MpppyU2ChmWhC80rxmM';
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
const config = new qiniu.conf.Config();
// config.useHttpsDomain = true;
config.zone = qiniu.zone.Zone_z0;
const bucketManager = new qiniu.rs.BucketManager(mac, config);

const bucket = 'poppy';
// @param options 列举操作的可选参数
//                prefix    列举的文件前缀
//                marker    上一次列举返回的位置标记，作为本次列举的起点信息
//                limit     每次返回的最大列举文件数量
//                delimiter 指定目录分隔符

const list = (options = {}) => new Promise((resolve, reject) => {
  // const options = {
  //   limit: 1000,
  //   prefix: 'calculus',
  // };
  bucketManager.listPrefix(bucket, options, (err, respBody, respInfo) => {
    if (err) {
      reject(err);
      return;
    }

    if (respInfo.statusCode === 200) {
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
      resolve(respBody.items);
    } else {
      reject(respBody);
    }
  });
});

module.exports = list;
