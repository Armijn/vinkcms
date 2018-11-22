vinkCms.navigator = (function() {
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
    return $(`<input type="submit"
              data-template-id="${vinkCms.templates.indexOf(template)}"
              value="${template.name}">`);
  }

  return {
    setupNav: setupNav
  };
}());
