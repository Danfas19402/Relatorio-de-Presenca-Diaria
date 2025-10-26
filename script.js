const tabela = document.getElementById('tabelaPresenca');
let funcionarios = [
  "Andre Luiz dos Santos",
  "Adriano da Rocha Roque",
  "Daniel Ferreira de Almeida Silva",
  "Igor Fernando Eliseo",
  "Jean Jackson da Silva",
  "Joao Edson dos Santos",
  "Jose Carlos Trintin",
  "Lennice Lusin Bueno",
  "Leticia Serafim dos Santos",
  "Maria de Fatima de Oliveira",
  "Sueli Cristina dos Santos Silva",
  "Valdeilson Luiz da Silva"
];
let mesAtual = new Date();

function gerarTabela() {
  const ano = mesAtual.getFullYear();
  const mes = mesAtual.getMonth();
  const dias = new Date(ano, mes + 1, 0).getDate();

  let html = `<tr><th>#</th><th>Nome</th>`;
  for (let d = 1; d <= dias; d++) html += `<th>${d}</th>`;
  html += `</tr>`;

  funcionarios.forEach((nome, i) => {
    html += `<tr><td>${i + 1}</td><td>${nome}</td>`;
    for (let d = 1; d <= dias; d++) {
      html += `<td data-dia="${d}" onclick="alternarCodigo(this)"></td>`;
    }
    html += `</tr>`;
  });

  tabela.innerHTML = html;
}

function alternarCodigo(td) {
  const codigos = ["", "C", "F", "FD", "FM", "A", "FC"];
  let atual = td.textContent.trim();
  let idx = codigos.indexOf(atual);
  let novo = codigos[(idx + 1) % codigos.length];
  td.textContent = novo;
  td.className = definirCor(novo);
  salvarLocal();
}

function definirCor(codigo) {
  switch (codigo) {
    case "C": return "presenca";
    case "F": return "falta";
    case "FD": return "feriado";
    case "FM": return "folga";
    case "A": return "atestado";
    case "FC": return "folgaCompensada";
    default: return "";
  }
}

function adicionarFuncionario() {
  const nome = prompt("Digite o nome do funcionário:");
  if (nome) {
    funcionarios.push(nome);
    gerarTabela();
    salvarLocal();
  }
}

function limparTabela() {
  if (confirm("Deseja limpar todos os dados da tabela?")) {
    localStorage.removeItem("presencas");
    gerarTabela();
  }
}

function salvarLocal() {
  localStorage.setItem("presencas", tabela.innerHTML);
  localStorage.setItem("mesAtual", mesAtual.toISOString());
}

function carregarLocal() {
  const dados = localStorage.getItem("presencas");
  const mesSalvo = localStorage.getItem("mesAtual");
  if (dados) {
    tabela.innerHTML = dados;
    mesAtual = mesSalvo ? new Date(mesSalvo) : new Date();
    atualizarEventos();
  } else {
    gerarTabela();
  }
}

function atualizarEventos() {
  tabela.querySelectorAll("td[data-dia]").forEach(td => {
    td.onclick = () => alternarCodigo(td);
  });
}

function exportarCSV() {
  let csv = [];
  tabela.querySelectorAll("tr").forEach(tr => {
    let row = [];
    tr.querySelectorAll("th,td").forEach(td => row.push(td.innerText));
    csv.push(row.join(","));
  });
  const blob = new Blob([csv.join("\n")], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "relatorio-presenca.csv";
  a.click();
}

function exportarPDF() {
  const win = window.open('', '', 'width=900,height=600');
  win.document.write('<html><head><title>Relatório de Presença</title>');
  win.document.write('<style>table{border-collapse:collapse;width:100%;font-family:sans-serif;}th,td{border:1px solid #000;padding:4px;text-align:center;}</style>');
  win.document.write('</head><body>');
  win.document.write('<h2>Relatório de Presença Diária</h2>');
  win.document.write(tabela.outerHTML);
  win.document.write('</body></html>');
  win.document.close();
  win.print();
}

function mudarMes() {
  const mesInput = document.getElementById('mes').value;
  if (!mesInput) return;
  const [ano, mes] = mesInput.split('-');
  mesAtual = new Date(ano, mes - 1);
  document.getElementById('mesAtual').textContent =
    `${new Date(mesAtual).toLocaleString('pt-BR', { month: 'long' })} ${ano}`;
  gerarTabela();
  salvarLocal();
}

gerarTabela();
carregarLocal();


