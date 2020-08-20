//pega o CNPJ escolhido anteriormente
let meuCodigo = localStorage.getItem("num_nf");
let meuCodigoSec = localStorage.getItem("cod_ibge");
let itemSelecionado = [];



window.onload = function () {

  //preenche os campos
  document.getElementById("num_nf").value = localStorage.getItem("num_nf");

  //esta função preenche o campo de municipio
  document.getElementById("cod_ibge").value = localStorage.getItem("nome_municipio") + " - " + localStorage.getItem("uf") + " - " + localStorage.getItem("cod_ibge");

  //estes campos precisam de adaptações para utilizar de suas mascaras
  let data = localStorage.getItem("dt_nf");
  let dataSeparada = data.split("-");
  let dataEspecial = dataSeparada[2].split("T");
  document.getElementById("dt_nf").value = dataEspecial[0]+dataSeparada[1]+dataSeparada[0];

  mascara();
  adicionarItensFatura();
}



function enviar() {

  //estrutura usada para mandar as informações no fetch
  let info = {
    "dt_nf": document.getElementById("dt_nf").value,
  };

  //transforma as informações em string para mandar
  let corpo = JSON.stringify(info);
  //função fetch para mandar
  fetch(servidor + 'read/fatura/', {
    method: 'PUT',
    body: corpo,
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //checar o status do pedido
    //console.log(response);

    //tratamento dos erros
    if (response.status == 200 || response.status == 201) {
      window.location.replace("./fiscFatura.html");
    } else {
      erros(response.status);
    }
  });
}



function adicionarItensFatura(){

  //criando labels dentro do campo
  document.getElementById("tipo").innerHTML = "<option value=''>Tipo</option><option value='o'>Original</option><option value='r'>Reajuste</option>";
  document.getElementById("id_empenho").innerHTML = "<option value=''>Empenho</option>";
  document.getElementById("itens_disponiveis").innerHTML = "<option value=''>Item Selecionado</option>";

  //garantindo que os campos não sejam usados antes do preciso
  document.getElementById("id_empenho").disabled = true;
  document.getElementById("itens_disponiveis").disabled = true;
  document.getElementById("quantidade_disponivel").disabled = true;
  document.getElementById("quantidade").disabled = true;
  document.getElementById("valor").disabled = true;
}

function enabler1(){

  //unica variavel necessária aqui
  let tipo = document.getElementById("tipo").value;

  //filtro entre reajuste e original
  if(tipo=="o"){
    original();
  }
  else if(tipo=="r"){
    reajuste();
  }
}

function original(){

  fetch(servidor + 'read/itensfatura/' + meuCodigoSec, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 200) {
      return response.json().then(function (json) {
        //console.log(json);

        //variavel alterada para usar em enabler()
        itemSelecionado=json;
        
        reajusteEOriginal();
      });
    } else {
      erros(response.status);
    }
  });
}

//função separada pelo back
function reajuste(){
  fetch(servidor + 'read/itensfaturaidempenho', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 200) {
      return response.json().then(function (json) {
        //console.log(json);

        //variavel alterada para usar em enabler()
        itemSelecionado=json;
        
        reajusteEOriginal();
      });
    } else {
      erros(response.status);
    }
  });
}

function reajusteEOriginal(){

  //variaveis
  let i, j = 0;
  let empenhoID = [], empenhoCod = [], empenhoFinalID = [], empenhoFinalCod = [];

  //para filtrar e tirar repetições
  for (i = 0; i < itemSelecionado.length; i++) {

    //guardando em uma variavel para garantir que "undefined" não seja lido
    empenhoCod[i] = itemSelecionado[i].cod_empenho;
    empenhoID[i] = itemSelecionado[i].id_empenho;

    //o filtro mesmo
    if (empenhoID[i] != empenhoID[i-1]) {
      empenhoFinalID[j] = empenhoID[i];
      empenhoFinalCod[j] = empenhoCod[i];
      j++;
    }
  }

  let x = [];

  //preenche "id_empenho"
  x[0] = "<option value=''>Empenho</option>";
  for (i = 0; i < empenhoFinalID.length; i++) {

    //mudar para cod_empenho quando possivel
    x[i+1] = "<option value=" + empenhoFinalID[i] + ">" + empenhoFinalCod[i] + "</option>";
  }

  document.getElementById("id_empenho").disabled = false;

  document.getElementById("id_empenho").innerHTML = x;
}

function enabler2(){

  //variaveis
  let tipo = document.getElementById("tipo").value;
  let empenho = document.getElementById("id_empenho").value;
  let i, j = 0;
  let x = [], itemFinal = [];

  if(tipo=="o"){
    //para filtrar apenas
    for (i = 0; i < itemSelecionado.length; i++) {
      if (itemSelecionado[i].id_empenho == empenho) {
        itemFinal[j] = itemSelecionado[i];
        j++;
      }
    }
  }

  else if(tipo=="r"){
    itensReajuste(empenho);

    //apenas para adaptar a variavel à linha seguinte
    itemFinal = itemSelecionado;
  }

  //preenche "itens disponiveis"
  x[0] = "<option value='A'>Item Selecionado</option>";
  //precisa juntar os valores para pegar ambos
  for (let i = 0; i < itemFinal.length; i++) {
    x[i+1] = "<option value='"+ itemFinal[i].cod_item + " " + itemFinal[i].cod_tipo_item + "'>" + itemFinal[i].cod_tipo_item + "." + itemFinal[i].cod_item + " - " + itemFinal[i].descricao + "</option>";
  }

  if(itemFinal[i].cod_item != 0){
    document.getElementById("itens_disponiveis").disabled = false;
  }

  document.getElementById("itens_disponiveis").disabled = false;
  document.getElementById("itens_disponiveis").innerHTML = x;
}

//função separada pelo back
function itensReajuste(caminho){
  fetch(servidor + 'read/itensfaturareajuste/' + caminho , {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 200) {
      return response.json().then(function (json) {
        //console.log(json);
        //variavel alterada para usar em enabler()
        itemSelecionado=json;
      });
    } else {
      erros(response.status);
    }
  });
}

function enabler3(){

  document.getElementById("quantidade_disponivel").disabled = false;
  document.getElementById("quantidade").disabled = false;
  document.getElementById("valor").disabled = false;

  let empenho = document.getElementById("id_empenho").value;

  //spliting para pegar o valor de itens puro
  let stringValores = document.getElementById("itens_disponiveis").value;
  let valoresJuntos = stringValores.split(" ");

  //valor usado no filtro
  let item = valoresJuntos[0];
  let tipoItem = valoresJuntos[1];
  let i, quantidade_disponivel="", quantidade="", valor="";

  for (i = 0; i < itemSelecionado.length; i++) {
    if (itemSelecionado[i].cod_item == item && itemSelecionado[i].cod_tipo_item == tipoItem && itemSelecionado[i].id_empenho == empenho) {
      quantidade_disponivel += itemSelecionado[i].quantidade_disponivel;
      quantidade += itemSelecionado[i].quantidade;
      valor += itemSelecionado[i].valor;
    }
  }

  //colocar os valores nos campos
  document.getElementById("quantidade_disponivel").value = quantidade_disponivel;
  document.getElementById("quantidade").value = (quantidade*100);
  document.getElementById("valor").value = (valor*100);

  //mudar cor se necessario
  if(quantidade_disponivel < 0){
    document.getElementById("quantidade_disponivel").style.color = "red";
  }

  else{
    document.getElementById("quantidade_disponivel").style.color = "black";
  }

  document.getElementById("quantidade_disponivel").disabled = true;
}

function enviarItensFatura(){

  //trata os valores de itens disponiveis
  let stringValores = document.getElementById("itens_disponiveis").value;
  let valoresJuntos = stringValores.split(" ");

  // JSON usado para mandar as informações no fetch
  let info = {
    "num_nf": parseInt(meuCodigo),
    "cod_ibge": parseInt(meuCodigoSec),
    "id_empenho": parseInt(document.getElementById("id_empenho").value),
    "cod_item": parseInt(valoresJuntos[0]),
    "cod_tipo_item": parseInt(valoresJuntos[1]),
    "quantidade": parseFloat(mascaraQuebrados(document.getElementById("quantidade").value)),
    "valor": parseFloat(mascaraPreco(document.getElementById("valor").value)),
  };

  //transforma as informações em string para mandar
  let corpo = JSON.stringify(info);
  //função fetch para mandar
  fetch(servidor + 'read/itensfatura', {
    method: 'POST',
    body: corpo,
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 200 || response.status == 201) {
      location.reload();
    } else {
      erros(response.status);
    }
  });
}