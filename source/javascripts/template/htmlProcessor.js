vinkCms.htmlProcessor = (function() {

  function generate(entry) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          ${getMeta(entry)}
        </head>
        <body>
          ${generateContent(entry.content)}
        </body>
      </html>
    `.replace(/(\r\n|\n|\r)/gm,"").trim();
  }

  function getMeta(entry) {
    let meta = entry.meta;
    let metaString = "";
    metaString += `<title>${meta.title.val}</title>`;
    metaString += `<meta property="og:title" content="${meta.title.val}" />`;
    metaString += `<meta property="og:description" content="${meta.description.val}" />`;
    metaString += `<meta property="og:image" content="${entry.siteUrl}${meta.image.val}" />`;
    metaString += `<meta property="og:url" content="${entry.siteUrl}${meta.image.val}" />`;
    return metaString;
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
