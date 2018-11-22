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
    let htmlParams = vinkCms.params.getHtmlParams(data.html);
    let entryParams = vinkCms.params.getDataParams(data.entry);
    key = entryParams.Key;
    metaParams = vinkCms.params.getMetaParams(data.meta);

    callback = cb;
    requestSize = 3;
    currentRequest = 0;

    vinkCms.s3.upload(htmlParams, vinkCms.uploadHandler.onItemUploaded);
    vinkCms.s3.upload(entryParams, vinkCms.uploadHandler.onItemUploaded);
    retrieveMetaJson(metaParams);
  }

  function retrieveMetaJson(params) {
    vinkCms.s3.headObject(vinkCms.s3.getSiteBucket(), METADATAKEY, onHead);
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
    vinkCms.s3.upload(metaParams, vinkCms.uploadHandler.onItemUploaded);
  }

  function updateExisting(data) {
    let itemToUpdate = JSON.parse(metaParams.Body);
    data[metaParams.slug] = itemToUpdate[metaParams.slug];
    metaParams.Body = JSON.stringify(data);
    delete metaParams.slug;
    vinkCms.s3.upload(metaParams, vinkCms.uploadHandler.onItemUploaded);
  }

  function onItemUploaded() {
    currentRequest++;
    if(currentRequest == requestSize) callback(key);
  }

  return {
    upload: upload,
    onItemUploaded: onItemUploaded
  };
}());
