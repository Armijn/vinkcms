myTemplate = {
  name: "My template",
  siteUrl: "https://example.com",
  css: "stylesheets/site.css",
  javascript: "javascripts/script.js",
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
      containerAttr: { id: "layout", class: "content-container active" },
      content: [
        {
          type: "markDownTextArea",
          containerAttr: { class: "intro" },
          img: {
            orgsize: { width: 786, height: 786 },
            srcset: ["160w","250w", "560w", "768w"],
            sizes: "(max-width: 560px) 560px, (max-width: 384px) 384px, 768px"
          },
          name: "content",
          exportToJson: true,
          label: "Intro section",
          attr: { placeholder: "Intro" }
        },
        {
          containerAttr: { class: "links" },
          content: [
            {
              type: "input",
              text: "See on map",
              containerAttr: { class: "see-map" },
              attr: { placeholder: "See map link" }
            },
            {
              type: "linkInput",
              text: "Order online",
              containerAttr: { class: "order" },
              attr: { placeholder: "Order link" }
            },
            {
              type: "linkInput",
              text: "Book a table",
              containerAttr: { class: "book" },
              attr: { placeholder: "Book table link" }
            },
            {
              type: "linkInput",
              text: "Go to website",
              containerAttr: { class: "website" },
              attr: { placeholder: "Website link" }
            }
          ]
        },
        {
          containerAttr: { class: "info" },
          content: [
            {
              type: "markDownTextArea",
              containerAttr: { class: "ingredients" },
              label: "Ingredients"
            },
            {
              type: "markDownTextArea",
              containerAttr: { class: "thoughts" },
              label: "Our thoughts"
            },
            {
              type: "markDownTextArea",
              containerAttr: { class: "conclusion" },
              label: "Conclusion"
            }
          ]
        },
        {
          type: "markDownTextArea",
          containerAttr: { id: "entry" },
          img: {
            orgsize: { width: 786, height: 786 },
            srcset: ["160w","250w", "560w", "768w"],
            sizes: "(max-width: 560px) 560px, (max-width: 384px) 384px, 768px"
          },
          label: "Review",
          attr: { placeholder: "Main content" }
        }
      ]
    }
  ]
}
