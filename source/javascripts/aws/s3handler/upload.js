vinkCms.uploadHandler = (function() {
  const METADATAKEY = ".vinkcms/data.json";
  const HTMLTYPEPARAMS = { ContentType: "text/html; charset=UTF-8" };
  const JSONTYPEPARAMS = { ContentType: "text/json; charset=UTF-8" };
  const PUBLICPARAMS = { ACL: "public-read" };
  const METADATAPARAMS = { Key: METADATAKEY };

  let callback;
  let requestSize;
  let currentRequest;
  let metaParams;

  function upload(data, cb) {
    let htmlParams = vinkCms.params.getHtmlParams(data.html);
    let entryParams = vinkCms.params.getDataParams(data.entry);
    metaParams = vinkCms.params.getMetaParams(data.meta);

    console.log(htmlParams);
    console.log(entryParams);
    console.log(metaParams);
    callback = cb;
    requestSize = 3;
    currentRequest = 0;

    vinkCms.s3.upload(htmlParams, vinkCms.uploadHandler.onItemUploaded);
    vinkCms.s3.upload(entryParams, vinkCms.uploadHandler.onItemUploaded);
    retrieveMetaJson(metaParams);
  }

  function retrieveMetaJson(params) {
    console.log(METADATAKEY);
    vinkCms.s3.headObject(vinkCms.s3.getSiteBucket(), METADATAKEY, onHead);
  }

  function onHead(err, data) {
    if (err && err.code === "NotFound") {
      console.log("not found");
      createNewMetaObject();
    } else {
      console.log("found");
      vinkCms.s3.getObject(vinkCms.s3.getSiteBucket(), METADATAKEY, updateExisting);
    }
  }

  function createNewMetaObject() {
    delete metaParams.slug;
    vinkCms.s3.upload(metaParams, vinkCms.uploadHandler.onItemUploaded);
  }

  function updateExisting(data) {
    let itemToUpdate = JSON.parse(metaParams.Body);
    console.log(itemToUpdate);
    console.log(itemToUpdate[metaParams.slug]);
    data[metaParams.slug] = itemToUpdate[metaParams.slug];
    metaParams.Body = JSON.stringify(data);
    delete metaParams.slug;
    vinkCms.s3.upload(metaParams, vinkCms.uploadHandler.onItemUploaded);
  }

  function onItemUploaded() {
    currentRequest++;
    if(currentRequest == requestSize) callback();
  }

  return {
    upload: upload,
    onItemUploaded: onItemUploaded
  };
}());
