vinkCms.s3 = (function() {
  const APIVERSION = "2006-03-01";
  let s3 = null;

  function init(params) {
    s3 = new AWS.S3({
      apiVersion: APIVERSION,
      params: {
        Bucket: params.bucketName
      }
    });
  }

  function upload(fileName, body, callback) {
    s3.upload({Key: fileName, Body: body}, function(err, data) {
      if(isError(err)) return;
      callback();
    });
  }

  function list(callback) {
    let params = s3.config.params;
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

  function getObject(key, callback) {
    let params = { Bucket: s3.config.params.Bucket };
    params.Key = key;
    s3.getObject(params, function(err, data) {
      if(isError(err)) return;
      callback(JSON.parse(data.Body.toString()));
    });
  }

  function getUrlFor(key) {
    return `http://${s3.config.params.Bucket}.s3-website.${AWS.config.region}.amazonaws.com/${key}`;
  }

  function isError(err) {
    if(err) {
      alert("error");
      return true;
    }
  }

  return {
    init: init,
    upload: upload,
    list: list,
    getObject: getObject
  };
}());
