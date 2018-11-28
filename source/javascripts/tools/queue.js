vinkCms.queue = (function() {
  let queue = [];
  let callback;
  function add(toExecFunc, params) {
    params.callback = doNext;
    queue.push({func: toExecFunc, params: params});
  }

  function go(finalCallback) {
    callback = finalCallback;
    doNext();
  }

  function doNext(data) {
    if(queue.length == 0) return callback(data);
    let item = queue.pop();
    item.func(item.params);
  }

  return {
    add: add,
    go: go
  };
}());
