vinkCms.preferences = (function() {
  let params = {};
  init();

  function init() {
    params = {
      identityPoolId: localStorage.getItem("identityPoolId"),
      region: localStorage.getItem("region"),
      siteBucket: localStorage.getItem("siteBucket"),
      dataBucket: localStorage.getItem("dataBucket")
    }
  }

  function get() {
    return params;
  }

  function save(params) {
    localStorage.setItem("identityPoolId", params.identityPoolId);
    localStorage.setItem("region", params.region);
    localStorage.setItem("siteBucket", params.siteBucket);
    localStorage.setItem("dataBucket", params.dataBucket);
  }

  function destroy() {
    localStorage.removeItem("identityPoolId");
    localStorage.removeItem("region");
    localStorage.removeItem("siteBucket");
    localStorage.removeItem("dataBucket");
    localStorage.removeItem("bucketName");
  }

  return {
    get: get,
    save: save,
    destroy: destroy
  };
}());
