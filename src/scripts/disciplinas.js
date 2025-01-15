document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Token não encontrado. Redirecionando para a página de login.');
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
  
      console.log('Resposta da API (listar disciplinas):', response);
  
      if (!response.ok) {
        const error = await response.json();
        console.error('Erro ao carregar disciplinas:', error);
        throw new Error(error.error || 'Erro ao carregar disciplinas.');
      }
  
      const disciplinas = await response.json();
      console.log('Disciplinas carregadas:', disciplinas);
  
      disciplinas.forEach((disciplina) => {
        const li = document.createElement('li');
        li.innerHTML = `
          <strong>${disciplina.nome}</strong> (${disciplina.codigo}) - ${disciplina.cargaHoraria} horas
          <button data-id="${disciplina.id}" class="editar">Editar</button>
          <button data-id="${disciplina.id}" class="excluir">Excluir</button>
        `;
        listaDisciplinas.appendChild(li);
      });
    } catch (error) {
      console.error('Erro ao carregar disciplinas:', error);
    }
  }

  await carregarDisciplinas();

  // Adicionar evento para cadastrar nova disciplina
  document.getElementById('formCadastrarDisciplina').addEventListener('submit', async (event) => {
    event.preventDefault();
    const nome = document.getElementById('nomeDisciplina').value;
    const codigo = document.getElementById('codigoDisciplina').value;
    const cargaHoraria = document.getElementById('cargaHorariaDisciplina').value;
    const descricao = document.getElementById('descricaoDisciplina').value;
    const status = document.getElementById('statusDisciplina').value;

    console.log('Dados do formulário:', { nome, codigo, cargaHoraria, descricao, status });

    try {
      const response = await fetch('http://localhost:3000/api/disciplinas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nome, codigo, cargaHoraria, descricao, status }),
      });
  
      console.log('Resposta da API (adicionar disciplina):', response);
  
      if (!response.ok) {
        const error = await response.json();
        console.error('Erro ao adicionar disciplina:', error);
        throw new Error(error.error || 'Erro ao adicionar disciplina.');
      }
  
      const novaDisciplina = await response.json();
      console.log('Disciplina cadastrada:', novaDisciplina);
  
      // Recarregar a lista de disciplinas
      await carregarDisciplinas();
    } catch (error) {
      console.error('Erro ao adicionar disciplina:', error);
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

  // Adicionar eventos aos botões de excluir
  listaDisciplinas.addEventListener('click', async (event) => {
    if (event.target.classList.contains('excluir')) {
      const id = event.target.getAttribute('data-id');
      await excluirDisciplina(id);
    }
  });
});