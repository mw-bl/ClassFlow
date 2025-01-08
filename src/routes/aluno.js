const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Aluno = require('../models/aluno');

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || 'chave_secreta';

// Registro de alunos
router.post('/register', async (req, res) => {
  const { nome, matricula, email, senha, curso } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(senha, 10);
    const novoAluno = await Aluno.create({ 
      nome, 
      matricula, 
      email, 
      senha: hashedPassword, 
      curso 
    });
    res.status(201).json({ message: 'Aluno registrado com sucesso!' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao registrar aluno', detalhes: error.message });
  }
});

// Login de alunos
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const aluno = await Aluno.findOne({ where: { email } });
    if (!aluno) return res.status(404).json({ error: 'Aluno não encontrado!' });

    const senhaValida = await bcrypt.compare(senha, aluno.senha);
    if (!senhaValida) return res.status(401).json({ error: 'Credenciais inválidas!' });

    const token = jwt.sign({ id: aluno.id }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token, message: 'Login bem-sucedido!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro no login', detalhes: error.message });
  }
});

// Perfil do aluno autenticado
router.get('/perfil', async (req, res) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'Token não fornecido!' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const aluno = await Aluno.findByPk(decoded.id, { attributes: { exclude: ['senha'] } });
    if (!aluno) return res.status(404).json({ error: 'Aluno não encontrado!' });

    res.json(aluno);
  } catch (error) {
    res.status(401).json({ error: 'Token inválido ou expirado!' });
  }
});

module.exports = router;
