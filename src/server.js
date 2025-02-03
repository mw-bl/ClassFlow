const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const Aluno = require('./models/aluno');
const Disciplinas = require('./models/disciplina');

const sequelize = require('./config/database');

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/alunos', require('./routes/aluno'));
app.use('/api/disciplinas', require('./routes/disciplina'));

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

(async () => {
    try {
      await sequelize.sync({ alter: true }); // 'alter' atualiza o banco sem apagar dados
      console.log('Banco de dados sincronizado!');
    } catch (error) {
      console.error('Erro ao sincronizar o banco de dados:', error);
    }
  })();