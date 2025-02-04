document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Você precisa fazer login.");
    window.location.href = "./login.html";
    return;
  }

  const mainContent = document.getElementById("main-content");
  const modal = document.getElementById("modal");
  const btnAbrirModal = document.getElementById("btnAbrirModal");
  const btnFecharModal = document.querySelector(".close");
  const formDisciplina = document.getElementById("formDisciplina");
  const listaDisciplinas = document.getElementById("listaDisciplinas");
  const filtroStatus = document.getElementById("filtro");

  // Buscar informações do aluno
  async function carregarPerfil() {
    try {
      const response = await fetch("http://localhost:3000/api/alunos/perfil", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Erro ao carregar informações do aluno.");
      }

      const aluno = await response.json();
      mainContent.innerHTML = `
        <h1>Oi, ${aluno.nome}!</h1>
        <p>Vamos gerenciar a sua vida acadêmica?</p>
      `;
    } catch (error) {
      console.error("Erro ao carregar informações:", error);
      alert("Erro ao carregar informações. Faça login novamente.");
      localStorage.removeItem("token");
      window.location.href = "./login.html";
    }
  }

  // Função para carregar disciplinas do banco
  async function carregarDisciplinas() {
    try {
      const response = await fetch("http://localhost:3000/api/disciplinas/listar", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Erro ao carregar disciplinas.");
      }

      const disciplinas = await response.json();
      listaDisciplinas.innerHTML = ""; // Limpa a lista antes de adicionar

      disciplinas.forEach((disciplina) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <span>${disciplina.nome} (${disciplina.codigo})</span> - <em>${disciplina.status}</em>
        `;
        listaDisciplinas.appendChild(li);
      });
    } catch (error) {
      console.error("Erro ao carregar disciplinas:", error);
    }
  }

  // Abrir Modal
  btnAbrirModal.addEventListener("click", () => {
    modal.style.display = "block";
  });

  // Fechar Modal
  btnFecharModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Fechar modal ao clicar fora
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // Adicionar nova disciplina
  formDisciplina.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nomeDisciplina = document.getElementById("nome").value.trim();
    const codigoDisciplina = document.getElementById("codigo").value.trim();
    const cargaHorariaDisciplina = document.getElementById("cargaHoraria").value.trim();
    const descricaoDisciplina = document.getElementById("descricao").value.trim();
    const statusDisciplina = document.getElementById("status").value;

    if (nomeDisciplina && codigoDisciplina && cargaHorariaDisciplina && descricaoDisciplina) {
      try {
        const response = await fetch("http://localhost:3000/api/disciplinas/cadastrar", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            nome: nomeDisciplina,
            codigo: codigoDisciplina,
            cargaHoraria: cargaHorariaDisciplina,
            descricao: descricaoDisciplina,
            status: statusDisciplina,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Erro ao cadastrar disciplina.");
        }

        console.log("Disciplina cadastrada com sucesso!");

        // Atualizar lista de disciplinas
        carregarDisciplinas();

        // Limpar formulário
        formDisciplina.reset();
        modal.style.display = "none";

      } catch (error) {
        console.error("Erro ao cadastrar disciplina:", error);
        alert("Erro ao cadastrar disciplina.");
      }
    } else {
      alert("Todos os campos são obrigatórios!");
    }
  });

  // Filtro por status
  filtroStatus.addEventListener("change", () => {
    const status = filtroStatus.value;
    const todasDisciplinas = listaDisciplinas.querySelectorAll("li");

    todasDisciplinas.forEach((disciplina) => {
      const statusDisciplina = disciplina.querySelector("em").textContent.toLowerCase();
      if (status === "todos" || status === statusDisciplina) {
        disciplina.style.display = "block";
      } else {
        disciplina.style.display = "none";
      }
    });
  });

  // Carregar perfil e disciplinas ao iniciar
  carregarPerfil();
  carregarDisciplinas();
});
