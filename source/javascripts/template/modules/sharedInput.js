vinkCms.modules = vinkCms.modules || {};
vinkCms.modules.sharedInput = (function() {
  let item;
  let cb;

  function generate(container, contentBlock, imageUpload) {
    let textAreaContainer = $(`<div class="${contentBlock.type}"><${contentBlock.type}></${contentBlock.type}></div>`).appendTo(container);
    item = textAreaContainer.find(contentBlock.type);
    cb = contentBlock;
    item.attr(contentBlock.attr || "");
    if(contentBlock.val) item.val(contentBlock.val);
    contentBlock.reference = this;
    if(contentBlock.isImage) addImageUploadButton(textAreaContainer);
  }

  function addImageUploadButton(container) {
    container.prepend(`<div class="editor-toolbar"><a class="fa fa-picture-o"></a></div>`);
    container.find(".fa-picture-o").on("click", function() {
      vinkCms.imagePicker.open(onImageSelected);
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
