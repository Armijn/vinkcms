vinkCms.modules = vinkCms.modules || {};
vinkCms.modules.markDownTextArea = (function() {
  const MARKDOWN = `<div class="markdown"><textarea class="js-markdown"></textarea></div>`;
  let item;
  let cb;

  function generate(container, contentBlock) {
    let markdownContainer = $(MARKDOWN).appendTo(container);
    cb = contentBlock;
    item = new SimpleMDE({
      element: markdownContainer.find(".js-markdown")[0],
      previewRender: function(html) {
        contentBlock.html = contentBlock.reference.html();
        return vinkCms.htmlProcessor.generateContent([contentBlock]);
      }
    });
    if(contentBlock.val) item.value(contentBlock.val);
    contentBlock.reference = this;

    markdownContainer.find(".fa-picture-o").on("click", function() {
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
