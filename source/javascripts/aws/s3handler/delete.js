vinkCms.deleteHandler = (function() {
  let slug;
  let callback;
  let requestSize;
  let currentRequest;
  let metaParams;

  function deleteObject(key, cb) {
    callback = cb;
    slug = key;
    requestSize = 3;
    currentRequest = 0;

    let htmlParams = vinkCms.params.getHtmlParams({Key: key});
    let entryParams = vinkCms.params.getDataParams({Key: key});
    metaParams = vinkCms.params.getMetaParams({});

    vinkCms.s3.deleteObject(htmlParams, vinkCms.deleteHandler.onItemUploaded);
    vinkCms.s3.deleteObject(entryParams, vinkCms.deleteHandler.onItemUploaded);

    vinkCms.s3.getObject(metaParams.Bucket, metaParams.Key, onJsonRecieve);
  }

  function onJsonRecieve(data) {
    delete data[slug];
    metaParams.Body = JSON.stringify(data);
    vinkCms.s3.upload(metaParams, vinkCms.deleteHandler.onItemUploaded);
  }

  function onItemUploaded() {
    currentRequest++;
    if(currentRequest == requestSize) callback();
  }

  return {
    deleteObject: deleteObject,
    onItemUploaded: onItemUploaded
  };
}());
