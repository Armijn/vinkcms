$(function() {
  $("#identityPoolId").val(vinkCms.preferences.get().identityPoolId);
  $("#region").val(vinkCms.preferences.get().region);
  $("#bucketName").val(vinkCms.preferences.get().bucketName);

  $("#submit").on("click", () => {
    let params = {
      identityPoolId: $("#identityPoolId").val(),
      region: $("#region").val(),
      bucketName: $("#bucketName").val()
    }
    login(params);
  });
});

function login(params) {
  vinkCms.auth.init(params);
  vinkCms.s3.init(params);
  vinkCms.preferences.save(params);
  $(".login").addClass("disabled");
  $(".cms").removeClass("disabled");
}
