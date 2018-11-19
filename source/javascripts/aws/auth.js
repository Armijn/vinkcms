vinkCms.auth = (function() {
  function init(params) {
    AWS.config.update({
      region: params.region,
      credentials: new AWS.CognitoIdentityCredentials({
          IdentityPoolId: params.identityPoolId
      })
    });
  }

  return {
    init: init
  };
}());
