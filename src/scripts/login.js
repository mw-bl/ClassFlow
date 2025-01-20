// Captura os botões de abrir os modais
const openLoginModalButton = document.getElementById('openLoginModal');
const openRegisterModalButton = document.getElementById('openRegisterModal');

// Captura os modais
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');

// Captura os botões de fechar os modais
const closeLoginModalButton = document.getElementById('closeLoginModal');
const closeRegisterModalButton = document.getElementById('closeRegisterModal');

// Função para abrir o modal de login
openLoginModalButton.addEventListener('click', () => {
  loginModal.style.display = 'block';
});

// Função para abrir o modal de cadastro
openRegisterModalButton.addEventListener('click', () => {
  registerModal.style.display = 'block';
});

// Função para fechar o modal de login
closeLoginModalButton.addEventListener('click', () => {
  loginModal.style.display = 'none';
});

// Função para fechar o modal de cadastro
closeRegisterModalButton.addEventListener('click', () => {
  registerModal.style.display = 'none';
});

// Fechar o modal ao clicar fora dele
window.addEventListener('click', (event) => {
  if (event.target === loginModal) {
    loginModal.style.display = 'none';
  }
  if (event.target === registerModal) {
    registerModal.style.display = 'none';
  }
});

// Captura o evento de envio do formulário de login
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

      // Navegar para a página inicial (home)
      window.electronAPI.navigate('home.html');
    } else {
      alert('Erro ao fazer login: ' + data.error);
    }
  } catch (error) {
    console.error('Erro ao fazer login:', error);
  }
});

// Exemplo de envio de mensagem para o processo principal (opcional)
window.electronAPI.logMessage('Página de login carregada com sucesso!');
