const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const Users = require("../models/Users");


module.exports = () => {
  passport.use(new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await Users.findOne("email", email);
        if (user) {
          const result = await bcrypt.compare(password, user.password);
          if (result) done(null, user);
          else done(null, false, { msg: "password incorrect" });
        }
        else { done(null, false, { msg: "user not exists" }); }
      } catch (err) {
        console.error(err);
        done(err);
      }
    }
  ));
}