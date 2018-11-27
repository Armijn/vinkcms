vinkCms.modules = vinkCms.modules || {};
vinkCms.modules.input = (function() {
  function generate(container, contentBlock) {
    return vinkCms.modules.sharedInput().generate(container, contentBlock);
  }

  return {
    generate: generate
  };
});
