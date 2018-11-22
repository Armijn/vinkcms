vinkCms.modules = vinkCms.modules || {};
vinkCms.modules.markDownTextArea = (function() {
  const MARKDOWN = `<div class="markdown"><textarea class="js-markdown"></textarea></div>`;
  let item;
  let cb;

  function generate(container, contentBlock) {
    container.append(MARKDOWN);
    cb = contentBlock;
    item = new SimpleMDE({
      element: $(".js-markdown")[0]
    });
    if(contentBlock.val) item.value(contentBlock.val);
    contentBlock.reference = this;

    $(".editor-toolbar").append(`<input class="image-upload" type="file">`);
    $(".fa-picture-o").on("click", function() {
      $(".image-upload").trigger("click");
    });

    $(".image-upload").on("change", function() {
      onImageSelected($(this));
    });
  }

  function onImageSelected(element) {
    let file = element[0].files[0];
    let params = {
      Key: `images/${file.name.replace(/\s|\\|\/|\(|\)/g,'-')}`,
      Body: file,
      ContentType: file.type
    }
    vinkCms.s3.imageUpload(params, onImageUploaded);
  }

  function onImageUploaded(data) {
    let replaced = item.value().replace("![](http://)", `![${data.key.replace("images/", "")}](${data.Location})`);
    item.value(replaced);
    console.log(data);
  }

  function val() {
    return item.value();
  }

  function json() {
    return { [cb.name]: val() }
  }

  return {
    generate: generate,
    onImageUploaded: onImageUploaded,
    val: val,
    json: json
  };
});
