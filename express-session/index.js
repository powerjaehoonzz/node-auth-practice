const express = require("express");
const app = express();
const fs = require("fs");
const bodyParser = require("body-parser");
const compression = require("compression");
const topicRouter = require("./routes/topic");
const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const helmet = require("helmet");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const flash = require("connect-flash");
app.use(helmet());

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(compression());
app.use(
  session({
    secret: "asdfzxvc@!$@%",
    resave: false,
    saveUninitialized: false,
    store: new FileStore(),
  }),
);

app.use((req, res, next) => {
  fs.readdir("./data", (err, fileList) => {
    if (err) {
      return next(err);
    }
    req.list = fileList;
    next();
  });
});

app.use("/", indexRouter);
app.use("/topic", topicRouter);
app.use("/auth", authRouter);

app.use((req, res, next) => {
  res.status(404).send("404 Not Found");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("500 Error");
});

app.listen(3000, () => console.log("Example app listening on port 3000!"));
