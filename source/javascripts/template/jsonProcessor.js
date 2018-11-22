vinkCms.jsonProcessor = (function() {

  function generate(entry) {
    let json = "";
    entry.meta.title.val = entry.meta.title.reference.val();
    entry.meta.slug.val = entry.meta.slug.reference.val();
    console.log(entry.meta.title.val);
    console.log(entry.meta.slug.val);
    entry.content.forEach(function(contentBlock) {
      console.log(contentBlock.reference.val());
      contentBlock.val = contentBlock.reference.val();
      delete contentBlock.reference;
    });
    return entry;
  }

  return {
    generate: generate
  };
}());
