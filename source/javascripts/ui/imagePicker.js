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
      let fullUrl = vinkCms.s3.getUrlFor(url);
      close();
      callback(`/${url}`, fullUrl);
    });

    $(".js-delete-image").on("click", function() {
      let keys = images[$(".image-picker").val()].urls;
      let params = vinkCms.params.getHtmlParams(
        vinkCms.params.getDeleteParams(keys), onDelete
      );
      vinkCms.s3.deleteObject(params);
    });

    vinkCms.s3.list({
      Dir: "images/", Bucket: vinkCms.s3.getSiteBucket(), callback: onImagesRecieved
    });
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
      extension: extension,
      thumb: vinkCms.s3.getUrlFor(`${id}.thumb.${extension}`),
      getUrl: function functionName() {
        if(!imgParams) {
          return `${this.id}.${this.extension}`;
        } else {
          return `${this.id}.${this.srcset.join(".")}.${this.extension}`;
        }
      },
      urls: [],
      getOption: function() {
        return `<option data-img-src="${this.thumb}" value="${this.id}">${this.id}</option>`;
      }
    };
    if(!imgParams) imageSize = null;
    if(imageSize !== "thumb" && imageSize != null) images[id].srcset.push(imageSize);
    images[id].urls.push(element.Key);
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
    if(!imgParams && element.urls.length > 2) return false;
    if(!imgParams) return true;
    return imgParams.srcset.every(val => element.srcset.includes(val));
  }

  function onDelete(data) {
    delete images[data.Deleted[0].Key.split(".")[0]];
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
    let queue = vinkCms.queue();
    files.forEach(function(file) {
      upload(file, queue);
    });
    queue.go("Uploading...", vinkCms.imagePicker.onImageUploaded);
  }

  function upload(file, queue) {
    let params = vinkCms.params.getHtmlParams({
        Key: `images/${file.fileName}`,
        Body: file,
        ContentType: file.type
      }, onImageUploaded
    );
    queue.add(vinkCms.s3.upload, params);
  }

  function onImageUploaded(data) {
    vinkCms.s3.list({
      Dir: "images/", Bucket: vinkCms.s3.getSiteBucket(), callback: onImagesRecieved
    });
  }

  return {
    open: open,
    onImageUploaded: onImageUploaded
  };
}());
