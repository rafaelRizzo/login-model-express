const { z } = require('zod'); // Importando o Zod
const UserModel = require('../models/UserModel'); // Classe para manipular os usuário
const { decryptPassword, generateToken, checkAndRefreshToken } = require('../utils/encryption'); // Funções utilitárias

// Definindo o esquema de validação com Zod
const loginSchema = z.object({
    username: z.string().min(1, 'O nome de usuário é obrigatório'), // Validação para username
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres') // Validação para senha
});

class AuthController {
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
}

module.exports = new AuthController();