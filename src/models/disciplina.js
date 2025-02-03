const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Ajuste o caminho conforme necessário

const Disciplinas = sequelize.define(
  'Disciplinas', // Nome do modelo
  {
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    codigo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cargaHoraria: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descricao: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'andamento', // Valor padrão para status
    },
    alunoId: {
      type: DataTypes.INTEGER, // Relacionamento com o aluno
      allowNull: false,
    },
  },
  {
    tableName: 'disciplinas', // Define o nome exato da tabela no banco de dados
    freezeTableName: true, // Impede que o Sequelize altere o nome da tabela
  }
);

module.exports = Disciplinas;
