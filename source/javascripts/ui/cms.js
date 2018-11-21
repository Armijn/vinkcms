vinkCms.cmsUI = (function() {

  function init() {
    $(function() {
      vinkCms.template.setupNav($(".nav"), onNavClick);
      vinkCms.s3.list(onRetievedList);
    });
  }

  return {
    init: init
  };
}());

function onNavClick(templateId) {
  vinkCms.template.newEntry($(".entry"), vinkCms.templates[templateId], onEntrySubmit);
}

function onEntrySubmit(entry, html) {
  vinkCms.s3.upload(entry.meta.slug.val, JSON.stringify(entry), onEntryUploaded);
}

function onEntryUploaded() {
  vinkCms.s3.list();
}

function onEntryUploaded() {
  location.reload();
}

function onRetievedList(list) {
  list.forEach(function(listItem) {
    let link = $(`<a href=${listItem.url} class="js-entry-item">${listItem.slug}</a>`)
    $(".list").append(link);
  });

  $(".js-entry-item").on("click", function(e) {
    e.preventDefault();
    editEntry($(this).html());
  });
}

function editEntry(slug) {
  vinkCms.s3.getObject(slug, onEntryReceived);
}

function onEntryReceived(entry) {
  vinkCms.template.editEntry($(".entry"), entry, onEntrySubmit);
}
