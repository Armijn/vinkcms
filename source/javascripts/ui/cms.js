vinkCms.cmsUI = (function() {

  function init() {
    $(function() {
      vinkCms.template.setupNav($(".js-new-items"), onNavClick);
      vinkCms.s3.list(vinkCms.s3.getDataBucket(), onRetievedList);
    });
  }

  return {
    init: init
  };
}());

function onNavClick(templateId) {
  vinkCms.template.newEntry($(".entry"), vinkCms.templates[templateId]);
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
  vinkCms.s3.getObject(vinkCms.s3.getDataBucket(), slug, onEntryReceived);
}

function onEntryReceived(entry) {
  vinkCms.template.editEntry($(".entry"), entry);
}
