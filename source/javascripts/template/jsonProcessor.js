vinkCms.jsonProcessor = (function() {

  function generate(entry) {
    let json = "";
    entry.meta.title.val = entry.meta.title.reference.val();
    entry.meta.slug.val = entry.meta.slug.reference.val();

    entry.content.forEach(function(contentBlock) {
      switch (contentBlock.reference.constructor) {
        case SimpleMDE:
          contentBlock.val = contentBlock.reference.value();
          break;
        case jQuery:
          contentBlock.val = contentBlock.reference.val();
          break;
      }
      delete contentBlock.reference;
    });
    return entry;
  }

  return {
    generate: generate
  };
}());
