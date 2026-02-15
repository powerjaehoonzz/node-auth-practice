const express = require("express");
const router = express.Router();
const path = require("path");
const sanitizeHtml = require("sanitize-html");
const fs = require("fs");
const template = require("../lib/template");

const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const shortid = require("shortid");
const flash = require("connect-flash");

const adapter = new FileSync("db.json");
const db = low(adapter);

db.defaults({users: []}).write();

const authData = {
  email: "test@test.com",
  password: "12341234",
  nickname: "test",
};

const registerHTML = (req, res, options = {}) => {
  const {error = "", email = "", displayName = ""} = options;

  const title = "WEB - Register";
  const list = template.list(req.list);

  const html = template.HTML(
    title,
    list,
    `
      ${error ? `<p style="color:red;">${error}</p>` : ""}
      <form action="/auth/register_process" method="post">
        <p><input type="text" name="email" placeholder="email" value="${email}"></p>
        <p><input type="password" name="password" placeholder="password"></p>
        <p><input type="password" name="confirmPassword" placeholder="confirmPassword"></p>
        <p><input type="text" name="displayName" placeholder="display name" value="${displayName}"></p>
        <p><input type="submit" value="register"></p>
      </form>
    `,
    "",
  );

  res.send(html);
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
  const {email, password} = req.body;
  if (email !== authData.email || password !== authData.password) {
    return res.send("Login Failed!!");
  }
  req.session.is_logined = true;
  req.session.nickname = authData.nickname;
  req.session.save(() => {
    res.redirect(`/`);
  });
});

router.get("/register", (req, res) => {
  registerHTML(req, res);
});

router.post("/register_process", async (req, res) => {
  const {email, password, confirmPassword, displayName} = req.body;

  if (password !== confirmPassword) {
    return registerHTML(req, res, {
      error: "Password must same!!",
      email,
      displayName,
    });
  }

  db.get("users")
    .push({
      id: shortid.generate(),
      email: email,
      password: password,
      displayName: displayName,
    })
    .write();

  res.redirect("/");
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    res.clearCookie("connect.sid");
    res.redirect("/");
  });
});

module.exports = router;
