vinkCms.modules = vinkCms.modules || {};
vinkCms.modules.markDownTextArea = (function() {
  const MARKDOWN = `<div class="markdown"><textarea class="js-markdown"></textarea></div>`;
  let item;

  function generate(container, contentBlock) {
    container.append(MARKDOWN);
    item = new SimpleMDE({
      element: $(".js-markdown")[0]
    });
    if(contentBlock.val) item.value(contentBlock.val);
    contentBlock.reference = this;
  }

  function val() {
    return item.value();
  }

  return {
    generate: generate,
    val: val
  };
});
