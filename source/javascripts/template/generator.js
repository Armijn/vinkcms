vinkCms.template = (function() {
  let entry = {};
  const TITLE = `<input type="text" name="title" placeholder="title">`;
  const SLUG = `<input type="text" name="slug" placeholder="slug">`;
  const MARKDOWN = `<textarea class="js-markdown"></textarea>`;
  const INPUT = `<input type="text"></input>`;
  const TEXTAREA = "<textarea></textarea>";
  const DEFAULT_META = { title: { type: "input" }, slug: { type: "input" } };

  function newEntry(container, template, callback) {
    template.meta = getDefaultMeta(template);
    generate(container, template, callback);
  }

  function editEntry(container, template, callback) {
    generate(container, template, callback);
  }

  function generate(container, template, callback) {
    entry = vinkCms.helper.clone(template);
    container.empty();
    generateView(container, callback);
  }

  function generateView(container, callback) {
    addPreDefinedFields(container);
    addCustomContentBlocks(container);
    addSaveButton(container, callback);
  }

  function addCustomContentBlocks(container) {
    entry.content.forEach(function(contentBlock) {
        switch(contentBlock.type) {
        case "markDownTextArea":
            addMarkdownTextArea(container, contentBlock);
            break;
        case "textArea":
            addTextArea(container, contentBlock);
            break;
        case "input":
            addInput(container, contentBlock);
            break;
        }
    });
  }

  function addMarkdownTextArea(container, contentBlock) {
    addView(container, MARKDOWN, contentBlock);
    let mdEditor = new SimpleMDE({ element: $(".js-markdown")[0] });
    mdEditor.value(contentBlock.val);
    addViewReference(mdEditor, contentBlock);
  }

  function addTextArea(container, contentBlock) {
    addView(container, TEXTAREA, contentBlock);
  }

  function addInput(container, contentBlock) {
    addView(container, INPUT, contentBlock);
  }

  function addPreDefinedFields(container) {
    container.append(`<h1>${entry.name}</h1>`);
    addView(container, TITLE, entry.meta.title);
    addView(container, SLUG, entry.meta.slug);
  }

  function addSaveButton(container, callback) {
    let save = $(`<input type="submit" value="Save">`);
    save.on("click", function() { processEntry(callback); });
    container.append(save);
  }

  function processEntry(callback) {
    let json = vinkCms.jsonProcessor.generate(entry);
    let html = vinkCms.htmlProcessor.generate(entry);
    console.log(html);
    // callback(json, html);
  }

  function addView(container, reference, contentBlock) {
    let item = $(reference);
    container.append(item);
    addViewReference(item, contentBlock);
    if(contentBlock.val) item.val(contentBlock.val);
  }

  function addViewReference(reference, contentBlock) {
    contentBlock.reference = reference;
  }

  function setupNav(container, callback) {
    vinkCms.templates.forEach(function(template) {
      let navItem = generateNavItem(template);
      container.append(navItem);
      navItem.on("click", function() {
        callback($(this).data("template-id"));
      });
    });
  }

  function getDefaultMeta(template) {
    if(template.meta) return Object.assign(DEFAULT_META, template.meta);
    return DEFAULT_META;
  }

  function generateNavItem(template) {
    return $(`<input type="submit"
              data-template-id="${vinkCms.templates.indexOf(template)}"
              value="${template.name}">`);
  }

  return {
    newEntry: newEntry,
    editEntry: editEntry,
    setupNav: setupNav
  };
}());
