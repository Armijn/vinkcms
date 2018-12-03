vinkCms.modules = vinkCms.modules || {};
vinkCms.modules.linkInput = (function() {
  let linkInput;
  let cb;
  function generate(container, contentBlock) {
    cb = contentBlock;
    linkInput = vinkCms.modules.sharedInput().generate(container, contentBlock, false, "input");
    linkInput.html = html;
    return linkInput;
  }

  function html() {
    return cb.reference.val() == "" ? "" : `<a href="${cb.reference.val()}" target="_blank">${cb.text}</a>`;
  }

  return {
    generate: generate
  };
});
