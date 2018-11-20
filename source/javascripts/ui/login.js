$(function() {
  if (vinkCms.preferences.get().identityPoolId) login(vinkCms.preferences.get());

  $("#submit").on("click", () => {
    let params = {
      identityPoolId: $("#identityPoolId").val(),
      region: $("#region").val(),
      bucketName: $("#bucketName").val()
    }
    vinkCms.preferences.save(params);
    login(params);
  });
});

function login(params) {
  vinkCms.auth.init(params);
  vinkCms.s3.init(params);
  $(".login").addClass("disabled");
  $(".cms").removeClass("disabled");
  vinkCms.cmsUI.init();
}
