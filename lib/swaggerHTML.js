'use strict';

const swaggerHTML = apiPath =>
  `

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Swagger UI</title>
  <link href="https://cdn.bootcss.com/swagger-ui/3.22.1/swagger-ui.css" rel="stylesheet">
  <style>
    html
    {
        box-sizing: border-box;
        overflow: -moz-scrollbars-vertical;
        overflow-y: scroll;
    }
    *,
    *:before,
    *:after
    {
        box-sizing: inherit;
    }
    body {
      margin:0;
      background: #fafafa;
    }

  </style>
</head>

<body>
  <div id="swagger-ui"></div>
  <script src="https://cdn.bootcss.com/swagger-ui/3.22.1/swagger-ui-bundle.js"></script>
  <script src="https://cdn.bootcss.com/swagger-ui/3.22.1/swagger-ui-standalone-preset.js"></script>
  <script>
  window.onload = function() {
    // Build a system
    const ui = SwaggerUIBundle({
      url: "${apiPath}",
      dom_id: '#swagger-ui',
      deepLinking: true,
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIStandalonePreset
      ],
      plugins: [
        SwaggerUIBundle.plugins.DownloadUrl
      ],
      layout: "StandaloneLayout"
    })
    window.ui = ui
  }
  </script>
</body>

</html>

`;
module.exports = exports = swaggerHTML;
