vinkCms.preferences = (function() {
  let params = {};
  init();

  function init() {
    params = {
      identityPoolId: localStorage.getItem("identityPoolId"),
      region: localStorage.getItem("region"),
      bucketName: localStorage.getItem("bucketName")
    }
  }

  function get() {
    return params;
  }

  function save(params) {
    localStorage.setItem("identityPoolId", params.identityPoolId);
    localStorage.setItem("region", params.region);
    localStorage.setItem("bucketName", params.bucketName);
  }

  return {
    get: get,
    save: save
  };
}());
