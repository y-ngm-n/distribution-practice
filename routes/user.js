const express = require("express");

const { isLoggedIn } = require("./middlewares");
const db = require("../config/database");
const Users = require("../models/Users");


const router = express.Router();

router.post("/:id/follow", isLoggedIn, async (req, res, next) => {
  try {
    const user = await Users.findOne("id", req.user.id);
    if (user) {
      const query = "insert into follow(followingUser, followedUser) value(?, ?);";
      await db.query(query, [user.id, parseInt(req.params.id, 10)]);
      res.json({ success: true, msg: "follow successfully" });
    } else { res.json({ success: false, msg: "follow failed" }); }
  } catch(err) {
    console.error(err);
    next(err);
  }
});


module.exports = router;