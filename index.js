// Importa o módulo 'express', que é um framework para construir APIs web em Node.js
const express = require('express');

// Importa o módulo 'pg', que permite conectar e interagir com bancos de dados PostgreSQL
const { Pool } = require('pg');

// Carrega variáveis de ambiente do arquivo .env (por exemplo, DATABASE_URL)
require('dotenv').config();

// Inicializa o aplicativo Express
const app = express();

// Define a porta em que o servidor vai rodar (usa a variável de ambiente PORT ou 3000 como padrão)
const port = process.env.PORT || 3000;

// Middleware para permitir que o servidor entenda requisições com corpo em JSON
app.use(express.json());

/**
 * Cria uma conexão com o banco de dados PostgreSQL.
 * Usa a URL definida em DATABASE_URL no .env.
 * O parâmetro ssl com 'rejectUnauthorized: false' é necessário quando se usa hospedagens como o Render,
 * que exigem conexões seguras (SSL), mas sem validar o certificado (para evitar erro de autorização).
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // necessário para o Render
  }
});

/**
 * Rota GET na raiz ('/').
 * Apenas retorna uma mensagem de boas-vindas.
 */
app.get('/', (req, res) => {
  res.send('API de Biblioteca com PostgreSQL e Express!');
});

/**
 * Rota GET para listar todas as categorias.
 * Faz uma consulta SQL no banco de dados e retorna os resultados em formato JSON.
 * Se ocorrer erro, envia uma resposta com status 500 e mensagem de erro.
 */
app.get('/categorias', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categoria'); // Consulta todas as linhas da tabela 'categoria'
    res.json(result.rows); // Envia os dados como resposta JSON
  } catch (err) {
    console.error(err); // Loga o erro no console
    res.status(500).send('Erro ao buscar categorias'); // Envia mensagem de erro
  }
});

/**
 * Inicia o servidor e o faz escutar na porta definida.
 * Mostra no console a URL para acessar a API localmente.
 */
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
