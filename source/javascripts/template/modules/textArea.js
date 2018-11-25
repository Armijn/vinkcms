vinkCms.modules = vinkCms.modules || {};
vinkCms.modules.textArea = (function() {
  const TEXTAREA = "<textarea></textarea>";
  let item;
  let cb;

  function generate(container, contentBlock) {
    item = $(TEXTAREA).appendTo(container);
    cb = contentBlock;
    item.attr(contentBlock.attr || "");
    if(contentBlock.val) item.val(contentBlock.val);
    contentBlock.reference = this;
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
