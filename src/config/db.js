const mysql = require('mysql2');
require('dotenv').config();

// Configuração de uma única conexão
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

// Verificando se a conexão foi estabelecida
connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar no banco de dados:', err);
        process.exit(1);  // Finaliza a aplicação em caso de erro na conexão
    } else {
        console.log('Conexão bem-sucedida com o banco de dados');
    }
});


module.exports = connection.promise();
