const auth = {
  isOwner: (req) => {
    return !!req.session.is_logined;
  },

  statusUI: (req) => {
    let authStatusUI = '<a href="/auth/login">login</a> | <a href="/auth/register">Register</a>';
    if (auth.isOwner(req)) {
      authStatusUI = `${req.session.nickname} | <a href="/auth/logout">logout</a>`;
    }
    return authStatusUI;
  },
  requireAuth: (req, res, next) => {
    if (!auth.isOwner(req)) {
      return res.redirect("/");
    }
    next();
  },
};

module.exports = auth;
