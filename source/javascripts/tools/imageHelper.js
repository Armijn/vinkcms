vinkCms.imageHelper = (function() {
  let files;
  let callback;
  let file;
  function resize(imgParams, file, cb) {
    files = [];
    callback = cb;

    if(!imgParams) {
      file.fileName = `${getFileName(file)}.${getExtension(file)}`;
      files.push(file);
    } else {
      processParams(imgParams, file);
    }
    resizeImage(file, 195, 195, `${getFileName(file)}.thumb.${getExtension(file)}`, true);
  }

  function processParams(imgParams, file) {
    imgParams.srcset.forEach(function(widthSize) {
      let scaleFactor = imgParams.orgsize.width / parseInt(widthSize.replace("w", ""));
      let scaledWidth = imgParams.orgsize.width / scaleFactor;
      let scaledHeight = imgParams.orgsize.height / scaleFactor;
      let fileName = `${getFileName(file)}.${scaledWidth}w.${getExtension(file)}`;
      let index = imgParams.srcset.indexOf(widthSize);
      resizeImage(file, scaledWidth, scaledHeight, fileName, false);
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

  async function resizeImage(file, w, h, fileName, isLast) {
    ImageTools.resize(file, { width: w, height: h },
      function(resized, didItResize) {
        if(!didItResize) return;
        resized.fileName = fileName;
        files.push(resized);
        if(isLast) callback(files);
      }
    );
  }

  function convertImagesToSrcSet(html, imgParams) {
    if(!imgParams) return html;
    let images = html.match(/<img.*\/>/mg);
    if(!images) return html;
    images.forEach(function(imageTag) {
      let convertedImageTag = convertImageTag(imageTag, imgParams);
      html = html.replace(imageTag, convertedImageTag);
    });
    console.log(html);
    return html;
  }

  function convertImageTag(imageTag, imgParams) {
    let image = $(imageTag);
    let slug = image.attr("src");
    let extensions = slug.split(".");
    let extension = extensions.splice(-1, 1);
    let id = slug.split(".")[0];
    let srcset = "";
    image.removeAttr("src");
    extensions.shift();

    extensions.forEach(function(size) {
      srcset += `${id}.${size}.${extension} ${size}, `;
    });
    srcset = srcset.slice(0, -1);

    image.attr("srcset", srcset);
    image.attr("sizes", imgParams.sizes);

    return image[0].outerHTML;
  }

  return {
    resize: resize,
    convertImagesToSrcSet: convertImagesToSrcSet
  };
}());
