vinkCms.spinner = (function() {
  function show(text) {
    $(".spinner label").html(text);
    $(".spinner").addClass("active");
  }

  function hide() {
    $(".spinner").removeClass("active");
  }

  return {
    show: show,
    hide: hide
  };
}());
