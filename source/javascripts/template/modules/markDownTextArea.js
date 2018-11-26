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

    $(".fa-picture-o").on("click", function() {
      vinkCms.imagePicker.open(onImageSelected, contentBlock.img);
    });
  }

  function onImageSelected(url) {
    let replaced = item.value().replace("![](http://)", `![](${url})`);
    item.value(replaced);
  }

  function val() {
    return item.value();
  }

  function html() {
    let conv = new showdown.Converter({metadata: true});
    let html = conv.makeHtml(item.value());
    return vinkCms.imageHelper.convertImagesToSrcSet(html, cb.img);
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
