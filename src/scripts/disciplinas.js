document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = './login.html';
      return;
    }
  
    const listaDisciplinas = document.getElementById('listaDisciplinas');
  
    // Carregar disciplinas
    async function carregarDisciplinas() {
      listaDisciplinas.innerHTML = '';
      try {
        const response = await fetch('http://localhost:3000/api/disciplinas', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Erro ao carregar disciplinas.');
  
        const disciplinas = await response.json();
        disciplinas.forEach((disciplina) => {
          const li = document.createElement('li');
          li.innerHTML = `
            <strong>${disciplina.nome}</strong> (${disciplina.codigo}) - ${disciplina.carga_horaria} horas
            <button data-id="${disciplina.id}" class="editar">Editar</button>
            <button data-id="${disciplina.id}" class="excluir">Excluir</button>
          `;
          listaDisciplinas.appendChild(li);
        });
  
        // Adicionar eventos aos botões
        document.querySelectorAll('.editar').forEach((button) =>
          button.addEventListener('click', (e) => editarDisciplina(e.target.dataset.id))
        );
        document.querySelectorAll('.excluir').forEach((button) =>
          button.addEventListener('click', (e) => excluirDisciplina(e.target.dataset.id))
        );
      } catch (error) {
        console.error(error);
        alert('Erro ao carregar disciplinas.');
      }
    }
  
    // Adicionar disciplina
    document.getElementById('formDisciplina').addEventListener('submit', async (e) => {
      e.preventDefault();
      const nome = document.getElementById('nome').value;
      const codigo = document.getElementById('codigo').value;
      const cargaHoraria = document.getElementById('cargaHoraria').value;
      const descricao = document.getElementById('descricao').value;
  
      try {
        const response = await fetch('http://localhost:3000/api/disciplinas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ nome, codigo, carga_horaria: cargaHoraria, descricao }),
        });
        if (!response.ok) throw new Error('Erro ao adicionar disciplina.');
        await carregarDisciplinas();
      } catch (error) {
        console.error(error);
        alert('Erro ao adicionar disciplina.');
      }
    });
  
    // Excluir disciplina
    async function excluirDisciplina(id) {
      try {
        const response = await fetch(`http://localhost:3000/api/disciplinas/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Erro ao excluir disciplina.');
        await carregarDisciplinas();
      } catch (error) {
        console.error(error);
        alert('Erro ao excluir disciplina.');
      }
    }
  
    // Voltar para a página inicial
    document.getElementById('voltar').addEventListener('click', () => {
      window.location.href = './home.html';
    });
  
    carregarDisciplinas();
  });
  