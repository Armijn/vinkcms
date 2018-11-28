vinkCms.params = (function() {
  const METADATAKEY = ".vinkcms/data.json";
  const HTMLTYPEPARAMS = { ContentType: "text/html; charset=UTF-8" };
  const JSONTYPEPARAMS = { ContentType: "text/json; charset=UTF-8" };
  const PUBLICPARAMS = { ACL: "public-read" };
  const METADATAPARAMS = { Key: METADATAKEY };

  function getHtmlParams(params, callback) {
    return Object.assign(
      params,
      { callback: callback },
      { Bucket: vinkCms.s3.getSiteBucket() },
      HTMLTYPEPARAMS,
      PUBLICPARAMS
    );
  }

  function getDataParams(params, callback) {
    return Object.assign(
      params,
      { callback: callback },
      { Bucket: vinkCms.s3.getDataBucket() },
      HTMLTYPEPARAMS
    );
  }

  function getMetaParams(params, callback) {
    return Object.assign(
      params,
      { callback: callback },
      { Bucket: vinkCms.s3.getSiteBucket() },
      JSONTYPEPARAMS,
      PUBLICPARAMS,
      METADATAPARAMS
    );
  }

  function getDeleteParams(keys) {
    let objects = [];
    keys.forEach(function(key) {
      objects.push({Key: key});
    });
    return { Delete: { Objects: objects } };
  }

  return {
    getHtmlParams: getHtmlParams,
    getDataParams: getDataParams,
    getMetaParams: getMetaParams,
    getDeleteParams: getDeleteParams
  };
}());
