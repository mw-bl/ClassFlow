const Disciplina = sequelize.define('Disciplina', {
  nome: {
    type: Sequelize.STRING,
    allowNull: false
  },
  codigo: {
    type: Sequelize.STRING,
    allowNull: false
  },
  cargaHoraria: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  descricao: {
    type: Sequelize.STRING,
    allowNull: false
  },
  status: {
    type: Sequelize.STRING,  // Ou qualquer outro tipo adequado para armazenar o status
    allowNull: false
  },
  alunoId: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
});
