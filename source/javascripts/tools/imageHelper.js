vinkCms.imageHelper = (function() {
  let files;
  let file;
  let queue;

  function resize(imgParams, file, callback) {
    files = [];
    queue = vinkCms.queue();

    if(!imgParams) {
      file.fileName = `${getFileName(file)}.${getExtension(file)}`;
      files.push(file);
    } else {
      processParams(imgParams, file);
    }

    queue.add(
      vinkCms.imageHelper.resizeImage,
      {file: file, w: 195, h: 195, fileName: `${getFileName(file)}.thumb.${getExtension(file)}`}
    );
    queue.go("Resizing...", callback);
  }

  function processParams(imgParams, file) {
    imgParams.srcset.forEach(function(widthSize) {
      let scaleFactor = imgParams.orgsize.width / parseInt(widthSize.replace("w", ""));
      let scaledWidth = imgParams.orgsize.width / scaleFactor;
      let scaledHeight = imgParams.orgsize.height / scaleFactor;
      let fileName = `${getFileName(file)}.${scaledWidth}w.${getExtension(file)}`;
      let index = imgParams.srcset.indexOf(widthSize);
      queue.add(
        vinkCms.imageHelper.resizeImage,
        {file: file, w: scaledWidth, h: scaledHeight, fileName: fileName}
      );
    });
  }

  function getFileName(file) {
    let fileExtension = file.name.split('.').pop();
    let fileName = file.name.replace(/\s|\\|\/|\(|\)/g,'-');
    fileName = fileName.split(".")[0];
    return fileName;
  }

  function getExtension(file) {
    return file.name.split('.').pop();
  }

  function resizeImage(params) {
    let file = params.file;
    let w = params.w;
    let h = params.h;
    let fileName = params.fileName;
    ImageTools.resize(file, { width: w, height: h },
      function(resized, didItResize) {
        resized.fileName = fileName;
        files.push(resized);
        params.callback(files);
      }
    );
  }

  function convertImagesToSrcSet(html, imgParams, preview) {
    if(!imgParams) return html;
    let images = html.match(/<img.*\/>/mg);
    if(!images) return html;
    images.forEach(function(imageTag) {
      let convertedImageTag = convertImageTag(imageTag, imgParams, preview);
      html = html.replace(imageTag, convertedImageTag);
    });
    return html;
  }

  function convertImageTag(imageTag, imgParams, preview) {
    let image = $(imageTag);
    let slug = image.attr("src");
    let extensions = slug.split(".");
    let extension = extensions.splice(-1, 1);
    let id = slug.split(".")[0];
    let srcset = "";
    image.removeAttr("src");
    extensions.shift();

    extensions.forEach(function(size) {
      let link = `${id}.${size}.${extension} ${size}`
      if(preview) link = vinkCms.s3.getUrlFor(link.slice(1));
      srcset += `${link}, `;
    });
    srcset = srcset.slice(0, -1);

    image.attr("srcset", srcset);
    image.attr("sizes", imgParams.sizes);

    return image[0].outerHTML;
  }

  return {
    resize: resize,
    resizeImage: resizeImage,
    convertImagesToSrcSet: convertImagesToSrcSet
  };
}());
