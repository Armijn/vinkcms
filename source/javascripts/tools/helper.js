vinkCms.helper = (function() {
  function clone(obj) {
      if (null == obj || "object" != typeof obj) return obj;
      let copy = obj.constructor();
      for (let attr in obj) {
          if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
      }
      return copy;
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

  return {
    clone: clone,
    insertAtCaret: insertAtCaret
  };
}());
