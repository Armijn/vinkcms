vinkCms.deleteHandler = (function() {
  let key;
  let callback;
  let metaParams;

  function deleteObject(params) {
    callback = params.callback;
    key = params.key;

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

    vinkCms.queue.add(vinkCms.s3.deleteObject, htmlParams);
    vinkCms.queue.add(vinkCms.s3.deleteObject, entryParams);
    vinkCms.s3.getObject(metaParams.Bucket, metaParams.Key, onJsonRecieve);
  }

  function onJsonRecieve(data) {
    delete data[key];
    metaParams.Body = JSON.stringify(data);
    vinkCms.queue.add(vinkCms.s3.upload, metaParams);
    vinkCms.queue.go(callback);
  }

  return {
    deleteObject: deleteObject
  };
}());
