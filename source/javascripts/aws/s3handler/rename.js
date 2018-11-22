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
    vinkCms.uploadHandler.upload(data, vinkCms.renameHandler.onItemUploaded);
  }

  function onItemUploaded() {
    vinkCms.deleteHandler.deleteObject(oldKey, vinkCms.renameHandler.onDeleteObject);
  }

  function onDeleteObject() {
    callback(key);
  }

  return {
    rename: rename,
    onItemUploaded: onItemUploaded,
    onDeleteObject: onDeleteObject
  };
}());
