vinkCms.jsonProcessor = (function() {
  let alsoJson;
  function generate(entry) {
    let json = "";
    alsoJson = [];
    Object.keys(entry.meta).forEach(function(key) {
      let metaBlock = entry.meta[key];
      metaBlock.val = metaBlock.reference.val();
      metaBlock.html = metaBlock.reference.html();
      if(key === "slug")
        metaBlock.fullSlug = metaBlock.val;
      if(entry.prefix && key === "slug")
        metaBlock.fullSlug = entry.prefix + metaBlock.val;
      delete metaBlock.reference;
    });

    generateContent(entry.content, entry);

    entry.json.forEach(function(contentBlock) {
      contentBlock.val = contentBlock.reference.val();
      contentBlock.json = contentBlock.reference.json();
      delete contentBlock.reference;
    });
    return entry;
  }

  function generateContent(content, entry) {
    content.forEach(function(contentBlock) {
      if (contentBlock.content) {
        generateContent(contentBlock.content, entry);
      } else {
        contentBlock.val = contentBlock.reference.val();
        contentBlock.html = contentBlock.reference.html();
        if(contentBlock.exportToJson) {
          contentBlock.json = contentBlock.reference.json();
          alsoJson.push(contentBlock);
        }
        delete contentBlock.reference;
      }
    });
  }

  function generateMeta(entry) {
    let slug = entry.meta.slug.fullSlug;
    let metaJson = { [slug]: {}};

    alsoJson.forEach(function(contentBlock) {
      metaJson[slug] = Object.assign(metaJson[slug], contentBlock.json);
    });
    entry.json.forEach(function(contentBlock) {
      metaJson[slug] = Object.assign(metaJson[slug], contentBlock.json);
    });
    return metaJson;
  }

  return {
    generate: generate,
    generateMeta: generateMeta
  };
}());
