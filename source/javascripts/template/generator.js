vinkCms.template = (function() {

  function generate(container, templateId, callback) {
    let template = vinkCms.templates[templateId];
    addPreDefinedFields(container, template);
    addCustomContentBlocks(container, template);
    addSaveButton(container);
  }

  function addCustomContentBlocks(container, template) {
    template.content.forEach(function(contentBlock) {
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
    let textArea = addTextArea(container, contentBlock);
    new SimpleMDE({ element: textArea[0] });
  }

  function addTextArea(container, contentBlock) {
    let textArea = $("<textarea></textarea>");
    container.append(textArea);
    return textArea;
  }

  function addInput(container, contentBlock) {
    let input = $(`<input type="text"></input>"`);
    container.append(input);
  }

  function addPreDefinedFields(container, template) {
    container.append(`<h1>${template.name}</h1>
                      <input type="text" name="title" placeholder="title">
                      <input type="text" name="slug" placeholder="slug">`);
  }

  function addSaveButton(container) {
    let save = $(`<input type="submit" value="Save">`);
    save.on("click", function() {
      let json = vinkCms.jsonProcessor.generate(container);
      let html = vinkCms.htmlProcessor.generate(json);
      callback(json, html);
    });
    container.append(save);
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

  function generateNavItem(template) {
    return $(`<input
              type="submit"
              data-template-id="${vinkCms.templates.indexOf(template)}"
              value="${template.name}">`)
  }

  return {
    setupNav: setupNav,
    generate: generate
  };
}());
