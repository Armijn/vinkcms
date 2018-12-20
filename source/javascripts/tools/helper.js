vinkCms.helper = (function() {
  function clone(obj) {
      if (null == obj || "object" != typeof obj) return obj;
      let copy = obj.constructor();
      for (let attr in obj) {
          if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
      }
      return copy;
  }

  function slugify(str) {
    str = str.replace(/^\s+|\s+$/g, '');
    str = str.toLowerCase();

    var from = "àáãäâèéëêìíïîòóöôùúüûñç·/_,:;";
    var to   = "aaaaaeeeeiiiioooouuuunc------";
    for (let i = 0, l = from.length ; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

    return str;
  }

  function attrToString(containerAttr) {
    let stringAttr = "";
    Object.keys(containerAttr).forEach(function(key) {
      stringAttr += `${key}="${containerAttr[key]}" `;
    });
    return stringAttr;
  }

  function insertAtCaret(item, text) {
    let txtarea = item[0];
    if (!txtarea) {
      return;
    }

    let scrollPos = txtarea.scrollTop;
    let strPos = 0;
    let br = ((txtarea.selectionStart || txtarea.selectionStart == '0') ?
      "ff" : (document.selection ? "ie" : false));
    if (br == "ie") {
      txtarea.focus();
      let range = document.selection.createRange();
      range.moveStart('character', -txtarea.value.length);
      strPos = range.text.length;
    } else if (br == "ff") {
      strPos = txtarea.selectionStart;
    }

    let front = (txtarea.value).substring(0, strPos);
    let back = (txtarea.value).substring(strPos, txtarea.value.length);
    txtarea.value = front + text + back;
    strPos = strPos + text.length;
    if (br == "ie") {
      txtarea.focus();
      let ieRange = document.selection.createRange();
      ieRange.moveStart('character', -txtarea.value.length);
      ieRange.moveStart('character', strPos);
      ieRange.moveEnd('character', 0);
      ieRange.select();
    } else if (br == "ff") {
      txtarea.selectionStart = strPos;
      txtarea.selectionEnd = strPos;
      txtarea.focus();
    }

    txtarea.scrollTop = scrollPos;
  }

  function categorizeList(container, data) {
    let structure = [];
    Object.keys(data).forEach(function(key) {
      const split = key.split("/").splice(0, key.split("/").length);
      let lastItem = container;
      split.forEach(function(path) {
        if(split.indexOf(path) == split.length-1) {
          lastItem.prepend(`<a href="#${key}">${path}</a>`);
          return;
        }
        if(!lastItem.find(`.${path}`).length) {
          lastItem = $(`<div data-folder="${path}" class="${path} folder collapsed js-collapse"></div>`).appendTo(lastItem);
        } else {
          lastItem = lastItem.find(`.${path}`);
        }
      });
    });

    $(".js-collapse").click(function(e) {
      e.stopImmediatePropagation();
      $(this).toggleClass("collapsed");
    }).children().click(function(e) {
      window.location = $(this).attr("href");
      return false;
    });;
  }

  return {
    clone: clone,
    insertAtCaret: insertAtCaret,
    attrToString: attrToString,
    categorizeList: categorizeList,
    slugify: slugify
  };
}());
