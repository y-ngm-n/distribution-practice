const dotenv = require("dotenv");
const mysql = require("mysql2/promise");
const logger = require("./logger");


dotenv.config();

const initDB = async (db) => {
  const result = await db.query(`show databases like '${process.env.DB_NAME}';`);
  const info = result[0][0];
  if (info === undefined) {
    const query = "\
create database " + process.env.DB_NAME + ";\
use " + process.env.DB_NAME + ";\
create table users (\
id int not null auto_increment,\
email varchar(40),\
nick varchar(15) not null,\
password varchar(100) not null,\
provider varchar(10) not null default 'local',\
snsId varchar(30),\
primary key (id)\
) charset utf8mb4;\
create table posts (\
id int not null auto_increment,\
content varchar(140) not null,\
image varchar(200),\
user int not null,\
primary key (id),\
foreign key (user) references users(id)\
) charset utf8mb4;\
create table hashtags (\
id int not null auto_increment,\
title varchar(15) not null,\
primary key (id)\
) charset utf8mb4;\
create table domains (\
id int not null auto_increment,\
user int not null,\
host varchar(80) not null,\
type enum('free', 'premium') not null,\
clientSecret varchar(36) not null,\
primary key (id),\
foreign key (user) references users(id)\
) charset utf8mb4;\
create table follow (\
id int not null auto_increment,\
followingUser int not null,\
followedUser int not null,\
primary key (id),\
foreign key (followingUser) references users(id),\
foreign key (followedUser) references users(id)\
);\
create table postHashtag (\
id int not null auto_increment,\
postId int not null,\
hashtagId int not null,\
primary key (id),\
foreign key (postId) references posts(id),\
foreign key (hashtagId) references hashtags(id)\
  );\
";
    await db.query(query);
    logger.info("database initialized!");
  } else { await db.query("use " + process.env.DB_NAME + ";"); }
}

const env = {
  "dev": {
    host: "127.0.0.1",
    user: "root",
    password: process.env.DB_PASSWORD,
    multipleStatements: true
  },
  "test": {
    host: "127.0.0.1",
    user: "root",
    password: process.env.DB_PASSWORD,
    multipleStatements: true
  },
  "production": {
    host: "127.0.0.1",
    user: "root",
    password: process.env.DB_PASSWORD,
    multipleStatements: true
  },
};

const db = mysql.createPool(env[process.env.NODE_ENV]);
initDB(db);


module.exports = db;