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
    vinkCms.spinner.show("Uploading...");
    s3.upload(params, function(err, data) {
      vinkCms.spinner.hide();
      if(isError(err)) return;
      callback(data);
    });
  }

  function imageUpload(orgParams, callback) {
    vinkCms.spinner.show("Uploading...");
    let params = {
      Bucket: siteBucket,
      ACL: "public-read"
    }
    params = Object.assign(params, orgParams);
    s3.upload(params, function(err, data) {
      vinkCms.spinner.hide();
      if(isError(err)) return;
      callback(data);
    });
  }

  function list(dir, bucket, callback) {
    vinkCms.spinner.show("Loading...");
    let params = { Bucket: bucket };
    params.Delimiter = "/";
    params.Prefix = dir;
    s3.listObjectsV2(params, function(err, data) {
      vinkCms.spinner.hide();
      if(isError(err)) return;
      let list = [];
      data.Contents.forEach(function(element) {
        list.push({
          Key: element.Key,
          Location: getUrlFor(element.Key)
        });
      });
      callback(list);
    });
  }

  function headObject(bucket, key, callback) {
    vinkCms.spinner.show("Loading...");
    let params = { Bucket: bucket, Key: key };
    s3.headObject(params, function(err, data) {
      vinkCms.spinner.hide();
      callback(err, data);
    });
  }

  function getObject(bucket, key, callback) {
    vinkCms.spinner.show("Loading...");
    let params = { Bucket: bucket };
    params.Key = key;
    s3.getObject(params, function(err, data) {
      vinkCms.spinner.hide();
      if(isError(err)) return;
      callback(JSON.parse(data.Body.toString()));
    });
  }

  function deleteObject(p, callback) {
    vinkCms.spinner.show("Deleting...");
    let params = {
      Bucket: p.Bucket,
      Delete: { Objects: [{ Key: p.Key }] }
    };
    s3.deleteObjects(params, function(err, data) {
      vinkCms.spinner.hide();
      if(isError(err)) return;
      callback(data);
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
    imageUpload: imageUpload,
    list: list,
    getObject: getObject,
    headObject: headObject,
    deleteObject: deleteObject,
    getDataBucket: getDataBucket,
    getSiteBucket: getSiteBucket,
    getUrlFor: getUrlFor
  };
}());
