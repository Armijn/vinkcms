$(function() {
  $(".js-logout").on("click", () => {
    vinkCms.preferences.destroy();
    location.reload();
  });
});
