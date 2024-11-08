const { encryptPassword } = require('./encryption'); // Importe a função de criptografia
const db = require('../config/db'); // Sua conexão com o banco

// Esse script só servirá para criar pela primeira vez o usuário da sua aplicação, não é necessário mais após isso! 
async function criarUsuario() {
    const username = 'teste'; // Nome de usuário
    const senha = 'teste123'; // Senha do usuário

    // Criptografando a senha
    const senhaCriptografada = encryptPassword(senha);

    // Inserindo o novo usuário na tabela
    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
    try {
        const [result] = await db.query(query, [username, senhaCriptografada]);
        console.log('Usuário criado com sucesso', result);
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
    }
}

criarUsuario();
