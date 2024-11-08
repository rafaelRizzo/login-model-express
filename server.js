const express = require('express');
const helmet = require('helmet'); // Para permitir requisições de diferentes origens, se necessário
const cors = require('cors'); // Para permitir requisições de diferentes origens, se necessário
const dotenv = require('dotenv');
const authRoutes = require('./src/routes/authRoutes'); // Rota de autenticação

dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env

const app = express();
const port = process.env.PORT || 3000;

// Middleware para permitir o uso de JSON nas requisições
app.use(express.json());

// Middleware de CORS (opcional, dependendo do seu uso)
app.use(cors());
app.use(helmet());

// Usar as rotas de autenticação
app.use('/', authRoutes);

// Caso precise de uma rota para testar se o servidor está funcionando
app.get('/', (req, res) => {
    res.send('API rodando!');
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
