vinkCms.template = (function() {

  function generate(container, templateId, callback) {
    let template = vinkCms.templates[templateId];
    let save = $(`<input type="submit" value="Save">`);
    let entry = `<h1>${template.name}</h1><input type="text" name="title" placeholder="title"><input type="text" name="slug" placeholder="slug">`;

    template.content.forEach(function(contentBlock) {
      entry += generateContentBlock(contentBlock);
    });

    save.on("click", function() {
      callback();
    });

    container.append(entry, save);
  }

  function generateContentBlock(contentBlock) {
    return `<textarea content-textarea" rows="25"></textarea>`
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
