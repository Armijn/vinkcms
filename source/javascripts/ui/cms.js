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
        showEdit();
        editEntry($(this).attr("id"));
      });

      let slug = window.location.hash.replace("#", "");
      if(slug !== "") {
        onItemPreview(slug);
      } else {
        $(".js-actions").removeClass("active");
      }
    });
  }

  return {
    init: init
  };
}());

function onItemPreview(slug) {
  showPreview();
  $(".js-actions").addClass("active");
  $(".js-edit-entry-item").attr("id", slug);
  $(".js-preview iframe").attr('src', vinkCms.s3.getUrlFor(slug));
}

function showPreview() {
  $(".js-preview").addClass("active");
  $(".js-entry").removeClass("active");
}

function showEdit() {
  $(".js-preview").removeClass("active");
  $(".js-entry").addClass("active");
}

function onNavClick(templateId) {
  showEdit();
  vinkCms.template.newEntry($(".form-container"), vinkCms.templates[templateId]);
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

function onEntryReceived(entry) {
  vinkCms.template.editEntry($(".form-container"), entry);
}
