vinkCms.modules = vinkCms.modules || {};
vinkCms.modules.textarea = (function() {
  function generate(container, contentBlock) {
    return vinkCms.modules.sharedInput().generate(container, contentBlock, false, "textarea");
  }

  return {
    generate: generate
  };
});
