vinkCms.cmsUI = (function() {

  function init() {
    $(function() {
      vinkCms.template.setupNav($(".nav"), onNavClick);
    });
  }

  function onNavClick(templateId) {
    vinkCms.template.generate($(".entry"), templateId, onEntrySubmit);
  }

  function onEntrySubmit(json, html) {
    console.log(json);
  }

  return {
    init: init
  };
}());
