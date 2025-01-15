document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  console.log('Token carregado do LocalStorage:', token); // Log para verificar o token

  if (!token) {
    alert('Você precisa fazer login.');
    window.location.href = './login.html';
    return;
  }

  // Obter informações do aluno
  try {
    const response = await fetch('http://localhost:3000/api/alunos/perfil', {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log('Resposta da API:', response);

    if (!response.ok) {
      const error = await response.json();
      console.error('Erro da API:', error);
      throw new Error('Erro ao carregar informações do aluno.');
    }

    const aluno = await response.json();
    console.log('Dados do aluno:', aluno); // Log para verificar os dados recebidos

    const userInfoDiv = document.getElementById('user-info');
    userInfoDiv.innerHTML = `
      <p>Nome: ${aluno.nome}</p>
      <p>Matrícula: ${aluno.matricula}</p>
      <p>Curso: ${aluno.curso}</p>
    `;
  } catch (error) {
    console.error('Erro ao carregar informações:', error);
    alert('Erro ao carregar informações. Faça login novamente.');
    localStorage.removeItem('token');
    window.location.href = './login.html';
  }
});

// Botão para gerenciar disciplinas
document.getElementById('gerenciarDisciplinas').addEventListener('click', () => {
  console.log('Redirecionando para gerenciar disciplinas...');
  window.location.href = './disciplinas.html';
});

// Botão de logout
document.getElementById('logout').addEventListener('click', () => {
  console.log('Logout realizado. Redirecionando para login...');
  localStorage.removeItem('token');
  window.location.href = './login.html';
});
