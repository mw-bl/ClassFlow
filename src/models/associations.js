const Aluno = require('./aluno');
const Disciplinas = require('./disciplina');

function associateModels() {
  Aluno.hasMany(Disciplinas, { as: 'disciplinas', foreignKey: 'alunoId' });
  Disciplinas.belongsTo(Aluno, { as: 'aluno', foreignKey: 'alunoId' });
}

module.exports = associateModels;
