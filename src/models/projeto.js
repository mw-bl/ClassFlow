const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Aluno = require('./aluno');

const Projeto = sequelize.define('Projeto', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  titulo: { type: DataTypes.STRING, allowNull: false },
  descricao: { type: DataTypes.TEXT, allowNull: false },
  status: { 
    type: DataTypes.ENUM('Em andamento', 'Concluído'), 
    allowNull: false, 
    defaultValue: 'Em andamento' 
  },
  notas: { type: DataTypes.TEXT, allowNull: true },
  alunoId: { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: 'projetos',
  timestamps: false
});

Projeto.belongsTo(Aluno, { foreignKey: 'alunoId' });

module.exports = Projeto;
