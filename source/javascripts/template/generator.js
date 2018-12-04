vinkCms.template = (function() {
  let entry = {};
  const DEFAULT_META = {
    title: {
      type: "input",
      attr: { placeholder: "Title", required: true }
    },
    slug: {
      type: "input",
      attr: { placeholder: "Slug", required: true }
    },
    description: {
      type: "textarea",
      attr: { placeholder: "description", required: true }
    },
    image: {
      type: "input",
      isImage: true,
      attr: { placeholder: "Social image", required: true }
    }
  };

  function newEntry(container, template) {
    template.meta = getDefaultMeta(template);
    generate(container, template);
  }

  function editEntry(container, template) {
    template.oldSlug = template.meta.slug.val;
    generate(container, template);
    $("h1").append(` - <a target="_blank" href="${vinkCms.s3.getUrlFor(template.meta.slug.fullSlug)}">${template.meta.slug.val}</a>`);
  }

  function generate(container, template) {
    entry = vinkCms.helper.clone(template);
    container.empty();
    container.append(`<h1>${entry.name}</h1>`);
    addCustomContentBlocks(container, "Metadata", Object.values(template.meta));
    addCustomContentBlocks(container, "JSON", entry.json);
    addCustomContentBlocks(container, "Content", entry.content, vinkCms.s3.getUrlFor(entry.css));
  }

  function addCustomContentBlocks(container, name, items, css) {
    if(!items) return;
    let fieldSet = $("<fieldset></fieldset>").appendTo(container);
    fieldSet.append(`<h2>${name}</h2>`);
    addContents(fieldSet, items, css);
  }

  function addContents(container, items, css, parentClass) {
    items.forEach(function(contentBlock) {
      if(parentClass) contentBlock.parentClass = [parentClass, contentBlock.containerAttr];
      if(css) contentBlock.css = css;
      if(contentBlock.content) {
        addContents(container, contentBlock.content, css, contentBlock.containerAttr);
      } else {
        vinkCms.modules[contentBlock.type]().generate(container, contentBlock);
      }
    });
  }

  function processEntry() {
    let entryJson = JSON.stringify(vinkCms.jsonProcessor.generate(entry));
    let meta = JSON.stringify(vinkCms.jsonProcessor.generateMeta(entry));
    let html = vinkCms.htmlProcessor.generate(entry);
    let data = {
      html: { Key: entry.meta.slug.fullSlug, Body: html },
      entry: { Key: entry.meta.slug.fullSlug, Body: entryJson },
      meta: { slug: entry.meta.slug.fullSlug, Body: meta }
    };

    console.log(data);

    if(entry.oldSlug == undefined || entry.oldSlug === entry.meta.slug.val) {
      uploadEntry(data);
    } else {
      renameEntry(entry.oldSlug, data);
      delete entry.oldSlug;
    }
  }

  function uploadEntry(data) {
    vinkCms.uploadHandler.upload({data: data, callback: onEntryUploaded});
  }

  function renameEntry(oldSlug, data) {
    vinkCms.renameHandler.rename(oldSlug, data, onEntryUploaded);
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
