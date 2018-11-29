"use strict"
let vinkCms = {
  templates: [
    {
      name: "My template",
      siteUrl: "https://example.com",
      css: "/stylesheets/site.css",
      json: [
        {
          type: "input",
          name: "lat",
          attr: { placeholder: "Lat" }
        },
        {
          type: "input",
          name: "lng",
          attr: { placeholder: "Lng" }
        }
      ],
      content: [
        {
          containerAttr: { id: "layout", class: "content-container" },
          content: [
            {
              containerAttr: { class: "intro" },
              content: [
                {
                  name: "restaurant",
                  type: "input",
                  containerAttr: { class: "restaurant" },
                  attr: { placeholder: "Restaurant" }
                },
                {
                  type: "input",
                  containerAttr: { class: "burger" },
                  attr: { placeholder: "Burger name" }
                },
                {
                  type: "input",
                  containerAttr: { class: "score" },
                  attr: { placeholder: "Score", type: "number", step: "0.10" }
                },
                {
                  type: "input",
                  containerAttr: { class: "image" },
                  isImage: true,
                  img: {
                    orgsize: { width: 786, height: 786 },
                    srcset: ["384w", "768w"],
                    sizes: "(min-width: 768px) 768px, 100vw"
                  },
                  attr: { placeholder: "Image" }
                },
                {
                  type: "input",
                  containerAttr: { class: "price" },
                  attr: { placeholder: "Price", type: "number", step: "0.10" }
                }
              ]
            },
            {
              type: "input",
              containerAttr: { class: "see-map" },
              attr: { placeholder: "See map link" }
            },
            {
              type: "input",
              containerAttr: { class: "order" },
              attr: { placeholder: "Order link" }
            },
            {
              type: "input",
              containerAttr: { class: "book" },
              attr: { placeholder: "Book table link" }
            },
            {
              type: "input",
              containerAttr: { class: "website" },
              attr: { placeholder: "Website link" }
            },
            {
              type: "markDownTextArea",
              containerAttr: { class: "ingredients" },
              attr: { placeholder: "Ingredients" }
            },
            {
              type: "markDownTextArea",
              containerAttr: { class: "thoughts" },
              attr: { placeholder: "Thoughts" }
            },
            {
              type: "markDownTextArea",
              containerAttr: { class: "recap" },
              attr: { placeholder: "In short" }
            },
            {
              type: "markDownTextArea",
              containerAttr: { class: "main-content" },
              img: {
                orgsize: { width: 786, height: 786 },
                srcset: ["384w", "768w"],
                sizes: "(min-width: 768px) 768px, 100vw"
              },
              attr: { placeholder: "Main content" }
            }
          ]
        }
      ]
    }
  ]
};
