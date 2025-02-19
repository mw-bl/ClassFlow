const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Disciplina = sequelize.define('Disciplina', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  codigo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cargaHoraria: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  descricao: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  },
  alunoId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = Disciplina;