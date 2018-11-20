$(function() {
  $("#upload").on("click", () => {
    vinkCms.s3.upload("test", "test", callback);
  });
});


function callback(err, data) {
  if(err) {
    console.log(err);
  } else {
    console.log(data);
  }
}
