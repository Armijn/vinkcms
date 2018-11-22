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
          class: "main-content",
          attr: { placeholder: "Main content", required: true }
        },
        {
          type: "textArea",
          placeholder: "Other block",
          class: "other-block"
        },
        {
          type: "input",
          placeholder: "Other block",
          class: "other-block"
        }
      ]
    }
  ]
};
