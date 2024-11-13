// routes/authRoutes.js
const express = require('express');
const UserController = require('../controllers/UserController');
const router = express.Router();

// Rota de criação de usuário
router.post('/users', UserController.createUser);

// Rota de busca de usuário por ID
router.get('/users/:id', UserController.getUserById);

// Rota de atualização de usuário
router.put('/users/:id', UserController.updateUser);

// Rota de exclusão de usuário
router.delete('/users/:id', UserController.deleteUser);

module.exports = router;
