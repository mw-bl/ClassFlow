// Controle do modal
const registerModal = document.getElementById('registerModal');
const closeRegisterModal = document.getElementById('closeRegisterModal');

// Função para abrir o modal
const openModal = () => {
  registerModal.style.display = 'block';
};

// Função para fechar o modal
const closeModal = () => {
  registerModal.style.display = 'none';
};

// Abra o modal automaticamente quando a página carregar
window.onload = openModal;

// Quando o "X" de fechar for clicado
closeRegisterModal.addEventListener('click', closeModal);

// Quando o clique fora do modal ocorrer, também fecha
window.addEventListener('click', (event) => {
  if (event.target === registerModal) {
    closeModal();
  }
});

// Lógica do formulário de cadastro
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = document.getElementById('username').value.trim();
  const matricula = document.getElementById('matricula').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const senha = document.getElementById('registerPassword').value.trim();
  const curso = document.getElementById('curso').value.trim();

  if (!nome || !matricula || !email || !senha || !curso) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.style.display = 'block';
    errorMessage.textContent = 'Todos os campos devem ser preenchidos.';
    return;
  } else {
    document.getElementById('errorMessage').style.display = 'none';
  }

  const aluno = { nome, matricula, email, senha, curso };

  try {
    const response = await fetch('http://localhost:3000/api/alunos/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(aluno),
    });

    const data = await response.json();
    if (response.ok) {
      alert(data.message || 'Cadastro realizado com sucesso!');
      closeModal();
      window.location.href = 'login.html';
    } else {
      throw new Error(data.error || 'Erro desconhecido ao registrar.');
    }
  } catch (error) {
    console.error('Erro no registro:', error);
    alert('Erro no registro: ' + error.message);
  }
});
