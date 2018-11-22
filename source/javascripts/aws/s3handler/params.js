vinkCms.params = (function() {
  const METADATAKEY = ".vinkcms/data.json";
  const HTMLTYPEPARAMS = { ContentType: "text/html; charset=UTF-8" };
  const JSONTYPEPARAMS = { ContentType: "text/json; charset=UTF-8" };
  const PUBLICPARAMS = { ACL: "public-read" };
  const METADATAPARAMS = { Key: METADATAKEY };

  function getHtmlParams(params) {
    return Object.assign(
      params,
      { Bucket: vinkCms.s3.getSiteBucket() },
      HTMLTYPEPARAMS,
      PUBLICPARAMS
    );
  }

  function getDataParams(params) {
    return Object.assign(
      params,
      { Bucket: vinkCms.s3.getDataBucket() },
      HTMLTYPEPARAMS
    );
  }

  function getMetaParams(params) {
    return Object.assign(
      params,
      { Bucket: vinkCms.s3.getSiteBucket() },
      JSONTYPEPARAMS,
      PUBLICPARAMS,
      METADATAPARAMS
    );
  }

  return {
    getHtmlParams: getHtmlParams,
    getDataParams: getDataParams,
    getMetaParams: getMetaParams
  };
}());
