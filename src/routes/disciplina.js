const express = require('express');
const Disciplinas = require('../models/disciplinas');
 // Importação correta
const Aluno  = require('../models/aluno');


const router = express.Router();

// Cadastrar disciplina
router.post('/cadastrar', async (req, res) => {
  try {
    const { nome, codigo, cargaHoraria, descricao, status, alunoId } = req.body;

    // Verifica se aluno_id foi enviado
    if (!alunoId) {
      return res.status(400).json({ error: "O campo aluno_id é obrigatório." });
    }

    // Verifica se o aluno existe no banco
    const alunoExiste = await Aluno.findByPk(alunoId);
    if (!alunoExiste) {
      return res.status(400).json({ error: "Aluno não encontrado." });
    }

    // Cadastrar disciplina
    const novaDisciplina = await Disciplina.create({
      nome,
      codigo,
      cargaHoraria,
      descricao,
      status,
      alunoId,
    });

    res.status(201).json(novaDisciplina);
  } catch (error) {
    console.error("Erro ao cadastrar disciplina:", error);
    res.status(500).json({ error: "Erro interno do servidor", detalhes: error.message });
  }
});



// Listar disciplinas
router.get('/listar',  async (req, res) => {
  try {
    const disciplinas = await Disciplina.findAll({ where: { aluno_id: req.alunoId } }); // Corrigido: Disciplina.findAll
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
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, codigo, cargaHoraria, descricao, status } = req.body;
  try {
    const disciplina = await Disciplina.findOne({ where: { id, aluno_id: req.alunoId } }); // Corrigido: Disciplina.findOne
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
router.delete('/:id',  async (req, res) => {
  const { id } = req.params;
  try {
    const disciplina = await Disciplina.findOne({ where: { id, aluno_id: req.alunoId } }); // Corrigido: Disciplina.findOne
    if (!disciplina) return res.status(404).json({ error: 'Disciplina não encontrada!' });

    await disciplina.destroy();
    res.json({ message: 'Disciplina excluída com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir disciplina', detalhes: error.message });
  }
});

module.exports = router;