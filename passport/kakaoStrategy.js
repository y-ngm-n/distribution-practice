const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;

const db = require("../config/database");
const Users = require("../models/Users");


module.exports = () => {
  passport.use(new KakaoStrategy(
    {
      clientID: process.env.KAKAO_ID,
      callbackURL: "/auth/kakao/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("[kakao profile]", profile);
      try {
        const query = 'select * from users where snsId=? and provider=?';
        const result = await db.query(query, [profile.id, 'kakao']);
        const user = result[0][0];

        if (user) done(null, user);
        else {
          const newUser = {
            email: profile._json && profile._json.kakao_account_emial,
            nick: profile.displayName,
            snsId: profile.id,
            provider: 'kakao',
          };
          const query = "insert into users(email, nick, snsId, provider) value(?, ?, ?, ?)";
          await db.query(query, [newUser.email, newUser.nick, newUser.snsId, newUser.provider]);
          const user = await Users.findOne('email', newUser.email);
          done(null, user);
        }
      } catch(err) {
        console.error(err);
        done(err);
      }
    }
  ));
}