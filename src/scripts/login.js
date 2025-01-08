document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    try {
      const response = await fetch('http://localhost:3000/api/alunos/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha: password }),
      });
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        window.location.href = './home.html';
      } else {
        alert('Erro ao fazer login: ' + data.error);
      }
    } catch (error) {
      console.error('Erro no login:', error);
    }
  });
  
  document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const aluno = {
      nome: document.getElementById('nome').value,
      matricula: document.getElementById('matricula').value,
      email: document.getElementById('registerEmail').value,
      senha: document.getElementById('registerPassword').value,
      curso: document.getElementById('curso').value,
    };
  
    try {
      const response = await fetch('http://localhost:3000/api/alunos/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aluno),
      });
      const data = await response.json();
      if (data.message) {
        alert(data.message);
      } else {
        alert('Erro ao registrar: ' + data.error);
      }
    } catch (error) {
      console.error('Erro no registro:', error);
    }
  });
  