const db = require('../config/db'); // Importando o db para poder manipular o banco

// Classe para manipular o usuário no banco de dados
class UserModel {
    async findByUsername(username) {
        const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        return rows[0] || null;
    }

    async updateToken(userId, token) {
        await db.query('UPDATE users SET token = ? WHERE id = ?', [token, userId]);
    }
}

module.exports = new UserModel();
