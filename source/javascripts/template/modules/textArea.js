vinkCms.modules = vinkCms.modules || {};
vinkCms.modules.textArea = (function() {
  const TEXTAREA = "<textarea></textarea>";
  let item;

  function generate(container, contentBlock) {
    item = $(TEXTAREA).appendTo(container);
    item.attr(contentBlock.attr || "");
    if(contentBlock.val) item.val(contentBlock.val);
    contentBlock.reference = this;
  }

  function val() {
    return item.val();
  }

  return {
    generate: generate,
    val: val
  };
});
