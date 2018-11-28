vinkCms.uploadHandler = (function() {
  const METADATAKEY = ".vinkcms/data.json";
  const HTMLTYPEPARAMS = { ContentType: "text/html; charset=UTF-8" };
  const JSONTYPEPARAMS = { ContentType: "text/json; charset=UTF-8" };
  const PUBLICPARAMS = { ACL: "public-read" };
  const METADATAPARAMS = { Key: METADATAKEY };

  let callback;
  let requestSize;
  let currentRequest;
  let metaParams;
  let key;

  function upload(data, cb) {
    let htmlParams = vinkCms.params.getHtmlParams(data.html, vinkCms.uploadHandler.onItemUploaded);
    let entryParams = vinkCms.params.getDataParams(data.entry, vinkCms.uploadHandler.onItemUploaded);
    metaParams = vinkCms.params.getMetaParams(data.meta, vinkCms.uploadHandler.onItemUploaded);
    key = entryParams.Key;

    callback = cb;
    requestSize = 3;
    currentRequest = 0;

    vinkCms.s3.upload(htmlParams);
    vinkCms.s3.upload(entryParams);
    vinkCms.s3.headObject(vinkCms.s3.getSiteBucket(), METADATAKEY, vinkCms.uploadHandler.onHead);
  }

  function onHead(err, data) {
    if (err && err.code === "NotFound") {
      createNewMetaObject();
    } else {
      vinkCms.s3.getObject(vinkCms.s3.getSiteBucket(), METADATAKEY, updateExisting);
    }
  }

  function createNewMetaObject() {
    delete metaParams.slug;
    vinkCms.s3.upload(metaParams);
  }

  function updateExisting(data) {
    let itemToUpdate = JSON.parse(metaParams.Body);
    data[metaParams.slug] = itemToUpdate[metaParams.slug];
    metaParams.Body = JSON.stringify(data);
    delete metaParams.slug;
    vinkCms.s3.upload(metaParams);
  }

  function onItemUploaded() {
    currentRequest++;
    if(currentRequest == requestSize) callback(key);
  }

  return {
    upload: upload,
    onItemUploaded: onItemUploaded,
    onHead: onHead
  };
}());
