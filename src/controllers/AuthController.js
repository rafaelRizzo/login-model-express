const UserModel = require('../models/UserModel'); // Classe para manipular os usuários
const { generateToken, checkAndRefreshToken, decryptPassword } = require('../utils/encryption'); // Funções utilitárias
const { loginSchema } = require("../schemas/auth");

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

            console.log("Usuário logado com sucesso!");
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
