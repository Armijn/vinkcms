vinkCms.modules = vinkCms.modules || {};
vinkCms.modules.sharedInput = (function() {
  let item;
  let cb;

  function generate(container, contentBlock, imageUpload, type) {
    let textAreaContainer = $(`<div class="${type}"><${type} ${vinkCms.helper.attrToString(contentBlock.attr)}></${type}></div>`).appendTo(container);
    if(contentBlock.label) {
      let label = $(`<label>${contentBlock.label}</label>`).appendTo(container);
      textAreaContainer.appendTo(label);
    }
    item = textAreaContainer.find(type);
    cb = contentBlock;
    item.attr(contentBlock.attr || "");
    if(contentBlock.val) item.val(contentBlock.val);
    contentBlock.reference = this;
    if(contentBlock.isImage) addImageUploadButton(textAreaContainer, contentBlock);
    return this;
  }

  function addImageUploadButton(container, contentBlock) {
    container.prepend(`<div class="editor-toolbar"><a class="fa fa-picture-o"></a></div>`);
    container.find(".fa-picture-o").on("click", function() {
      vinkCms.imagePicker.open(onImageSelected, contentBlock.img);
    });
  }

  function onImageSelected(url, fullUrl) {
    vinkCms.helper.insertAtCaret(item, url);
  }

  function val() {
    return item.val();
  }

  function html() {
    return val();
  }

  function json() {
    return { [cb.name]: val() }
  }

  return {
    generate: generate,
    val: val,
    json: json,
    html: html
  };
});
