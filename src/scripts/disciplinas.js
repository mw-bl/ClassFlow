document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Você precisa fazer login.");
    window.location.href = "./login.html";
    return;
  }

  // Carregar o nome do usuário
  try {
    const response = await fetch('http://localhost:3000/api/alunos/perfil', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Erro da API:', error);
      throw new Error('Erro ao carregar informações do aluno.');
    }

    const aluno = await response.json();
    console.log('Dados do aluno:', aluno);

    // Atualizar o título com o nome do aluno
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
      <h1>Oi, ${aluno.nome}!</h1>
      <p>Vamos gerenciar a sua vida acadêmica?</p>
    `;
  } catch (error) {
    console.error('Erro ao carregar informações:', error);
    alert('Erro ao carregar informações. Faça login novamente.');
    localStorage.removeItem('token');
    window.location.href = './login.html';
  }

  const listaDisciplinas = document.getElementById("listaDisciplinas");
  const btnAbrirModal = document.getElementById("btnAbrirModal");
  const btnFecharModal = document.querySelector(".close");
  const formDisciplina = document.getElementById("formDisciplina");
  const filtroStatus = document.getElementById("filtro");
  const modal = document.getElementById("modal");

  async function carregarDisciplinas() {
    try {
      const response = await fetch("http://localhost:3000/api/disciplinas/disciplinas", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Erro ao carregar disciplinas.");

      const disciplinas = await response.json();
      listaDisciplinas.innerHTML = ""; // Limpa a lista antes de adicionar

      disciplinas.forEach((disciplina) => {
        const li = document.createElement("li");
      
        // Define a classe de status com base no valor do status
        let statusClass = "";
        switch (disciplina.status.toLowerCase()) {
          case "pendente":
            statusClass = "status-pendente";
            break;
          case "em andamento":
            statusClass = "status-andamento";
            break;
          case "concluída":
            statusClass = "status-concluida";
            break;
          default:
            statusClass = "";
        }
      
        li.innerHTML = `
          <div class="disciplina-content">
            <img src="../assets/icons/Icone_Disciplinas.png" alt="Ícone da disciplina" class="disciplina-icon">
            <div class="disciplina-info">
              <span class="disciplina-nome">${disciplina.nome}</span>
              <span class="disciplina-codigo">COD: ${disciplina.codigo}</span>
              <p class="disciplina-carga">CARGA HORÁRIA: ${disciplina.cargaHoraria} horas</p>
            </div>
            <span class="disciplina-status ${statusClass}">${disciplina.status}</span>
          </div>
        `;
      
        listaDisciplinas.appendChild(li);
      });
    } catch (error) {
      console.error(error);
    }
  }

  formDisciplina.addEventListener("submit", async (event) => {
    event.preventDefault();
  
    const nome = document.getElementById("nome").value.trim();
    const codigo = document.getElementById("codigo").value.trim();
    const cargaHoraria = document.getElementById("cargaHoraria").value.trim();
    const descricao = document.getElementById("descricao").value.trim();
    const status = document.getElementById("status").value; // Captura o valor selecionado
    console.log("Status selecionado:", status);  // Verifique o que está sendo exibido aqui
  
    const alunoId = JSON.parse(atob(localStorage.getItem("token").split(".")[1])).id;
  
    // Validando se todos os campos estão preenchidos corretamente
    if (!nome || !codigo || !cargaHoraria || !descricao || !status) {
      alert("Por favor, preencha todos os campos.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:3000/api/disciplinas/cadastrar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome, 
          codigo, 
          cargaHoraria, 
          descricao, 
          status,  // Certifique-se de que o status está sendo enviado aqui
          alunoId,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erro ao cadastrar disciplina:", errorData);
        alert(errorData.error || "Erro ao cadastrar disciplina.");
        return;
      }
  
      alert("Disciplina cadastrada com sucesso!");
      carregarDisciplinas();
      formDisciplina.reset();
      modal.style.display = "none";
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  });
  

  btnAbrirModal.addEventListener("click", () => {
    modal.style.display = "block";
  });

  btnFecharModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  filtroStatus.addEventListener("change", () => {
    const status = filtroStatus.value;
    const todasDisciplinas = listaDisciplinas.querySelectorAll("li");

    todasDisciplinas.forEach(disciplina => {
      const statusDisciplina = disciplina.querySelector(".disciplina-status").textContent;
      disciplina.style.display = (status === "todos" || status === statusDisciplina) ? "block" : "none";
    });
  });

  carregarDisciplinas();
});