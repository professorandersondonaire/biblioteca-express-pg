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


// ------------------- CRUD AUTOR -------------------
app.get('/autores', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM autor');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao buscar autores');
  }
});

app.get('/autores/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM autor WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).send('Autor não encontrado');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao buscar autor por ID');
  }
});

app.post('/autores', async (req, res) => {
  const { nome, nacionalidade } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO autor (nome, nacionalidade) VALUES ($1, $2) RETURNING *',
      [nome, nacionalidade]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao criar autor');
  }
});

app.put('/autores/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, nacionalidade } = req.body;
  try {
    const result = await pool.query(
      'UPDATE autor SET nome = $1, nacionalidade = $2 WHERE id = $3 RETURNING *',
      [nome, nacionalidade, id]
    );
    if (result.rows.length === 0) return res.status(404).send('Autor não encontrado');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao atualizar autor');
  }
});

app.delete('/autores/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM autor WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).send('Autor não encontrado');
    res.send('Autor deletado com sucesso');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao deletar autor');
  }
});

// ------------------- CRUD LIVRO -------------------
app.get('/livros', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM livro');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao buscar livros');
  }
});

app.get('/livros/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM livro WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).send('Livro não encontrado');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao buscar livro por ID');
  }
});

app.post('/livros', async (req, res) => {
  const { titulo, ano_publicacao, fk_autor_id, fk_categoria_id, disponivel } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO livro (titulo, ano_publicacao, fk_autor_id, fk_categoria_id, disponivel) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [titulo, ano_publicacao, fk_autor_id, fk_categoria_id, disponivel ?? true]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao criar livro');
  }
});

app.put('/livros/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, ano_publicacao, fk_autor_id, fk_categoria_id, disponivel } = req.body;
  try {
    const result = await pool.query(
      'UPDATE livro SET titulo = $1, ano_publicacao = $2, fk_autor_id = $3, fk_categoria_id = $4, disponivel = $5 WHERE id = $6 RETURNING *',
      [titulo, ano_publicacao, fk_autor_id, fk_categoria_id, disponivel, id]
    );
    if (result.rows.length === 0) return res.status(404).send('Livro não encontrado');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao atualizar livro');
  }
});

app.delete('/livros/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM livro WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).send('Livro não encontrado');
    res.send('Livro deletado com sucesso');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao deletar livro');
  }
});

// ------------------- CRUD ALUNO -------------------
app.get('/alunos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM aluno');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao buscar alunos');
  }
});

app.get('/alunos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM aluno WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).send('Aluno não encontrado');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao buscar aluno por ID');
  }
});

app.post('/alunos', async (req, res) => {
  const { nome, turma, idade } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO aluno (nome, turma, idade) VALUES ($1, $2, $3) RETURNING *',
      [nome, turma, idade]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao criar aluno');
  }
});

app.put('/alunos/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, turma, idade } = req.body;
  try {
    const result = await pool.query(
      'UPDATE aluno SET nome = $1, turma = $2, idade = $3 WHERE id = $4 RETURNING *',
      [nome, turma, idade, id]
    );
    if (result.rows.length === 0) return res.status(404).send('Aluno não encontrado');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao atualizar aluno');
  }
});

app.delete('/alunos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM aluno WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).send('Aluno não encontrado');
    res.send('Aluno deletado com sucesso');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao deletar aluno');
  }
});

// ------------------- CRUD EMPRESTIMO -------------------
app.get('/emprestimos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM emprestimo');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao buscar empréstimos');
  }
});

app.get('/emprestimos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM emprestimo WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).send('Empréstimo não encontrado');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao buscar empréstimo por ID');
  }
});

app.post('/emprestimos', async (req, res) => {
  const { fk_livro_id, fk_aluno_id, data_emprestimo, data_devolucao } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO emprestimo (fk_livro_id, fk_aluno_id, data_emprestimo, data_devolucao) VALUES ($1, $2, $3, $4) RETURNING *',
      [fk_livro_id, fk_aluno_id, data_emprestimo, data_devolucao]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao criar empréstimo');
  }
});

app.put('/emprestimos/:id', async (req, res) => {
  const { id } = req.params;
  const { fk_livro_id, fk_aluno_id, data_emprestimo, data_devolucao } = req.body;
  try {
    const result = await pool.query(
      'UPDATE emprestimo SET fk_livro_id = $1, fk_aluno_id = $2, data_emprestimo = $3, data_devolucao = $4 WHERE id = $5 RETURNING *',
      [fk_livro_id, fk_aluno_id, data_emprestimo, data_devolucao, id]
    );
    if (result.rows.length === 0) return res.status(404).send('Empréstimo não encontrado');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao atualizar empréstimo');
  }
});

app.delete('/emprestimos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM emprestimo WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).send('Empréstimo não encontrado');
    res.send('Empréstimo deletado com sucesso');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao deletar empréstimo');
  }
});




app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
