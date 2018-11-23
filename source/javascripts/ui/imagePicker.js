vinkCms.imagePicker = (function() {
  function open(callback) {
    $(".js-image-picker").addClass("active");
    $(".image-picker").empty();
    $(".image-upload").on("change", function() {
      onImageSelected($(this));
    });

    $(".js-close-image-picker").on("click", function() {
      close();
    });

    $(".js-select-image").on("click", function() {
      let url = $(".image-picker option:selected").text();
      let fileName = $(".image-picker").val().replace("images/", "");
      close();
      callback(fileName, url);
    });

    $(".js-delete-image").on("click", function() {
      let params = {
        Bucket: vinkCms.s3.getSiteBucket(),
        Key: $(".image-picker").val()
      }
      vinkCms.s3.deleteObject(params, onDelete);
    });

    vinkCms.s3.list("images/", vinkCms.s3.getSiteBucket(), onImagesRecieved);
  }

  function onDelete(data) {
    $(`.js-image-picker option[value="${data.Deleted[0].Key}"]`).remove();
    $(".image-picker").imagepicker();
  }

  function close() {
    $(".js-image-picker").removeClass("active");
  }

  function onImagesRecieved(data) {
    let imagePicker = $(".image-picker");
    data.forEach(function(element) {
      addNewItem(imagePicker, element.slug, element.url);
    });
    $(".image-picker").imagepicker();
  }

  function addNewItem(container, name, url) {
    container.append(`<option data-img-src="${url}" value="${name}">${url}</option>`);
  }

  function onImageSelected(element) {
    if(file === undefined) return;
    let file = element[0].files[0];
    let params = {
      Key: `images/${file.name.replace(/\s|\\|\/|\(|\)/g,'-')}`,
      Body: file,
      ContentType: file.type
    }
    vinkCms.s3.imageUpload(params, onImageUploaded);
  }

  function onImageUploaded(data) {
    let imagePicker = $(".image-picker");
    let fileName = data.Key.replace("images/", "");
    let url = data.Location;
    addNewItem(imagePicker, fileName, url);
    imagePicker.imagepicker();
    $(".thumbnails li img").last().trigger("click");
    $(".image-container").scrollTop($(".image-container").prop("scrollHeight"));
  }

  return {
    open: open
  };
}());
