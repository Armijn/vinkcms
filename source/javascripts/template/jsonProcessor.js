vinkCms.jsonProcessor = (function() {

  function generate(entry) {
    let json = "";
    Object.keys(entry.meta).forEach(function(key) {
      let metaBlock = entry.meta[key];
      metaBlock.val = metaBlock.reference.val();
      metaBlock.html = metaBlock.reference.html();
      delete metaBlock.reference;
    });

    generateContent(entry.content);

    entry.json.forEach(function(contentBlock) {
      contentBlock.val = contentBlock.reference.val();
      contentBlock.json = contentBlock.reference.json();
      delete contentBlock.reference;
    });
    return entry;
  }

  function generateContent(content) {
    content.forEach(function(contentBlock) {
      if (contentBlock.content) {
        generateContent(contentBlock.content);
      } else {
        contentBlock.val = contentBlock.reference.val();
        contentBlock.html = contentBlock.reference.html();
        delete contentBlock.reference;
      }
    });
  }

  function generateMeta(entry) {
    let slug = entry.meta.slug.val;
    delete entry.meta.slug.reference;
    let metaJson = { [slug]: {}};

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
