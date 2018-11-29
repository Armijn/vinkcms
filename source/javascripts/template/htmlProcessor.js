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
    metaString += `<link rel="stylesheet" href="${entry.css}">`
    return metaString;
  }

  function generateContent(content) {
    let contentHtml = getContentContainer(content, "");
    console.log(contentHtml);
    return contentHtml;
  }

  function getContentContainer(content, html) {
    content.forEach(function(contentBlock) {
      if(contentBlock.content) {
        html += getContentHtml(contentBlock.containerAttr);
        html += getContentContainer(contentBlock.content, "");
        html += "</div>";
      } else {
        html += getContentBlockHtml(contentBlock);
      }
    });
    return html;
  }

  function getContentHtml(containerAttr) {
    let attributes = vinkCms.helper.attrToString(containerAttr);
    return `<div ${attributes}">`;
  }

  function getContentBlockHtml(contentBlock) {
    let attributes = vinkCms.helper.attrToString(contentBlock.containerAttr);
    return `<div ${attributes}">${contentBlock.html}</div>`;
  }

  return {
    generate: generate,
    generateContent: generateContent
  };
}());
