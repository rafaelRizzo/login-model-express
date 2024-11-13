const UserModel = require('../models/UserModel'); // Classe para manipular os usuários
const { encryptPassword } = require('../utils/encryption'); // Funções utilitárias
const { createUserSchema, updateUserSchema } = require("../schemas/user");

class UserController {
    // Criação de usuário
    async createUser(req, res) {
        try {
            // Validando o corpo da requisição com Zod
            const parseResult = createUserSchema.safeParse(req.body);
            if (!parseResult.success) {
                return res.status(400).json({ error: parseResult.error.errors[0].message });
            }

            const { username, password } = req.body;
            // Criptografando a senha
            const senhaCriptografada = encryptPassword(password);

            // Verificando se já existe um usuário com o mesmo username
            const existingUser = await UserModel.findByUsername(username);
            if (existingUser) {
                return res.status(400).json({ error: 'O nome de usuário informado já está em uso. Escolha outro.' });
            }

            // Criando o usuário
            const userId = await UserModel.createUser(username, senhaCriptografada);

            return res.status(201).json({
                message: 'Usuário criado com sucesso',
                user: {
                    id: userId,
                    username
                }
            });
        } catch (error) {
            console.error(error);

            // Para qualquer erro específico, retornamos uma mensagem específica
            if (error.message) {
                return res.status(400).json({ error: error.message });
            }

            // Para qualquer outro erro, retornamos um erro genérico
            res.status(500).json({ error: 'Erro ao criar usuário.' });
        }
    }

    // Busca de usuário pelo ID
    async getUserById(req, res) {
        try {
            const user = await UserModel.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            res.status(200).json(user);
        } catch (error) {
            console.error(error);

            // Para qualquer erro específico, retornamos uma mensagem específica
            if (error.message) {
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: 'Erro ao buscar usuário.' });
        }
    }

    // Atualização de usuário
    async updateUser(req, res) {
        try {
            const parseResult = updateUserSchema.safeParse(req.body);
            if (!parseResult.success) {
                return res.status(400).json({ error: parseResult.error.errors[0].message });
            }

            const { username, status } = req.body; // Agora recebemos o status do corpo da requisição
            const userId = req.params.id;

            // Tenta atualizar o usuário com o novo username e status
            await UserModel.updateUser(userId, username, status);

            res.status(200).json({ message: 'Usuário atualizado com sucesso' });
        } catch (error) {
            console.error(error);

            // Para qualquer erro específico, retornamos uma mensagem específica
            if (error.message) {
                return res.status(400).json({ error: error.message });
            }

            // Para qualquer outro erro, retornamos um erro genérico
            res.status(500).json({ error: 'Erro ao atualizar usuário.' });
        }
    }

    // Exclusão de usuário
    async deleteUser(req, res) {
        try {
            const userId = req.params.id;

            await UserModel.deleteUser(userId);
            res.status(200).json({ message: 'Usuário excluído com sucesso' });
        } catch (error) {
            console.error(error);

            // Para qualquer erro específico, retornamos uma mensagem específica
            if (error.message) {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: 'Erro ao excluir usuário.' });
        }
    }
}

module.exports = new UserController();
