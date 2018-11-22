vinkCms.modules = vinkCms.modules || {};
vinkCms.modules.input = (function() {
  const INPUT = `<input type="text"></input>`;
  let item;

  function generate(container, contentBlock) {
    item = $(INPUT).appendTo(container);
    item.attr(contentBlock.attr || "");
    if(contentBlock.val) item.val(contentBlock.val);
    contentBlock.reference = this
  }

  function val() {
    return item.val();
  }

  return {
    generate: generate,
    val: val
  };
});
