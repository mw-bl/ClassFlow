const express = require('express');
const jwt = require('jsonwebtoken');
const Disciplina = require('../models/disciplina');
const Aluno = require('../models/aluno');

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || 'chave_secreta';

// Middleware para autenticação
const autenticar = async (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'Token não fornecido!' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.alunoId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido ou expirado!' });
  }
};

// Cadastrar disciplina
router.post('/', autenticar, async (req, res) => {
  const { nome, codigo, cargaHoraria, descricao, status } = req.body;

  console.log('Dados recebidos no servidor:', { nome, codigo, cargaHoraria, descricao, status });

  if (!nome || !codigo || !cargaHoraria || !descricao) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
  }

  try {
    const novaDisciplina = await Disciplina.create({
      nome,
      codigo,
      cargaHoraria,
      descricao,
      status,
      aluno_id: req.alunoId,
    });
    res.status(201).json(novaDisciplina);
  } catch (error) {
    console.error('Erro ao cadastrar disciplina:', error);
    res.status(500).json({ error: 'Erro ao cadastrar disciplina', detalhes: error.message });
  }
});


// Listar disciplinas
router.get('/', autenticar, async (req, res) => {
  try {
    const disciplinas = await Disciplina.findAll({ where: { aluno_id: req.alunoId } });
    if (disciplinas.length === 0) {
      return res.status(404).json({ message: 'Nenhuma disciplina encontrada.' });
    }
    res.json(disciplinas);
  } catch (error) {
    console.error('Erro ao buscar disciplinas:', error);
    res.status(500).json({ error: 'Erro ao buscar disciplinas', detalhes: error.message });
  }
});


// Editar disciplina
router.put('/:id', autenticar, async (req, res) => {
  const { id } = req.params;
  const { nome, codigo, cargaHoraria, descricao, status } = req.body;
  try {
    const disciplina = await Disciplina.findOne({ where: { id, aluno_id: req.alunoId } });
    if (!disciplina) return res.status(404).json({ error: 'Disciplina não encontrada!' });

    disciplina.nome = nome;
    disciplina.codigo = codigo;
    disciplina.cargaHoraria = cargaHoraria;
    disciplina.descricao = descricao;
    disciplina.status = status;
    await disciplina.save();

    res.json({ message: 'Disciplina atualizada com sucesso!', disciplina });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar disciplina', detalhes: error.message });
  }
});

// Excluir disciplina
router.delete('/:id', autenticar, async (req, res) => {
  const { id } = req.params;
  try {
    const disciplina = await Disciplina.findOne({ where: { id, aluno_id: req.alunoId } });
    if (!disciplina) return res.status(404).json({ error: 'Disciplina não encontrada!' });

    await disciplina.destroy();
    res.json({ message: 'Disciplina excluída com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir disciplina', detalhes: error.message });
  }
});

module.exports = router;
