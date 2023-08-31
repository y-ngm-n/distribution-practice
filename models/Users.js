const db = require('../config/database');

class Users {

  static async findOne(field, value) {
    const query = `select * from users where ${field} = ?`;
    const result = await db.query(query, [value]);
    const info = result[0][0]

    return info;
  }

}

module.exports = Users;