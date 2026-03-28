import express from "express";
export const docsRouter = express.Router();

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>ecommerceAPI — Swagger UI</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css" />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
    <script>
      window.onload = function () {
        SwaggerUIBundle({
          url: '/openapi.yaml',
          dom_id: '#swagger-ui',
          deepLinking: true,
        });
      };
    </script>
  </body>
</html>`;

docsRouter.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.send(html);
});
