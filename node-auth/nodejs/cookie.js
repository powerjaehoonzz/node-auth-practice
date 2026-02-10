const http = require("http");
const cookie = require("cookie");

http
  .createServer(function (req, res) {
    console.log(req.headers.cookie);
    const cookies = cookie.parse(req.headers.cookie ?? "");
    console.log(cookies.yummy_cookie);
    res.writeHead(200, {
      "Set-Cookie": [
        "yummy_cookie=choco",
        "tasty_cookie=strawberry",
        `Permanent=cookies; Max-Age=${60 * 60 * 24 * 30}`,
        "Secure=Secure; Secure",
        "HttpOnly=HttpOnly; HttpOnly",
        "Path=Path; Path=/cookie",
      ],
    });
    res.end("Cookie!!");
  })
  .listen(3000);
