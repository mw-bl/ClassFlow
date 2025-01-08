document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = './login.html';
      return;
    }
  
    // Obter informações do aluno
    try {
      const response = await fetch('http://localhost:3000/api/alunos/perfil', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Erro ao carregar informações do aluno.');
  
      const aluno = await response.json();
      const userInfoDiv = document.getElementById('user-info');
      userInfoDiv.innerHTML = `
        <p>Nome: ${aluno.nome}</p>
        <p>Matrícula: ${aluno.matricula}</p>
        <p>Curso: ${aluno.curso}</p>
      `;
    } catch (error) {
      console.error(error);
      alert('Erro ao carregar informações. Faça login novamente.');
      localStorage.removeItem('token');
      window.location.href = './login.html';
    }
  });
  
  // Botão para gerenciar disciplinas
  document.getElementById('gerenciarDisciplinas').addEventListener('click', () => {
    window.location.href = './disciplinas.html';
  });
  
  // Botão de logout
  document.getElementById('logout').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = './login.html';
  });
  