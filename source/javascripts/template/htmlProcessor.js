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
        <div class="${contentBlock.class}">${contentBlock.html}</div>`;
    });
    return contentHtml;
  }

  return {
    generate: generate
  };
}());
