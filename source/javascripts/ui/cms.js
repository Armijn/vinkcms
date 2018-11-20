$(function() {
  vinkCms.template.setupNav($(".nav"), onNavClick);
});

function onNavClick(templateId) {
  vinkCms.template.generate($(".entry"), templateId, onEntrySubmit);
}

function onEntrySubmit() {
}
