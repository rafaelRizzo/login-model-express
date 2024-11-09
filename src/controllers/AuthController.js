const { z } = require('zod'); // Importando o Zod
const bcrypt = require('bcrypt'); // Para comparar senhas criptografadas
const UserModel = require('../models/UserModel'); // Classe para manipular os usuários
const { generateToken, checkAndRefreshToken } = require('../utils/encryption'); // Funções utilitárias

// Definindo o esquema de validação com Zod
const loginSchema = z.object({
    username: z.string().min(1, 'O nome de usuário é obrigatório'), // Validação para username
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres') // Validação para senha
});

const createUserSchema = z.object({
    username: z.string().min(1, 'O nome de usuário é obrigatório'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres')
});

const updateUserSchema = z.object({
    username: z.string().min(1, 'O nome de usuário é obrigatório'),
});

class AuthController {
    // Login do usuário
    async login(req, res) {
        try {
            // Validando o corpo da requisição com Zod
            const parseResult = loginSchema.safeParse(req.body);

            if (!parseResult.success) {
                return res.status(400).json({ error: parseResult.error.errors[0].message });
            }

            const { username, password } = req.body;

            const user = await UserModel.findByUsername(username);
            if (!user) {
                return res.status(401).json({ error: 'Usuário não encontrado' });
            }

            const decryptedPassword = decryptPassword(user.password);
            if (decryptedPassword !== password) {
                return res.status(401).json({ error: 'Senha inválida' });
            }

            let token = user.token;
            if (token) {
                token = await checkAndRefreshToken(token, user);
            } else {
                token = generateToken({ id: user.id, username: user.username });
                await UserModel.updateToken(user.id, token);
            }

            console.log("Usuário logado com sucesso!")
            res.status(200).json({
                user: {
                    id: user.id,
                    username: user.username,
                    nome_atendente: user.nome_atendente,
                    token
                }
            });
        } catch (error) {
            console.error(error); // Para ajudar no debug durante o desenvolvimento
            res.status(500).json({ error: 'Erro ao processar login. Tente novamente mais tarde.' });
        }
    }

    // Criação de usuário
    async createUser(req, res) {
        try {
            const parseResult = createUserSchema.safeParse(req.body);
            if (!parseResult.success) {
                return res.status(400).json({ error: parseResult.error.errors[0].message });
            }

            const { username, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            const userId = await UserModel.createUser(username, hashedPassword);

            res.status(201).json({ message: 'Usuário criado com sucesso', userId });
        } catch (error) {
            console.error(error);
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

            const { username } = req.body;
            const userId = req.params.id;

            await UserModel.updateUser(userId, username);
            res.status(200).json({ message: 'Usuário atualizado com sucesso' });
        } catch (error) {
            console.error(error);
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
            res.status(500).json({ error: 'Erro ao excluir usuário.' });
        }
    }
}

module.exports = new AuthController();