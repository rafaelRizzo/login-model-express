const db = require('../config/db'); // Importando o db para poder manipular o banco

// Classe para manipular o usuário no banco de dados
class UserModel {
    // Busca um usuário pelo nome de usuário
    async findByUsername(username) {
        const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        return rows[0] || null;
    }

    // Cria um novo usuário
    async createUser(username, password) {
        const [result] = await db.query(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, password]
        );
        return result.insertId;
    }

    // Busca um usuário pelo ID
    async findById(userId) {
        const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
        return rows[0] || null;
    }

    // Atualiza dados de um usuário pelo ID
    async updateUser(userId, username) {
        await db.query(
            'UPDATE users SET username = ? WHERE id = ?',
            [username, userId]
        );
    }

    // Exclui um usuário pelo ID
    async deleteUser(userId) {
        await db.query('DELETE FROM users WHERE id = ?', [userId]);
    }

    async updateToken(userId, token) {
        await db.query('UPDATE users SET token = ? WHERE id = ?', [token, userId]);
    }
}

module.exports = new UserModel();
