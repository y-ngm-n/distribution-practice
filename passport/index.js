const passport = require("passport");

const local = require("./localStrategy");
const kakao = require("./kakaoStrategy");
const Users = require("../models/Users");

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    const user = await Users.findOne("id", id);
    if (user) done(null, user);
    else done({ err: "user not exist" });
  });

  local();
  kakao();
};