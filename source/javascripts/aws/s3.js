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

  function siteUpload(fileName, body, callback) {
    let params = {
      Bucket: siteBucket,
      ACL: "public-read",
      ContentType: "text/html; charset=UTF-8",
    };
    upload(params, fileName, body, callback);
  }

  function dataUpload(fileName, body, callback) {
    let params = { Bucket: dataBucket };
    upload(params, fileName, body, callback);
  }

  function upload(params, fileName, body, callback) {
    let defaultParams = { Key: fileName, Body: body };
    let mergedParams = Object.assign(defaultParams, params);
    s3.upload(mergedParams, function(err, data) {
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
          url: getUrlFor(element.Key)
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

  function getUrlFor(key) {
    return `http://${siteBucket}.s3-website.${AWS.config.region}.amazonaws.com/${key}.html`;
  }

  function isError(err) {
    if(err) {
      alert(err);
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
    siteUpload: siteUpload,
    dataUpload: dataUpload,
    list: list,
    getObject: getObject,
    getDataBucket: getDataBucket,
    getSiteBucket: getSiteBucket,
    getUrlFor: getUrlFor
  };
}());
