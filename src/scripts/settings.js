document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      alert('Você precisa fazer login.');
      window.location.href = './login.html';
      return;
    }
  
    try {
      const response = await fetch('http://localhost:3000/api/alunos/perfil', {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro ao carregar as informações:', errorText);
        throw new Error('Erro ao carregar informações do aluno');
      }
  
      const aluno = await response.json();
      console.log('Dados do aluno:', aluno);  // Verifique o formato da resposta
  
      if (!aluno || !aluno.nome || !aluno.email || !aluno.matricula || !aluno.curso) {
        console.error('Dados incompletos do aluno:', aluno);
        alert('Informações do aluno não estão completas.');
        return;
      }
  
      const userInfoDiv = document.getElementById('user-info');
      userInfoDiv.innerHTML = `
        <div class="user-profile">
          <img src="${aluno.fotoPerfil || '../assets/default-profile.jpg'}" alt="Foto do Perfil" class="profile-photo">
          <h2>${aluno.nome}</h2>
          <p>Email: ${aluno.email}</p>
          <p>Telefone: ${aluno.telefone}</p>
          <p>Matrícula: ${aluno.matricula}</p>
          <p>Curso: ${aluno.curso}</p>
          <button id="editar-info">Editar Informações</button>
        </div>
      `;
  
      const modal = document.getElementById('edit-modal');
      const nomeInput = document.getElementById('edit-nome');
      const emailInput = document.getElementById('edit-email');
      const matriculaInput = document.getElementById('edit-matricula');
      const senhaInput = document.getElementById('edit-senha');
      const cursoInput = document.getElementById('edit-curso');
      const fotoInput = document.getElementById('edit-foto');
      const saveButton = modal.querySelector('.save-btn');
      const cancelButton = modal.querySelector('.cancel-btn');
  
      document.getElementById('editar-info').addEventListener('click', () => {
        nomeInput.value = aluno.nome;
        emailInput.value = aluno.email;
        matriculaInput.value = aluno.matricula;
        cursoInput.value = aluno.curso;
        modal.style.display = 'flex'; // Mostra o modal
      });
  
      cancelButton.addEventListener('click', () => {
        modal.style.display = 'none'; // Esconde o modal
      });
  
      saveButton.addEventListener('click', async (event) => {
        event.preventDefault();
  
        const novoNome = nomeInput.value;
        const novoEmail = emailInput.value;
        const novaMatricula = matriculaInput.value;
        const novaSenha = senhaInput.value;
        const novoCurso = cursoInput.value;
        const novaFoto = fotoInput.files[0];
  
        if (!novoNome || !novoEmail || !novaMatricula || !novaSenha || !novoCurso) {
          alert('Por favor, preencha todos os campos.');
          return;
        }
  
        const formData = new FormData();
        formData.append('nome', novoNome);
        formData.append('email', novoEmail);
        formData.append('matricula', novaMatricula);
        formData.append('senha', novaSenha);
        formData.append('curso', novoCurso);
  
        if (novaFoto) {
          formData.append('foto', novaFoto);
        }
  
        try {
          const editResponse = await fetch('http://localhost:3000/api/alunos/editar', {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          });
  
          if (editResponse.ok) {
            alert('Informações atualizadas com sucesso!');
            modal.style.display = 'none';
  
            const alunoAtualizado = await editResponse.json();
            userInfoDiv.innerHTML = `
              <div class="user-profile">
                <img src="${alunoAtualizado.fotoPerfil ? `${alunoAtualizado.fotoPerfil}?t=${Date.now()}` : '../assets/default-profile.jpg'}" alt="Foto do Perfil" class="profile-photo">
                <h2>${alunoAtualizado.nome}</h2>
                <p>Email: ${alunoAtualizado.email}</p>
                <p>Telefone: ${alunoAtualizado.telefone}</p>
                <p>Matrícula: ${alunoAtualizado.matricula}</p>
                <p>Curso: ${alunoAtualizado.curso}</p>
                <button id="editar-info">Editar Informações</button>
              </div>
            `;
          } else {
            const error = await editResponse.json();
            alert(`Erro ao editar informações: ${error.message || 'Erro desconhecido'}`);
          }
        } catch (error) {
          console.error('Erro ao editar informações:', error);
          alert('Erro ao editar informações.');
        }
      });
    } catch (error) {
      console.error('Erro ao carregar informações do aluno:', error);
      alert(`Erro ao carregar as informações. Detalhes: ${error.message || 'Erro desconhecido'}`);
      localStorage.removeItem('token');
      window.location.href = './login.html';
    }
  });
  