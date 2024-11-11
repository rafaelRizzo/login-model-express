const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();

const encryptPassword = (password) => {
    if (typeof password !== 'string') {
        throw new Error('A senha deve ser uma string.');
    }

    const secretKey = process.env.SECRET_KEY_CRYPTO

    if (!secretKey || secretKey.length !== 64 || !/^[a-fA-F0-9]{64}$/.test(secretKey)) {
        throw new Error('A chave secreta deve estar definida e ter 64 caracteres hexadecimais.');
    }

    const iv = crypto.randomBytes(16); // Inicialização do vetor de 16 bytes
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey, 'hex'), iv);

    let encrypted = cipher.update(password, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return iv.toString('hex') + ':' + encrypted; // Retorna o IV junto com o texto criptografado
}

const decryptPassword = (encryptedPassword) => {
    const parts = encryptedPassword.split(':');
    if (parts.length !== 2) {
        throw new Error('Formato de senha criptografada inválido.');
    }

    const iv = Buffer.from(parts[0], 'hex');
    const encryptedText = parts[1];
    const secretKey = process.env.SECRET_KEY_CRYPTO;

    if (!secretKey || secretKey.length !== 64 || !/^[a-fA-F0-9]{64}$/.test(secretKey)) {
        throw new Error('A chave secreta deve estar definida e ter 64 caracteres hexadecimais.');
    }

    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey, 'hex'), iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

const generateToken = (user) => {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN; 
    return jwt.sign({ id: user.id, username: user.username }, secret, { expiresIn });
}

const verifyToken = (token) => {
    const secret = process.env.JWT_SECRET;
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
}

// Essa função valida se o token é ainda válido pelas próximas 7 horas
const checkAndRefreshToken = async (currentToken, user) => {
    try {
        const decoded = await verifyToken(currentToken);
        const expirationThreshold = 7 * 60 * 60 * 1000; // 7 horas em milissegundos

        if (decoded.exp * 1000 - Date.now() <= expirationThreshold) {
            const newToken = generateToken(user);
            await UserModel.updateToken(user.id, newToken);
            return newToken;
        }

        return currentToken;
    } catch (err) {
        return generateAndUpdateToken(user);
    }
}

const generateAndUpdateToken = async (user) => {
    const newToken = generateToken(user);
    await UserModel.updateToken(user.id, newToken);
    return newToken;
}

module.exports = { encryptPassword, decryptPassword, generateToken, verifyToken, checkAndRefreshToken };