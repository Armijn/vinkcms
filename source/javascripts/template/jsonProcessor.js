vinkCms.jsonProcessor = (function() {

  function generate(entry) {
    let json = "";
    entry.meta.title.val = entry.meta.title.reference.val();
    entry.meta.slug.val = entry.meta.slug.reference.val();
    entry.content.forEach(function(contentBlock) {
      contentBlock.val = contentBlock.reference.val();
      delete contentBlock.reference;
    });

    entry.json.forEach(function(contentBlock) {
      contentBlock.val = contentBlock.reference.val();
      contentBlock.json = contentBlock.reference.json();
      delete contentBlock.reference;
    });
    return entry;
  }

  function generateMeta(entry) {
    let slug = entry.meta.slug.reference.val();
    let metaJson = { [slug]: {}}
    entry.json.forEach(function(contentBlock) {
      contentBlock.val = contentBlock.val;
      metaJson[slug] = Object.assign(metaJson[slug], contentBlock.json);
    });
    return metaJson;
  }

  return {
    generate: generate,
    generateMeta: generateMeta
  };
}());
