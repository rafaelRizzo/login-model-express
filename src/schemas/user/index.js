const { z } = require("zod");

const createUserSchema = z.object({
    username: z.string().min(1, 'O nome de usuário é obrigatório'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres')
});

const updateUserSchema = z.object({
    username: z.string().min(1, 'O nome de usuário é obrigatório'),
});

module.exports = { createUserSchema, updateUserSchema }