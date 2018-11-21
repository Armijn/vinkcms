vinkCms.s3 = (function() {
  const APIVERSION = "2006-03-01";
  let s3 = null;
  let dataBucket;
  let siteBucket;

  function init(params) {
    s3 = new AWS.S3({ apiVersion: APIVERSION });
    dataBucket = params.dataBucket;
    siteBucket = params.siteBucket;
  }

  function upload(fileName, body, callback) {
    s3.upload({Key: fileName, Body: body}, function(err, data) {
      if(isError(err)) return;
      callback();
    });
  }

  function list(bucket, callback) {
    let params = { Bucket: bucket };
    params.Delimiter = "/";
    s3.listObjectsV2(params, function(err, data) {
      if(isError(err)) return;
      let list = [];
      data.Contents.forEach(function(element) {
        list.push({
          slug: element.Key,
          url: getUrlFor(bucket, element.Key)
        });
      });
      callback(list);
    });
  }

  function getObject(bucket, key, callback) {
    let params = { Bucket: bucket };
    params.Key = key;
    s3.getObject(params, function(err, data) {
      if(isError(err)) return;
      callback(JSON.parse(data.Body.toString()));
    });
  }

  function getUrlFor(bucket, key) {
    return `http://${bucket}.s3-website.${AWS.config.region}.amazonaws.com/${key}`;
  }

  function isError(err) {
    if(err) {
      alert("error");
      return true;
    }
  }

  function getDataBucket() {
    return dataBucket;
  }

  function getSiteBucket() {
    return siteBucket;
  }

  return {
    init: init,
    upload: upload,
    list: list,
    getObject: getObject,
    getDataBucket: getDataBucket,
    getSiteBucket: getSiteBucket
  };
}());
