const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.get('/', (req, res) => {
  res.send('API de Biblioteca com PostgreSQL e Express!');
});

// Listar todas as categorias
app.get('/categorias', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categoria');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao buscar categorias');
  }
});

// Buscar categoria por ID
app.get('/categorias/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM categoria WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).send('Categoria não encontrada');
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao buscar categoria por ID');
  }
});

// Criar uma nova categoria
app.post('/categorias', async (req, res) => {
  const { nome } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO categoria (nome) VALUES ($1) RETURNING *',
      [nome]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao criar categoria');
  }
});

// Atualizar uma categoria pelo id
app.put('/categorias/:id', async (req, res) => {
  const id = req.params.id;
  const { nome } = req.body;
  try {
    const result = await pool.query(
      'UPDATE categoria SET nome = $1 WHERE id = $2 RETURNING *',
      [nome, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send('Categoria não encontrada');
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao atualizar categoria');
  }
});

// Deletar uma categoria pelo id
app.delete('/categorias/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query(
      'DELETE FROM categoria WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send('Categoria não encontrada');
    }
    res.send('Categoria deletada com sucesso');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao deletar categoria');
  }
});


/*

fazer aqui o crud dessas tabelas (select, insert, update, delete)
aluno
autor
emprestimo
livro

*/



app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
