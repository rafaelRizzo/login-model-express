const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class UserModel {
    // Busca um usuário pelo nome de usuário
    async findByUsername(username) {
        try {
            const user = await prisma.users.findUnique({
                where: { username },
            });
            return user || null;
        } catch (error) {
            throw new Error('Erro ao buscar o usuário');
        }
    }

    // Cria um novo usuário se não houver duplicação do username
    async createUser(username, password) {
        try {
            const existingUser = await this.findByUsername(username);

            if (existingUser) {
                throw new Error('Username já em uso');
            }

            const newUser = await prisma.users.create({
                data: {
                    username,
                    password,
                },
            });
            return newUser.id; // Retorna o ID do usuário recém-criado
        } catch (error) {
            throw new Error('Erro ao criar o usuário');
        }
    }

    // Busca um usuário pelo ID
    async findById(userId) {
        try {
            const user = await prisma.users.findUnique({
                where: { id: Number(userId) }, // Converte o ID para número
            });

            if (!user) {
                throw new Error('Usuário não encontrado');
            }
            return user;
        } catch (error) {
            throw new Error('Erro ao buscar o usuário');
        }
    }

    // Atualiza dados de um usuário pelo ID
    async updateUser(userId, username) {
        try {
            const existingUser = await prisma.users.findFirst({
                where: {
                    username,
                    NOT: { id: Number(userId) }, // Converte o ID para número
                },
            });

            if (existingUser) {
                throw new Error('Username já em uso');
            }

            await prisma.users.update({
                where: { id: Number(userId) },
                data: { username },
            });
        } catch (error) {
            if (error.message.includes('Record to update does not exist')) {
                throw new Error('Usuário não encontrado para atualização');
            }
            throw new Error('Erro ao atualizar o usuário');
        }
    }

    // Exclui um usuário pelo ID
    async deleteUser(userId) {
        try {
            const user = await prisma.users.delete({
                where: { id: Number(userId) },
            });
            return user; // Retorna o usuário excluído
        } catch (error) {
            console.log(error)

            if (error.message.includes('Record to delete does not exist')) {
                throw new Error('Usuário não encontrado para exclusão');
            }
            throw new Error('Erro ao tentar excluir o usuário');
        }
    }

    // Função para atualizar o token no banco de dados
    async updateToken(userId, token) {
        try {
            await prisma.users.update({
                where: { id: Number(userId) },
                data: { token },
            });
        } catch (error) {
            throw new Error('Erro ao tentar atualizar o token');
        }
    }
}

module.exports = new UserModel();
