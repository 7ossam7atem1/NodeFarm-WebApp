const fs = require("fs");
//gives us networking capabilities
const http = require("http");
const url = require("url");
const replaceTemplate = require("./modules/replaceTemplate");

//SERVER
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/templateOverview.html`,
  "utf-8"
);

const tempCard = fs.readFileSync(
  `${__dirname}/templates/templateCard.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/templateProduct.html`,
  "utf-8"
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  //Overview Page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "content-type": "text/html",
    });
    const cardsHTML = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHTML);
    res.end(output);
    //product page
  } else if (pathname === "/product") {
    res.writeHead(200, {
      "Content-Type": "text/html",
    });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
    // res.end("This is the Product Page");
    //API
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(data);
    //NOT FOUND
  } else {
    res.writeHead(404, {
      "content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>Page Not Found!</h1>");

    res.end("This page can not be found");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});
