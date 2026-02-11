const auth = {
  isOwner: (req) => {
    return !!req.session.is_logined;
  },

  statusUI: (req) => {
    let authStatusUI = '<a href="/auth/login">login</a>';
    if (auth.isOwner(req)) {
      authStatusUI = `${req.session.nickname} | <a href="/auth/logout">logout</a>`;
    }
    return authStatusUI;
  },
};

module.exports = auth;
