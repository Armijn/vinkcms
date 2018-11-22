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
  }

  function val() {
    return item.value();
  }

  function json() {
    return { [cb.name]: val() }
  }

  return {
    generate: generate,
    val: val,
    json: json
  };
});
