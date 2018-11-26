vinkCms.imagePicker = (function() {
  let imgParams;
  let images;
  function open(callback, params) {
    imgParams = params;
    images = {};
    $(".js-image-picker").addClass("active");
    $(".image-picker").empty();
    $(".image-upload").on("change", function() {
      onImageSelected($(this));
    });

    $(".js-close-image-picker").on("click", function() {
      close();
    });

    $(".js-select-image").on("click", function() {
      let url = images[$(".image-picker").val()].getUrl();
      close();
      callback(url);
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

  function close() {
    $(".js-image-picker").removeClass("active");
  }

  function onImagesRecieved(data) {
    data.forEach(function(element) {
      addItem(element);
    });
    reloadImagePicker();
  }

  function addItem(element) {
    let extension = element.Key.split(".").pop();
    let test = element.Key.replace(`.${element.Key.split(".").pop()}`, "");
    let id = element.Key.split(".")[0];
    let imageSize = test.split(".").pop();
    images[id] = images[id] || {
      id: id,
      srcset: [],
      thumb: vinkCms.s3.getUrlFor(`${id}.thumb.${extension}`),
      getUrl: function functionName() {
        if(!imgParams) {
          return `/${this.id}.${extension}`;
        } else {
          return `/${this.id}.${this.srcset.join(".")}.${extension}`;
        }
      },
      getOption: function() {
        return `<option data-img-src="${this.thumb}" value="${this.id}">${this.id}</option>`;
      }
    };
    if(!imgParams) imageSize = null;
    if(imageSize !== "thumb" && imageSize != null) images[id].srcset.push(imageSize);
  }

  function reloadImagePicker() {
    let imagePicker = $(".image-picker").empty();
    Object.values(images).forEach(function(element) {
      if(shouldBeVisible(element)) {
        imagePicker.append(element.getOption());
      }
    });
    imagePicker.imagepicker();
  }

  function shouldBeVisible(element) {
    if(!imgParams) return true;
    return imgParams.srcset.every(val => element.srcset.includes(val));
  }

  function onDelete(data) {
    images.forEach(function(element) {
      if(data.Deleted[0].Key === element.Key) images.splice(images.indexOf(element), 1);
    });
    reloadImagePicker();
  }

  function onImageSelected(element) {
    let file = element[0].files[0];
    if(file === undefined) return;
    vinkCms.imageHelper.resize(imgParams, file, onImageResized);
  }

  function onImageResized(files) {
    if(imgParams) {
      if (files.length-1 != imgParams.srcset.length)
        return alert(`Could not resize, please check if the image size width is minimal ${imgParams.orgsize.width}px x ${imgParams.orgsize.height}px`);
    } else {
      if (files.length != 2) {
        return alert(`Something went wrong resizing`);
      }
    }
    files.forEach(function(file) {
      upload(file);
    });
  }

  function upload(file) {
    let params = {
      Key: `images/${file.fileName}`,
      Body: file,
      ContentType: file.type
    }
    vinkCms.s3.imageUpload(params, onImageUploaded);
  }

  function onImageUploaded(data) {
    addItem(data);
    reloadImagePicker();
    $(".thumbnails li img").last().trigger("click");
    $(".image-container").scrollTop($(".image-container").prop("scrollHeight"));
  }

  return {
    open: open
  };
}());
