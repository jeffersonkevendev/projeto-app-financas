// Selecionando os elementos
const btnCadastrar = document.getElementById('btnCadastrar');
const btnHistorico = document.getElementById('btnHistorico');
const telaCadastrar = document.getElementById('telaCadastrar');
const telaHistorico = document.getElementById('telaHistorico');
const listaHistorico = document.getElementById('listaHistorico');
const seletorMes = document.getElementById('mes');
const valorTotal = document.getElementById('valorTotal');
const successMessage = document.getElementById('successMessage');

// Exibe a tela de cadastro
btnCadastrar.addEventListener('click', () => {
  telaCadastrar.classList.add('active');
  telaHistorico.classList.remove('active');
});

// Exibe a tela de histórico
btnHistorico.addEventListener('click', () => {
  telaHistorico.classList.add('active');
  telaCadastrar.classList.remove('active');
});

// Função para formatar a data no formato DD/MM/YYYY
function formatarData(data) {
  const [ano, mes, dia] = data.split('-');  // Divide a data no formato YYYY-MM-DD
  return `${dia}/${mes}/${ano}`;  // Retorna no formato DD/MM/YYYY
}

// Função para atualizar o valor total das despesas
function atualizarValorTotal() {
  const itensHistorico = listaHistorico.querySelectorAll('.lista-item');
  let total = 0;

  itensHistorico.forEach(item => {
    if (item.style.display !== 'none') {
      const valor = item.querySelector('span:nth-child(2)').textContent.replace('R$ ', '').replace(',', '.');
      total += parseFloat(valor);
    }
  });

  valorTotal.textContent = total.toFixed(2).replace('.', ',');
}

// Função para cadastrar despesa
const form = telaCadastrar.querySelector('form');
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const descricao = form.descricao.value;
  let valor = form.valor.value;  // O valor recebido como string

  // Substituir vírgula por ponto, se necessário
  valor = valor.replace(",", ".");

  const data = form.data.value;  // Obtendo a data no formato YYYY-MM-DD

  // Verificando se a data foi fornecida corretamente
  if (!data) {
    alert("Por favor, insira uma data válida.");
    return;
  }

  // Formatando a data para o formato DD/MM/YYYY
  const dataFormatada = formatarData(data);

  // Convertendo o valor para número
  const valorFormatado = parseFloat(valor).toFixed(2);  // Garantindo duas casas decimais

  // Verificando se o valor é um número válido
  if (isNaN(valorFormatado)) {
    alert("Por favor, insira um valor válido.");
    return;
  }

  // Criando um item de histórico
  const divItem = document.createElement('div');
  divItem.classList.add('lista-item');

  // Exibindo o valor com vírgula no lugar do ponto
  const valorComVirgula = valorFormatado.replace(".", ",");

  // Adicionando os dados na estrutura de colunas
  divItem.innerHTML = `
    <span>${descricao}</span>
    <span>R$ ${valorComVirgula}</span>  <!-- Exibindo o valor com vírgula -->
    <span>${dataFormatada}</span>
    <span class="acoes">
      <i class="fas fa-edit btn-editar"></i>
      <i class="fas fa-trash btn-excluir"></i>
    </span>
  `;

  // Adicionando o item no histórico
  listaHistorico.appendChild(divItem);

  // Adicionando eventos aos ícones de editar e excluir
  const btnEditar = divItem.querySelector('.btn-editar');
  const btnExcluir = divItem.querySelector('.btn-excluir');

  btnEditar.addEventListener('click', () => editarDespesa(divItem));
  btnExcluir.addEventListener('click', () => excluirDespesa(divItem));

  // Atualizando o valor total das despesas
  atualizarValorTotal();

  // Exibindo a mensagem de sucesso
  successMessage.style.display = 'block';
  setTimeout(() => {
    successMessage.style.display = 'none';
    // Mudando para a tela de histórico após a mensagem de sucesso desaparecer
    telaCadastrar.classList.remove('active');
    telaHistorico.classList.add('active');
  }, 3000); // Oculta a mensagem após 3 segundos

  // Limpando o formulário
  form.reset();
});

// Função para editar despesa
function editarDespesa(item) {
  const descricao = item.querySelector('span:nth-child(1)').textContent;
  const valor = item.querySelector('span:nth-child(2)').textContent.replace('R$ ', '').replace(',', '.');
  const data = item.querySelector('span:nth-child(3)').textContent.split('/').reverse().join('-');

  form.descricao.value = descricao;
  form.valor.value = valor;
  form.data.value = data;

  telaCadastrar.classList.add('active');
  telaHistorico.classList.remove('active');

  // Remover o item da lista ao editar
  item.remove();
  atualizarValorTotal();
}

// Função para excluir despesa
function excluirDespesa(item) {
  item.remove();
  atualizarValorTotal();
}

// Função para filtrar histórico por mês
seletorMes.addEventListener('change', () => {
  const mesSelecionado = seletorMes.value;
  const itensHistorico = listaHistorico.querySelectorAll('.lista-item');

  itensHistorico.forEach(item => {
    const data = item.querySelector('span:nth-child(3)').textContent;
    const mes = data.split('/')[1];  // Obtendo o mês da data no formato DD/MM/YYYY

    if (mes === mesSelecionado) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });

  // Atualizando o valor total das despesas
  atualizarValorTotal();
});