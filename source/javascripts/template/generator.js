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
    addCustomContentBlocks($("<fieldset></fieldset>").appendTo(container));
  }

  function addCustomContentBlocks(container) {
    container.append(`<h2>Content</h2>`);
    entry.content.forEach(function(contentBlock) {
      vinkCms.modules[contentBlock.type]().generate(container, contentBlock);
    });
  }

  function addPreDefinedFields(container) {
    container.append(`<h2>Metadata</h2>`);
    vinkCms.modules["input"]().generate(container, entry.meta.title);
    vinkCms.modules["input"]().generate(container, entry.meta.slug);
  }

  function processEntry() {
    let json = vinkCms.jsonProcessor.generate(entry);
    vinkCms.s3.dataUpload(
      entry.meta.slug.val,
      JSON.stringify(entry),
      vinkCms.template.onDataUploaded
    );
  }

  function onDataUploaded() {
    let html = vinkCms.htmlProcessor.generate(entry);
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
