const { z } = require("zod");

const createUserSchema = z.object({
    username: z.string().min(1, 'O nome de usuário é obrigatório'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres')
});

const updateUserSchema = z.object({
    username: z.string().min(1, 'O nome de usuário é obrigatório'),
    status: z.number().int().min(0, "Status deve ser entre 0 e 3").max(3, "Status deve ser entre 0 e 3")
});

module.exports = { createUserSchema, updateUserSchema }