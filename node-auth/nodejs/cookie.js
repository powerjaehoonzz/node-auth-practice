var http = require("http");
var cookie = require("cookie");

http
  .createServer(function (req, res) {
    console.log(req.headers.cookie);
    if (!req.headers.cookie) {
      res.writeHead(401);
      res.end("No Cookie!!");
      return;
    }
    var cookies = cookie.parse(req.headers.cookie);
    console.log(cookies.yummy_cookie);
    res.writeHead(200, {"Set-Cookie": ["yummy_cookie=choco", "tasty_cookie=strawberry"]});

    res.end("Cookie!!");
  })
  .listen(3000);
