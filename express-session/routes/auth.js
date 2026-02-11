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

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    res.redirect("/");
  });
});

module.exports = router;
