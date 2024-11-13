const { z } = require("zod");

// Definindo o esquema de validação com Zod
const loginSchema = z.object({
    username: z.string().min(1, 'O nome de usuário é obrigatório'), // Validação para username
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres') // Validação para senha
});

module.exports = { loginSchema }