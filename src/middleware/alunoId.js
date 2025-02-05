// middleware/alunoId.js

module.exports = (req, res, next) => {
    // Verifica onde o alunoId pode estar:
    const alunoId = req.body.alunoId || req.params.alunoId || req.query.alunoId;
  
    // Se não encontrar o alunoId, retorna um erro
    if (!alunoId) {
      return res.status(400).json({ error: 'Aluno ID não fornecido.' });
    }
  
    // Adicionar alunoId à requisição
    req.alunoId = alunoId;
  
    // Continuar para a próxima etapa
    next();
  };
  