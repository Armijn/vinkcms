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

    let htmlParams = vinkCms.params.getHtmlParams(
      vinkCms.params.getDeleteParams([key]),
      vinkCms.deleteHandler.onItemUploaded
    );
    let entryParams = vinkCms.params.getDataParams(
      vinkCms.params.getDeleteParams([key]),
      vinkCms.deleteHandler.onItemUploaded
    );
    metaParams = vinkCms.params.getMetaParams(
      {},
      vinkCms.deleteHandler.onItemUploaded
    );

    vinkCms.s3.deleteObject(htmlParams);
    vinkCms.s3.deleteObject(entryParams);
    vinkCms.s3.getObject(metaParams.Bucket, metaParams.Key, onJsonRecieve);
  }

  function onJsonRecieve(data) {
    delete data[slug];
    metaParams.Body = JSON.stringify(data);
    vinkCms.s3.upload(metaParams);
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
