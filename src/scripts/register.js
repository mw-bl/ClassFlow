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