vinkCms.htmlProcessor = (function() {

  function generate(entry) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${entry.meta.title.val}</title>
        </head>
        <body>
          ${generateContent(entry.content)}
        </body>
      </html>
    `.replace(/(\r\n|\n|\r)/gm,"").trim();
  }

  function generateContent(content) {
    let contentHtml = "";
    content.forEach(function(contentBlock) {
      contentHtml += `
        <div class="${contentBlock.class}">${getHtml(contentBlock)}</div>`;
    });
    return contentHtml;
  }

  function getHtml(contentBlock) {
    switch (contentBlock.type) {
      case "markDownTextArea":
        let conv = new showdown.Converter({metadata: true});
        return conv.makeHtml(contentBlock.val);
        break;
      default:
        return contentBlock.val;
    }
  }

  return {
    generate: generate
  };
}());
