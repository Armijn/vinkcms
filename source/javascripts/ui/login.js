$(function() {
  if (vinkCms.preferences.get().identityPoolId) login(vinkCms.preferences.get());

  $("#submit").on("click", () => {
    let params = {
      identityPoolId: $("#identityPoolId").val(),
      region: $("#region").val(),
      dataBucket: $("#dataBucket").val(),
      siteBucket: $("#siteBucket").val()
    }
    if($("#remember").is(":checked")) vinkCms.preferences.save(params);
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
