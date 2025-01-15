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
      console.log('Token recebido:', data.token);
      localStorage.setItem('token', data.token);
      window.location.href = './home.html';
    } else {
      alert('Erro ao fazer login: ' + data.error);
    }
  } catch (error) {
    console.error('Erro ao fazer login:', error);
  }
});