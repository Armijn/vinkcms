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
      if(err) {
        callback(err);
      } else {
        callback(null, data);
      }
    });
  }

  return {
    init: init,
    upload: upload
  };
}());
