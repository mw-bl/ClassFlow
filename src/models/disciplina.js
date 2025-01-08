const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Aluno = require('./aluno');

const Disciplina = sequelize.define('Disciplina', {
  nome: { type: DataTypes.STRING, allowNull: false },
  codigo: { type: DataTypes.STRING, allowNull: false, unique: true },
  carga_horaria: { type: DataTypes.INTEGER, allowNull: false },
  status: { type: DataTypes.ENUM('Pendente', 'Concluída'), defaultValue: 'Pendente' },
  descricao: { type: DataTypes.TEXT },
}, {
  timestamps: true,
});

Disciplina.belongsTo(Aluno, { foreignKey: 'aluno_id' });

module.exports = Disciplina;
