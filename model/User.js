const db = require('../config/db');

module.exports = class {
	static async getUser(username, password) {
		let connection = await db.getConnection();
		const rows = await connection.query(
			'SELECT userId, username FROM `user` WHERE `username` = ? AND `password` = ? LIMIT 1',
			[username, password]
		);
		if (rows.length > 0) {
			return { user: rows[0] };
		}

		return { user: null };
	}
};
