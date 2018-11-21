"use strict"
let vinkCms = {
  templates: [
    {
      name: "My template",
      meta: {
        twitter: {
          type: "input"
        }
      },
      content: [
        {
          type: "markDownTextArea",
          class: "main-content"
        },
        {
          type: "textArea",
          class: "other-block"
        },
        {
          type: "input",
          class: "other-block"
        }
      ]
    }
  ]
};
