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













// const UserModel = require('../models/UserModel'); // Classe para manipular os usuários
// const { generateToken, checkAndRefreshToken, decryptPassword, encryptPassword } = require('../utils/encryption'); // Funções utilitárias
// const { loginSchema, createUserSchema, updateUserSchema } = require("../schemas/user")

// class AuthController {
//     // Login do usuário
//     async login(req, res) {
//         try {
//             // Validando o corpo da requisição com Zod
//             const parseResult = loginSchema.safeParse(req.body);

//             if (!parseResult.success) {
//                 return res.status(400).json({ error: parseResult.error.errors[0].message });
//             }

//             const { username, password } = req.body;

//             const user = await UserModel.findByUsername(username);
//             if (!user) {
//                 return res.status(401).json({ error: 'Usuário não encontrado' });
//             }

//             const decryptedPassword = decryptPassword(user.password);
//             if (decryptedPassword !== password) {
//                 return res.status(401).json({ error: 'Senha inválida' });
//             }

//             let token = user.token;
//             if (token) {
//                 token = await checkAndRefreshToken(token, user);
//             } else {
//                 token = generateToken({ id: user.id, username: user.username });
//                 await UserModel.updateToken(user.id, token);
//             }

//             console.log("Usuário logado com sucesso!")
//             res.status(200).json({
//                 user: {
//                     id: user.id,
//                     username: user.username,
//                     nome_atendente: user.nome_atendente,
//                     token
//                 }
//             });
//         } catch (error) {
//             console.error(error); // Para ajudar no debug durante o desenvolvimento
//             res.status(500).json({ error: 'Erro ao processar login. Tente novamente mais tarde.' });
//         }
//     }

//     // Criação de usuário
//     async createUser(req, res) {
//         try {
//             const parseResult = createUserSchema.safeParse(req.body);
//             if (!parseResult.success) {
//                 return res.status(400).json({ error: parseResult.error.errors[0].message });
//             }

//             const { username, password } = req.body;
//             // Criptografando a senha
//             const senhaCriptografada = encryptPassword(password);

//             // Refatorando para verificar antes de inserir
//             const userId = await UserModel.createUser(username, senhaCriptografada);

//             if (!userId) {
//                 return res.status(400).json({ error: 'Já existe um usuário com esse nome de usuário.' });
//             }

//             return res.status(201).json({ userId });
//         } catch (error) {
//             console.error(error);
//             res.status(500).json({ error: 'Erro ao criar usuário.' });
//         }
//     }

//     // Busca de usuário pelo ID
//     async getUserById(req, res) {
//         try {
//             const user = await UserModel.findById(req.params.id);
//             if (!user) {
//                 return res.status(404).json({ error: 'Usuário não encontrado' });
//             }

//             res.status(200).json(user);
//         } catch (error) {
//             console.error(error);
//             res.status(500).json({ error: 'Erro ao buscar usuário.' });
//         }
//     }

//     // Atualização de usuário
//     async updateUser(req, res) {
//         try {
//             const parseResult = updateUserSchema.safeParse(req.body);
//             if (!parseResult.success) {
//                 return res.status(400).json({ error: parseResult.error.errors[0].message });
//             }

//             const { username } = req.body;
//             const userId = req.params.id;

//             await UserModel.updateUser(userId, username);
//             res.status(200).json({ message: 'Usuário atualizado com sucesso' });
//         } catch (error) {
//             console.error(error);
//             res.status(500).json({ error: 'Erro ao atualizar usuário.' });
//         }
//     }

//     // Exclusão de usuário
//     async deleteUser(req, res) {
//         try {
//             const userId = req.params.id;

//             await UserModel.deleteUser(userId);
//             res.status(200).json({ message: 'Usuário excluído com sucesso' });
//         } catch (error) {
//             console.error(error);
//             res.status(500).json({ error: 'Erro ao excluir usuário.' });
//         }
//     }
// }

// module.exports = new AuthController();