vinkCms.renameHandler = (function() {
  let callback;
  let requestSize;
  let currentRequest;
  let key;
  let oldKey;

  function rename(oldSlug, data, cb) {
    callback = cb;
    requestSize = 2;
    currentRequest = 0;
    key = data.entry.Key;
    oldKey = oldSlug;
    vinkCms.uploadHandler.upload({data: data, callback: vinkCms.renameHandler.onItemUploaded});
  }

  function onItemUploaded() {
    vinkCms.deleteHandler.deleteObject({key: oldKey, callback: vinkCms.renameHandler.onDeleteObject});
  }

  function onDeleteObject(data) {
    callback({Key: key});
  }

  return {
    rename: rename,
    onItemUploaded: onItemUploaded,
    onDeleteObject: onDeleteObject
  };
}());
