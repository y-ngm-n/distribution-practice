const express = require("express");

const router = express.Router();


router.get('/profile', (req, res) => {
  // res.render('profile', { title: '내 정보' });
  res.send("this is profile page");
});

router.get('/join', (req, res) => {
  res.render('join', { title: '회원 가입' });
});

router.get('/', (req, res, next) => {
  const twits = [];
  res.render('main', {
    title: "Nodebird",
    twits,
  })
});


module.exports = router;