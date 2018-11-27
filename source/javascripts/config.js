"use strict"
let vinkCms = {
  templates: [
    {
      name: "My template",
      siteUrl: "https://example.com",
      json: [
        {
          type: "input",
          name: "lat",
          attr: { placeholder: "Lat", required: true }
        },
        {
          type: "input",
          name: "lng",
          attr: { placeholder: "Lng", required: true }
        },
        {
          type: "input",
          name: "price",
          attr: { placeholder: "Price", required: true, type: "number", step: "0.10" }
        },
        {
          type: "input",
          name: "rating",
          attr: { placeholder: "Rating", required: true, type: "number", step: "0.10" }
        }
      ],
      content: [
        {
          type: "markDownTextArea",
          class: "main-content",
          img: {
            orgsize: { width: 786, height: 786 },
            srcset: ["384w", "768w"],
            sizes: "(min-width: 768px) 768px, 100vw"
          },
          attr: { placeholder: "Main content", required: true }
        },
        {
          type: "textarea",
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
