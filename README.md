# vinkcms
Middleman amzon S3 cms

VinkCms is a static cms using the Amazon S3 javascript SDK. The reason I build this is because I like S3 in combination with cloudfront and wanted a CMS without having to worry about configuring servers, updates and deployments. This runs on [middleman](https://middlemanapp.com/).

## Features
- Imagepicker with support for srcset uploads directly to S3
- [SimpleMDE Markdown Editor](https://simplemde.com/)
- Support for multiple layouts


## Installation
### Buckets
To make the cms work you will have to create two S3 buckets. One for your data, this will be a private bucket. And one for your cms itself, this will be a public bucket.

- `data.example.com`

After creating the bucket you will have to update the `CORS` config to allow requests to this bucket.

``` xml
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
<CORSRule>
    <AllowedOrigin>*</AllowedOrigin>
    <AllowedMethod>HEAD</AllowedMethod>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedMethod>PUT</AllowedMethod>
    <AllowedMethod>POST</AllowedMethod>
    <AllowedMethod>DELETE</AllowedMethod>
    <ExposeHeader>ETag</ExposeHeader>
    <ExposeHeader>x-amz-meta-title</ExposeHeader>
    <ExposeHeader>x-amz-meta-label</ExposeHeader>
    <AllowedHeader>*</AllowedHeader>
</CORSRule>
</CORSConfiguration>
```

- `example.com`

This will be the public bucket which your website will contain. The cms will export the `HTML` to this container.

Also update the `CORS` config for this bucket.

``` xml
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
<CORSRule>
    <AllowedOrigin>*</AllowedOrigin>
    <AllowedMethod>HEAD</AllowedMethod>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedMethod>PUT</AllowedMethod>
    <AllowedMethod>POST</AllowedMethod>
    <AllowedMethod>DELETE</AllowedMethod>
    <ExposeHeader>ETag</ExposeHeader>
    <ExposeHeader>x-amz-meta-title</ExposeHeader>
    <ExposeHeader>x-amz-meta-label</ExposeHeader>
    <AllowedHeader>*</AllowedHeader>
</CORSRule>
</CORSConfiguration>
```

## Authentication
The way we authenticate is via an identity pool, we will give this role access to our private bucket. While login in the user will be asked for a `identity pool id`, this will be the key to login. It's not ideal, but for my setup it was ok. However identity pools make it really easy to implement other forms of authentication (Facebook, Google etc.) to your cms, for more info click [here](https://docs.aws.amazon.com/cognito/latest/developerguide/external-identity-providers.html).

### Creating the identity pool
**Warning:** please make sure the identity pool you create is in the same region as the buckets, otherwise this will not work.

In aws go to `cognito` and click on `Manage Identity Pools` make sure the region is set in the right top bar and create a new `Identity pool`. Check the `Enable access to unauthenticated identities` box and click `Create Pool`.

If you want to use `Authenticated identities`(Facebook, Google) to login, you can do that, but it's not yet supported in the cms, so you will have to build the handling of events in the cms yourself.

### Granting the roles permission to the buckets

In aws go to `IAM` and go to `Roles`. You will see the authentication roles setup when creating the identity pool. Click on your `Cognito_example.com_Unauth_Role` and click `Attach policies`, then click on `Create policy` and click on the tab `JSON` past in the following, replacing `example.com` with your bucket names:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:*"
            ],
            "Resource": [
                "arn:aws:s3:::example.com",
                "arn:aws:s3::: example.com/*",
                "arn:aws:s3:::data.example.com",
                "arn:aws:s3:::data.example.com/*"
            ]
        }
    ]
}
```

### Getting the identity pool id

In aws go to `IAM` and go to `Roles`. Click on your `Cognito_example.com_Unauth_Role` and click `Attach policies`, then click on tab `Trust relationships`. in the right corner will be the `pool id`, it should look something like `eu-central-1:your_long_key`. Copy this because you'll need it to authenticate.

# Configuration
## templates
template files are used to generate pages for your cms, below you'll find the options you can use. Template files can be added inside the `config.js`, for readabillity I put the `myTemplate` in a different file. You can nest content blocks to make complex layouts, just make sure it has a `content` array. 

- **name**: The name of the template
- **siteUrl**: The full site url eg: `https://example.com`
- **css**: The location of the css file that will be used for the template, eg: `stylesheets/site.css`
- **javascript**: The location of the javascript file that will be used for the template, eg: `javascripts/script.js`
- **prefix**: A prefix for the template, used to save the template in a specific directory, eg: `reviews/`
- **json**: An array of content blocks, used to save data to a specific json file. It will be saved to `./vinkcms/data.json` inside the bucket
	- **type**: `input`, `linkInput`, `textarea`, `markDownTextArea`
	- **name**: name of the json attribute
	- **attr**: attributes used on the cms item, handy for placeholder text or html validation. eg: `{ placeholder: "My text",  required: true }`
- **meta**: An array of content blocks, used to build the head
- **content**: An array of content blocks, used to build up the body
	- **type**: `input`, `linkInput`, `textarea`, `markDownTextArea`
	- **containerAttr**: Attributes that will be injected on the container in the exported html
	- **img**: When using this on `input` or `markDownTextArea` you will be able to upload images to s3, scrset is supported and it will upload the images in different sizes as you provide them
		- **orgsize**: The original size of the image, eg: `{ width: 786, height: 786 }`
		- **srcset**: An array with srcsets, only `w` is currently supported. eg: `["160w","250w", "560w", "768w"]`
		- **sizes**: Sizes attributes, will be injected in the exported `img`. eg: `(max-width: 560px) 560px, (max-width: 384px) 384px, 768px`
		- **name**: Only use in combination with `exportToJson: true`
		- **exportToJson**: Also exports the value to the json file
		- **label**: Label for the cms item
		- **attr**: attributes used on the cms item, handy for placeholder text or html validation. eg: `{ placeholder: "My text",  required: true }`

## Example template
```javascript
{
  name: "My template",
  siteUrl: "https://example.com",
  css: "stylesheets/site.css",
  javascript: "javascripts/script.js",
  prefix: "",
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
  meta: {
    otherMeta: {
      type: "textarea",
      attr: { placeholder: "Other meta" }
    }
  },
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
              type: "linkInput",
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
```