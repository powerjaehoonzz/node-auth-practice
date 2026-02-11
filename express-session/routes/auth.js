const express = require("express");
const router = express.Router();
const path = require("path");
const sanitizeHtml = require("sanitize-html");
const fs = require("fs");
const template = require("../lib/template");

const authData = {
  email: "test@test.com",
  password: "12341234",
  nickname: "test",
};

router.get("/login", (req, res) => {
  const title = "WEB - login";
  const list = template.list(req.list);
  const html = template.HTML(
    title,
    list,
    `
          <form action="/auth/login_process" method="post">
            <p><input type="text" name="email" placeholder="email"></p>
            <p><input type="password" name="password" placeholder="password"></p>
            <p>
              <input type="submit" value="login">
            </p>
          </form>
        `,
    "",
  );
  res.send(html);
});

router.post("/login_process", (req, res) => {
  const [email, password] = [req.body.email, req.body.password];
  if (email !== authData.email || password !== authData.password) {
    return res.send("Login Failed!!");
  }
  req.session.is_logined = true;
  req.session.nickname = authData.nickname;
  req.session.save(() => {
    res.redirect(`/`);
  });
});

router.get("/update/:pageId", (req, res) => {
  const filteredId = path.parse(req.params.pageId).base;
  fs.readFile(`data/${filteredId}`, "utf8", function (err, description) {
    const title = req.params.pageId;
    const list = template.list(req.list);
    const html = template.HTML(
      title,
      list,
      `
            <form action="/topic/update_process" method="post">
              <input type="hidden" name="id" value="${title}">
              <p><input type="text" name="title" placeholder="title" value="${title}"></p>
              <p>
                <textarea name="description" placeholder="description">${description}</textarea>
              </p>
              <p>
                <input type="submit">
              </p>
            </form>
            `,
      `<a href="/topic/create">create</a> <a href="/topic/update/${title}">update</a>`,
    );
    res.send(html);
  });
});

router.post("/update_process", (req, res) => {
  const post = req.body;
  const id = post.id;
  const title = post.title;
  const description = post.description;
  fs.rename(`data/${id}`, `data/${title}`, function (error) {
    fs.writeFile(`data/${title}`, description, "utf8", function (err) {
      res.redirect(`/topic/${title}`);
    });
  });
});

router.post("/delete_process", (req, res) => {
  const post = req.body;
  const id = post.id;
  const filteredId = path.parse(id).base;
  fs.unlink(`data/${filteredId}`, function (error) {
    res.redirect("/");
  });
});

router.get("/:pageId", (req, res, next) => {
  const filteredId = path.parse(req.params.pageId).base;
  fs.readFile(`data/${filteredId}`, "utf8", (error, description) => {
    if (error) {
      if (error.code === "ENOENT") {
        return res.status(404).send("404 Not Found");
      }
      return next(error);
    }
    const title = req.params.pageId;
    const sanitizedTitle = sanitizeHtml(title);
    const sanitizedDescription = sanitizeHtml(description, {
      allowedTags: ["h1"],
    });
    const list = template.list(req.list);
    const html = template.HTML(
      sanitizedTitle,
      list,
      `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
      ` <a href="/topic/create">create</a>
            <a href="/topic/update/${sanitizedTitle}">update</a>
            <form action="/topic/delete_process" method="post">
              <input type="hidden" name="id" value="${sanitizedTitle}">
              <input type="submit" value="delete">
            </form>`,
    );
    res.send(html);
  });
});
module.exports = router;
