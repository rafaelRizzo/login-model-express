const db = require('../config/db'); // Importando o db para poder manipular o banco

// Classe para manipular o usuário no banco de dados
class UserModel {
    // Busca um usuário pelo nome de usuário
    async findByUsername(username) {
        const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        return rows[0] || null;
    }

    // Cria um novo usuário se não houver duplicação do username
    async createUser(username, password) {
        const existingUser = await this.findByUsername(username); // Verifica se o usuário já existe

        if (existingUser) {
            throw new Error('Username já em uso');
        }

        const [result] = await db.query(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, password]
        );
        return result.insertId; // Retorna o ID do usuário recém-criado
    }

    // Busca um usuário pelo ID
    async findById(userId) {
        const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
        if (rows[0]) {
            return rows[0];
        } else {
            throw new Error('Usuário não encontrado');
        }
    }

    // Atualiza dados de um usuário pelo ID
    async updateUser(userId, username) {

        // Verifica se já existe outro usuário com o novo username, mas não o próprio usuário
        const [rows] = await db.query(
            'SELECT * FROM users WHERE username = ? AND id != ?',
            [username, userId]
        );

        // Se o array `rows` não estiver vazio, significa que o username já está em uso por outro usuário
        if (rows.length > 0) {
            console.log("Username já em uso.")
            throw new Error('Username já em uso');
        }

        // Se o username não existir, atualiza o usuário com o novo username
        await db.query('UPDATE users SET username = ? WHERE id = ?', [username, userId]);
    }

    // Exclui um usuário pelo ID
    async deleteUser(userId) {
        await db.query('DELETE FROM users WHERE id = ? LIMIT 1', [userId]);
    }

    // Função para atualizar o token no banco de dados
    async updateToken(userId, token) {
        await db.query('UPDATE users SET token = ? WHERE id = ? LIMIT 1', [token, userId]);
    }
}

module.exports = new UserModel();
