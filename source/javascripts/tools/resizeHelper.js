vinkCms.resizeHelper = (function() {
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

  function resizeImage(file, w, h, fileName, isLast) {
    ImageTools.resize(file, { width: w, height: h },
      function(resized, didItResize) {
        console.log(didItResize)
        if(!didItResize) return;
        resized.fileName = fileName;
        files.push(resized);
        if(isLast) callback(files);
      }
    );
  }

  return {
    resize: resize
  };
}());
