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

  function upload(params, callback) {
    s3.upload(params, function(err, data) {
      if(isError(err)) return;
      callback(data);
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

  function headObject(bucket, key, callback) {
    let params = { Bucket: bucket, Key: key };
    s3.headObject(params, function(err, data) {
      callback(err, data);
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

  function deleteObject(p, callback) {
    let params = {
      Bucket: p.Bucket,
      Delete: { Objects: [{ Key: p.Key }] }
    };
    s3.deleteObjects(params, function(err, data) {
      if(isError(err)) return;
      callback();
    });
  }

  function getUrlFor(key) {
    return `http://${siteBucket}.s3-website.${AWS.config.region}.amazonaws.com/${key}`;
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
    upload: upload,
    list: list,
    getObject: getObject,
    headObject: headObject,
    deleteObject: deleteObject,
    getDataBucket: getDataBucket,
    getSiteBucket: getSiteBucket,
    getUrlFor: getUrlFor
  };
}());
