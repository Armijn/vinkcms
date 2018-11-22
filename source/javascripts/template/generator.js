vinkCms.template = (function() {
  let entry = {};
  const DEFAULT_META = {
    title: {
      type: "input",
      placeholder: "Title",
      attr: { placeholder: "Title", required: true }
    },
    slug: {
      type: "input",
      placeholder: "Slug",
      attr: { placeholder: "Slug", required: true }
    }
  };

  function newEntry(container, template) {
    template.meta = getDefaultMeta(template);
    generate(container, template);
  }

  function editEntry(container, template) {
    generate(container, template);
    $("h1").append(` - <a target="_blank" href="${vinkCms.s3.getUrlFor(template.meta.slug.val)}">${template.meta.slug.val}</a>`);
  }

  function generate(container, template) {
    entry = vinkCms.helper.clone(template);
    container.empty();
    container.append(`<h1>${entry.name}</h1>`);
    addPreDefinedFields($("<fieldset></fieldset>").appendTo(container));
    addCustomContentBlocks(container, "JSON", entry.json);
    addCustomContentBlocks(container, "Content", entry.content);
  }

  function addCustomContentBlocks(container, name, items) {
    if(!items) return;
    let fieldSet = $("<fieldset></fieldset>").appendTo(container);
    fieldSet.append(`<h2>${name}</h2>`);
    items.forEach(function(contentBlock) {
      vinkCms.modules[contentBlock.type]().generate(fieldSet, contentBlock);
    });
  }

  function addPreDefinedFields(container) {
    container.append(`<h2>Metadata</h2>`);
    vinkCms.modules["input"]().generate(container, entry.meta.title);
    vinkCms.modules["input"]().generate(container, entry.meta.slug);
  }

  function processEntry() {
    let entryJson = JSON.stringify(vinkCms.jsonProcessor.generate(entry));
    let meta = JSON.stringify(vinkCms.jsonProcessor.generateMeta(entry));
    let html = vinkCms.htmlProcessor.generate(entry);
    uploadEntry(html, entryJson, meta);
  }

  function uploadEntry(html, entryJson, meta) {
    let siteBucket = vinkCms.s3.getSiteBucket();
    let dataBucket = vinkCms.s3.getDataBucket();
    vinkCms.uploadHandler.upload({
      html: { Key: entry.meta.slug.val, Body: html },
      entry: { Key: entry.meta.slug.val, Body: entryJson },
      meta: { slug: entry.meta.slug.val, Body: meta },
    }, onEntryUploaded);
  }

  function onDataUploaded() {
    vinkCms.s3.siteUpload(entry.meta.slug.val, html, onEntryUploaded);
  }

  function getDefaultMeta(template) {
    if(template.meta) return Object.assign(DEFAULT_META, template.meta);
    return DEFAULT_META;
  }

  return {
    newEntry: newEntry,
    editEntry: editEntry,
    processEntry: processEntry,
    onDataUploaded: onDataUploaded
  };
}());
