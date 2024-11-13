# Este é um projeto de autenticação de usuários utilizando Prisma com MySQL. 

    O projeto tem como objetivo demonstrar ou servidor como base de como integrar o Prisma com o banco de dados MySQL para realizar operações de CRUD (Create, Read, Update, Delete) em uma tabela de usuários, incluindo funcionalidades de login, registro e gerenciamento de tokens JWT.
    
Tecnologias Utilizadas

    [Node.js]: Plataforma para execução de JavaScript no servidor.
    
    [Prisma]: ORM (Object-Relational Mapping) para facilitar a interação com o banco d  e dados.

    [MySQL]: Banco de dados relacional utilizado para armazenar os dados dos usuári os.

    [JWT (JSON Web Token)]: Sistema de autenticação utilizando tokens para validação de sessão  de usuários.

Configuração do Projeto

### 1. Pré-requisitos

    Node.js instalado na sua máquina.
    MySQL instalado e configurado.

### 2. Instalação

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
npm install
```
### 3. Configuração do Banco de Dados

    Crie um banco de dados MySQL para o seu projeto.
    Configure a URL de conexão com o banco de dados no arquivo .env:

DATABASE_URL="mysql://usuario_mysql:senha_mysql@host_mysql:port_mysql/nome_da_database"

Substitua as variáveis pelos valores corretos:

    usuario_mysql: Nome de usuário do MySQL.
    senha_mysql: Senha do usuário do MySQL.
    host_mysql: O endereço do host do banco de dados MySQL.
    port_mysql: A porta onde o MySQL está rodando (geralmente 3306).
    nome_da_database: O nome do banco de dados a ser utilizado.

4. Configuração do Prisma ORM

    Gerar o Cliente Prisma: Após definir os modelos no arquivo prisma/schema.prisma, rode o seguinte comando para gerar o Prisma Client:

```npx prisma generate```

    Criar e Aplicar Migrações: Com o Prisma configurado, execute o comando abaixo para gerar a primeira migração e aplicá-la ao banco de dados:

```npx prisma migrate dev --name init```

Esse comando faz o seguinte:

    Gera os scripts de migração com base nos modelos definidos no schema.prisma.
    Aplica as migrações no banco de dados MySQL.

5. Variáveis de Ambiente

Configure as variáveis de ambiente no arquivo .env:

```PORT=3000
JWT_SECRET=batata
JWT_EXPIRES_IN=7d
SECRET_KEY_CRYPTO=<SUA_CHAVE_CRYPTO_AQUI>
DATABASE_URL="mysql://usuario_mysql:senha_mysql@host_mysql:port_mysql/nome_da_database"
```

    PORT: A porta em que o servidor vai rodar (padrão: 3000).
    JWT_SECRET: Chave secreta para a assinatura de tokens JWT.
    JWT_EXPIRES_IN: Tempo de expiração do token JWT.
    SECRET_KEY_CRYPTO: Chave secreta para criptografar e descriptografar senhas.
    DATABASE_URL: URL de conexão com o banco de dados MySQL.

Nota: Certifique-se de não deixar a chave SECRET_KEY_CRYPTO vazia. Ela deve ser uma chave aleatória de 64 caracteres para garantir a segurança na criptografia das senhas.
6. Rodando a Aplicação

Para rodar a aplicação localmente, use o seguinte comando:

```npx nodemon server.js```

Esse comando iniciará o servidor e você poderá acessar a aplicação em http://localhost:3000.
Funcionalidades Implementadas

    Registro de Usuários: Os usuários podem se registrar fornecendo um nome de usuário e senha. A senha é criptografada antes de ser armazenada no banco de dados.
    Login: Os usuários podem fazer login utilizando o nome de usuário e senha. Um token JWT é gerado e retornado para autenticação em requisições futuras.
    Gerenciamento de Tokens JWT: O sistema permite a validação e renovação de tokens JWT para manter a sessão dos usuários ativa.

Contribuições

Sinta-se à vontade para contribuir com este projeto! Você pode abrir issues para relatar bugs ou sugerir melhorias, ou criar pull requests para implementar novas funcionalidades.
Licença

Este projeto está licenciado sob a MIT License - veja o arquivo LICENSE para mais detalhes.