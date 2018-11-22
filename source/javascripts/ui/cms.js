vinkCms.cmsUI = (function() {

  function init() {
    $(function() {
      vinkCms.navigator.setupNav($(".js-new-items"), onNavClick);
      vinkCms.s3.list(vinkCms.s3.getDataBucket(), onRetievedList);

      $("form").on("submit", function(e) {
        e.preventDefault();
        vinkCms.template.processEntry();
      });

      $(window).bind('hashchange', function() {
        let slug = window.location.hash.replace("#", "");
        onItemPreview(slug);
      });

      $(".js-edit-entry-item").on("click", function(e) {
        e.preventDefault();
        let slug = window.location.hash.replace("#", "");
        showEdit();
        editEntry(slug);
      });

      $(".js-delete-entry-item").on("click", function(e) {
        e.preventDefault();
        let slug = window.location.hash.replace("#", "");
        deleteEntry(slug);
      });

      $(".js-exit-entry-item").on("click", function(e) {
        e.preventDefault();
        showPreview();
      });

      let slug = window.location.hash.replace("#", "");
      if(slug !== "") { onItemPreview(slug); }
    });
  }

  return {
    init: init
  };
}());

function onItemPreview(slug) {
  showPreview();
  $(".js-edit-entry-item").attr("id", slug);
  $(".js-preview iframe").attr('src', vinkCms.s3.getUrlFor(slug));
}

function showPreview() {
  $(".js-content").addClass("preview").removeClass("edit");
}

function showEdit() {
  $(".js-content").addClass("edit").removeClass("preview");
}

function onNavClick(templateId) {
  showEdit();
  vinkCms.template.newEntry($(".form-container"), vinkCms.templates[templateId]);
}

function onEntryDelete() {
  history.pushState("", "", "");
  location.reload();
}

function onEntryUploaded(data) {
  location.reload();
}

function onRetievedList(list) {
  list.forEach(function(listItem) {
    let link = $(`<a href="#${listItem.slug}">${listItem.slug}</a>`)
    $(".list").append(link);
  });
}

function editEntry(slug) {
  vinkCms.s3.getObject(vinkCms.s3.getDataBucket(), slug, onEntryReceived);
}

function deleteEntry(slug) {
  vinkCms.s3.deleteObject(slug, onEntryDelete);
}

function onEntryReceived(entry) {
  vinkCms.template.editEntry($(".form-container"), entry);
}
