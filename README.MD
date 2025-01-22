# Shopping API

## Apresentação

Este projeto é uma API para e-commerce, desenvolvida com o objetivo de compor um portfólio pessoal. A API foi construída utilizando tecnologias modernas e robustas, como PostgreSQL, Express.js, Prisma ORM, routing-controllers, e integração com eSitef para pagamentos via PIX, cartão de crédito e débito.

## Tecnologias Utilizadas

- ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
- ![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
- ![Prisma ORM](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
- ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
- ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

## Funcionalidades

A API dispõe de rotas públicas, privadas para clientes e privadas para gestores (lojistas). As principais funcionalidades incluem:

- **Autenticação de Usuário e Cliente**
- **CRUD de Usuários (Protegido por autenticação de usuário)**
- **CRUD de Categorias de Produtos (Protegido por autenticação de usuário)**
- **CRUD de Produtos (Protegido por autenticação de usuário)**
- **Cadastro de Cliente**
- **Listagem de Produtos (Público)**
- **Listagem de Produto por ID (Público)**
- **Listagem de Produtos Filtrado por Código e/ou Descrição (Público)**
- **Listagem de Categorias de Produto (Público)**
- **Listagem de Produtos Agrupados por Categoria (Público)**
- **Listagem de Produtos Agrupados por Categoria Filtrado por Código e/ou Descrição (Público)**
- **Pagamento (Protegido por login de cliente)**

## Configuração do Ambiente

### Arquivo 

.env



Renomeie o arquivo 

.env.example

 para 

.env

 e configure os seguintes campos:

- `ESITEF_MERCHANT_ID`: ID do lojista fornecido pela Fiserv.
- `ESITEF_MERCHANT_KEY`: Chave do lojista fornecida pela Fiserv.
- `ESITEF_URL`: URL da API eSitef fornecida pela Fiserv.
- `DATABASE_URL`: String de conexão com o banco de dados PostgreSQL.
- `PORT`: Porta em que a aplicação será executada.
- `JWT_SECRET`: Segredo utilizado para geração de tokens JWT.

### Exemplo de 

.env



```env
ESITEF_MERCHANT_ID=your-merchant-id
ESITEF_MERCHANT_KEY=your-merchant-key
ESITEF_URL=https://your-esitef-url
DATABASE_URL=postgresql://user:password@localhost:5432/shopping-api
PORT=3000
JWT_SECRET=your-jwt-secret
```

## Inicialização do Banco de Dados

Para configurar o banco de dados, execute os seguintes comandos:

1. **Instale as dependências do Node.js:**
   ```bash
   npm install
   ```

2. **Execute as migrações do Prisma:**
   ```bash
   npx prisma migrate dev
   ```

3. **Gere o Prisma Client:**
   ```bash
   npx prisma generate
   ```

4. **Popule o banco de dados com dados iniciais:**
   ```bash
   npm run seed
   ```

## Inicialização da Aplicação

Para iniciar a aplicação, execute o comando:

```bash
npm start
```

## Middleware

A API possui um middleware para tratamento de erros (

HttpErrorHandler

). Este middleware garante que todas as respostas de erro sejam padronizadas e que erros desconhecidos sejam tratados adequadamente.

---

Este projeto foi desenvolvido com foco em boas práticas de desenvolvimento, utilizando tecnologias modernas e robustas para garantir uma aplicação escalável e de fácil manutenção.
