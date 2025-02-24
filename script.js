document.addEventListener('DOMContentLoaded', function() {
  const btnCadastrar = document.getElementById('btnCadastrar');
  const btnHistorico = document.getElementById('btnHistorico');
  const telaCadastrar = document.getElementById('telaCadastrar');
  const telaHistorico = document.getElementById('telaHistorico');
  const form = document.querySelector('form');
  const listaHistorico = document.getElementById('listaHistorico');
  const valorTotal = document.getElementById('valorTotal');

  btnCadastrar.addEventListener('click', function() {
    telaCadastrar.style.display = 'block';
    telaHistorico.style.display = 'none';
  });

  btnHistorico.addEventListener('click', async function() {
    telaCadastrar.style.display = 'none';
    telaHistorico.style.display = 'block';
    await carregarHistorico();
  });

  form.addEventListener('submit', async function(event) {
    event.preventDefault();
    const descricao = document.getElementById('descricao').value;
    const valor = document.getElementById('valor').value;
    const data = document.getElementById('data').value;

    const response = await fetch('http://localhost:5000/despesas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ descricao, valor, data }),
    });

    if (response.ok) {
      document.getElementById('successMessage').style.display = 'block';
      setTimeout(function() {
        document.getElementById('successMessage').style.display = 'none';
      }, 3000);
      form.reset();
    } else {
      alert('Erro ao cadastrar despesa.');
    }
  });

  async function carregarHistorico() {
    const response = await fetch('http://localhost:5000/despesas');
    const despesas = await response.json();
    listaHistorico.innerHTML = '';
    let total = 0;

    despesas.forEach(function(despesa) {
      const item = document.createElement('div');
      item.className = 'historico-item';
      item.innerHTML = `
        <span>${despesa.descricao}</span>
        <span>R$ ${despesa.valor}</span>
        <span>${new Date(despesa.data).toLocaleDateString()}</span>
        <span><button class="btnExcluir" data-id="${despesa._id}">Excluir</button></span>
      `;
      listaHistorico.appendChild(item);
      total += parseFloat(despesa.valor);
    });

    valorTotal.textContent = total.toFixed(2);
  }
});