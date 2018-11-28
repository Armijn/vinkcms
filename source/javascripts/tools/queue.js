vinkCms.queue = (function() {
  let queue = [];
  let callback;
  function add(toExecFunc, params) {
    queue.push({func: toExecFunc, params: params});
  }

  function go(finalCallback) {
    callback = finalCallback;
    console.log(queue.pop());
  }

  return {
    add: add,
    go: go
  };
}());
