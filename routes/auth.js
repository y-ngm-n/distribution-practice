// import modules
const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");

// import files
const db = require("../config/database");
const User = require("../models/Users");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");


const router = express.Router();


// register
router.post('/join', isNotLoggedIn, async (req, res, next) => {
  const { email, nick, password } = req.body;

  const user = await User.findOne("email", email);

  if (!user) {
    const hash = await bcrypt.hash(password, 12);
    const newUser = {
      email,
      nick,
      password: hash,
    };
    try {
      const query = 'insert into users(email, nick, password) value(?, ?, ?)';
      await db.query(query, [newUser.email, newUser.nick, newUser.password]);
      res.json({ success: true, msg: "user joined successfully" });
    } catch (err) {
      console.error(err);
      res.json({ success: false, msg: "user join failed", error: err });
    }
  }
  else res.json({ success: false, msg: "user already exist" });
});


// login
router.post('/login', isNotLoggedIn, (req, res, next) => {

  // local
  passport.authenticate("local", (authErr, user, info) => {
    if (authErr) {
      console.error(authErr);
      return next(authErr);
    }
    if (!user) { return res.json({ success: false, msg: info.msg }); }
    return req.login(user, (loginErr) => {
      if (loginErr) {
        console.error(loginErr);
        next(loginErr);
      }
      res.json({ success: true, msg: "logged in successfully" });
    });
  })(req, res, next);

});


// logout
router.get('/logout', isLoggedIn, (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    else {
      req.session.destroy();
      res.json({ success: true, msg: "logged out successfully" });
    }
  });
});


// kakao login
router.get('/kakao', passport.authenticate("kakao"));

router.get('/kakao/callback', passport.authenticate('kakao', {
  failureRedirect: '/'
}), (req, res) => {
  res.json({ success: true, msg: "kakao logged in successfully"});
});


module.exports = router;