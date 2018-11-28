vinkCms.renameHandler = (function() {
  function rename(oldKey, data, callback) {
    let queue = vinkCms.queue();
    queue.add(vinkCms.uploadHandler.upload, {data: data, callback: vinkCms.renameHandler.onItemUploaded});
    queue.add(vinkCms.deleteHandler.deleteObject, {key: oldKey, callback: vinkCms.renameHandler.onDeleteObject});
    queue.go("Renaming...", callback);
  }

  return {
    rename: rename
  };
}());
