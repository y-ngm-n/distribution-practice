const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const db = require("../config/database");
const { isLoggedIn } = require("./middlewares");
const Hashtags = require("../models/Hashtags");


try {
  fs.readdirSync('uploads');
} catch(err) {
  console.error("no directory 'uploads', created one");
  fs.mkdirSync('uploads');
}

const upload = multer(
  {
    storage: multer.diskStorage(
      {
        destination(req, file, cb) { cb(null, 'uploads/'); },
        filename(req, file, cb) {
          const ext = path.extname(file.originalname);
          cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        }
      }
    ),
    limits: { fileSize: 5*1024*1024 }
  }
);


const router = express.Router();

router.post("/img", isLoggedIn, upload.single('img'), (req, res) => {
  console.log(req.file);
  res.json({ success: true, url: `/img/${req.file.filename}` });
});

router.post('/', isLoggedIn, upload.none(), async (req, res, next) => {
  const { content, url } = req.body;
  try{
    const query = "insert into posts(content, image, user) value(?, ?, ?);";
    const result = await db.query(query, [content, url, req.user.id]);
    const postId = result[0].insertId;

    const hashtags = content.match(/#[^\s#]*/g);
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map(async (hashtag) => {
          const tag = hashtag.slice(1).toLowerCase();
          const info = await Hashtags.findOne("title", tag);
          if (info) return info;
          else {
            await db.query("insert into hashtags(title) value(?)", [tag]);
            const info = await Hashtags.findOne("title", tag);
            return info;
          }
        })
      );

      result.forEach(async (hashtag) => {
        const query = "insert into postHashtag(postId, hashtagId) value(?, ?);";
        await db.query(query, [postId, hashtag.id]);
      });
    }
    res.json({ success: true, msg: "posted successfully" }); 
  } catch(err) {
    console.error(err);
    next(err);
  }
});

router.get("/hashtag", async (req, res, next) => {
  const target = decodeURIComponent(req.query.hashtag);
  if (!target) res.json({ success: false, msg: "please enter a hashtag" });
  try {
    let posts = [];
    const hashtag = await Hashtags.findOne("title", target);
    if (hashtag) {
      const query = "select posts.id, content, image, user from postHashtag, posts where hashtagId=? and posts.id=postHashtag.postId";
      const result = await db.query(query, [hashtag.id]);
      result[0].forEach(post => { posts.push(post); });
    }
    res.json({ success: true, posts });
  } catch(err) {
    console.error(err);
    return next(err);
  }
});


module.exports = router;