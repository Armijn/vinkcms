vinkCms.uploadHandler = (function() {
  const METADATAKEY = ".vinkcms/data.json";
  const HTMLTYPEPARAMS = { ContentType: "text/html; charset=UTF-8" };
  const JSONTYPEPARAMS = { ContentType: "text/json; charset=UTF-8" };
  const PUBLICPARAMS = { ACL: "public-read" };
  const METADATAPARAMS = { Key: METADATAKEY };
  let metaParams;
  let callback;
  let queue;

  function upload(params) {
    let data = params.data
    let htmlParams = vinkCms.params.getHtmlParams(data.html);
    let entryParams = vinkCms.params.getDataParams(data.entry);
    queue = vinkCms.queue();
    metaParams = vinkCms.params.getMetaParams(data.meta);
    callback = params.callback;

    queue.add(vinkCms.s3.upload, htmlParams);
    queue.add(vinkCms.s3.upload, entryParams);
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
    uploadMeta();
  }

  function updateExisting(data) {
    let itemToUpdate = JSON.parse(metaParams.Body);
    data[metaParams.slug] = itemToUpdate[metaParams.slug];
    metaParams.Body = JSON.stringify(data);
    delete metaParams.slug;
    uploadMeta();
  }

  function uploadMeta() {
    queue.add(vinkCms.s3.upload, metaParams);
    queue.go("Uploading...", callback);
  }

  return {
    upload: upload,
    onHead: onHead
  };
}());
