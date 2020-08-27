//pega o CNPJ escolhido anteriormente
let meuCodigo = localStorage.getItem("num_nf");
let meuCodigoSec = localStorage.getItem("cod_ibge");
let itemSelecionado = [];



window.onload = function () {

  //preenche os campos
  document.getElementById("num_nf").value = meuCodigo;

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
  document.getElementById("tipo").innerHTML = "<option value='0'>Tipo</option><option value='o'>Original</option><option value='r'>Reajuste</option>";
  document.getElementById("id_empenho").innerHTML = "<option value='0'>Empenho</option>";
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
  let caminho;

  if(tipo=="o" || tipo=="r"){
    //filtro entre reajuste e original
    if(tipo=="o"){
      caminho = "read/itensfaturaidempenhooriginal/";
    }
    else if(tipo=="r"){
      caminho = "read/itensfaturaidempenhoreajuste/";
    }

    fetch(servidor + caminho + meuCodigoSec, {
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
        });
      } else {
        erros(response.status);
      }
    });

  }else{
    alert("ERRO: por favor, escolha um tipo.");
  }

}

function enabler2(){

  //variaveis
  let tipo = document.getElementById("tipo").value;
  let empenho = document.getElementById("id_empenho").value;
  let x = [];
  let caminho;


  //garantindo que não seja enviado
  if(empenho>"0"){
  
    if(tipo=="o"){
      caminho="read/itensfaturaoriginal/";
    }

    else if(tipo=="r"){
      caminho="read/itensfaturareajuste/";
    }
    else{
      alert("ERRO: por favor, escolha um tipo.");
    }

    fetch(servidor + caminho + empenho + "/" + meuCodigoSec, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + meuToken
      },
    }).then(function (response) {

      //tratamento dos erros
      if (response.status == 200) {
        return response.json().then(function (json) {
          console.log(json);
          //variavel alterada para usar em enabler()
          itemSelecionado=json;

          //preenche "itens disponiveis"
          x[0] = "<option value='A'>Item Selecionado</option>";
          //precisa juntar os valores para pegar ambos
          for (let i = 0; i < itemSelecionado.length; i++) {
            x[i+1] = "<option value='"+ itemSelecionado[i].cod_item + " " + itemSelecionado[i].cod_tipo_item + "'>" + itemSelecionado[i].cod_tipo_item + "." + itemSelecionado[i].cod_item + " - " + itemSelecionado[i].descricao + "</option>";
          }

          document.getElementById("itens_disponiveis").disabled = false;
          document.getElementById("itens_disponiveis").innerHTML = x;

        });
      } else {
        erros(response.status);
      }
    });

  } else {
    alert("ERRO: por favor, escolha um empenho.");
  }
}

function enabler3(){

  document.getElementById("quantidade_disponivel").disabled = false;
  document.getElementById("quantidade").disabled = false;
  document.getElementById("valor").disabled = false;

  //spliting para pegar o valor de itens puro
  let stringValores = document.getElementById("itens_disponiveis").value;
  let valoresJuntos = stringValores.split(" ");

  //valor usado no filtro
  let item = valoresJuntos[0];
  let tipoItem = valoresJuntos[1];
  let i, quantidade_disponivel, quantidade, valor;

  for (i = 0; i < itemSelecionado.length; i++) {
    if (itemSelecionado[i].cod_item == item && itemSelecionado[i].cod_tipo_item == tipoItem) {
      quantidade_disponivel = itemSelecionado[i].quantidade_disponivel;
      quantidade = itemSelecionado[i].quantidade;
      valor = itemSelecionado[i].valor;
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
    "valor": parseFloat(mascaraQuebrados(document.getElementById("valor").value)),
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