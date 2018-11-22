vinkCms.modules = vinkCms.modules || {};
vinkCms.modules.input = (function() {
  const INPUT = `<input type="text"></input>`;
  let item;
  let cb;

  function generate(container, contentBlock) {
    item = $(INPUT).appendTo(container);
    cb = contentBlock;
    item.attr(contentBlock.attr || "");
    if(contentBlock.val) item.val(contentBlock.val);
    contentBlock.reference = this
  }

  function val() {
    return item.val();
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
