//variaveis globais
let jsonFinal = [];

//preciso checar subtotal sobre valores estranhos
window.onload = function () {
  paginacao();
  //altera o campo tipos como pedido, pode alterar aqui se necessário
  document.getElementById("tipo").innerHTML = "<option value=''>Tipo</option><option value='o'>Original</option><option value='r'>Reajuste</option>";
}

function paginacao() {
  porPagina = document.getElementById("quantos").value;
  let comeco = contador * porPagina;
  let fim = (contador + 1) * porPagina;

  //função fetch para chamar os itens de previsão da tabela
  fetch(servidor + 'read/previsaoempenho', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 200) {
      //console.log(response.statusText);

      response.json().then(function (json) {

        //console.log(json);

        let tabela = (`<thead style="background: #4b5366; color:white; font-size:15px">
        <tr>
        <th style="width:10%" scope="col">Código de Previsão de Empenho</th>
        <th style="width:10%" scope="col">Código do Lote</th>
        <th style="width:45%" scope="col">Natureza da despesa</th>
        <th style="width:10%" scope="col">Tipo</th>
        <th style="width:10%" scope="col">Data</th>
        <th style="width:10%" scope="col">Ano de Referência</th>
        <th style="width:5%" scope="col">Opções</th>
        </tr>
        </thead>`);
        tabela += (`<tbody>`);

        //sistema de filtragem:
        let filtrado = [];
        filtrado = filtro(json,["cod_previsao_empenho","cod_lote","ano_referencia","data","natureza_despesa"]);
        jsonFinal=filtrado;

        for (let i = comeco; i < fim && i < filtrado.length; i++) {
            //captura itens para tabela
            tabela += (`<tr>`);
            tabela += (`<td>`);
            tabela += filtrado[i]["cod_previsao_empenho"];
            tabela += (`</td>`);
            tabela += (`<td>`);
            tabela += filtrado[i]["cod_lote"];
            tabela += (`</td>`);
            tabela += (`<td>`);
            tabela += filtrado[i]["natureza_despesa"];
            tabela += (`</td>`);
            tabela += (`<td>`);
            if(filtrado[i]["tipo"]=="o"){
              tabela += "Original";
            }
            else{
              tabela += "Reajuste";
            }
            tabela += (`</td>`);
            tabela += (`<td>`);
            let data1 = new Date(filtrado[i]["data"]);
            let dataFinal1 = String(data1.getDate()).padStart(2, '0') + "/" + String(data1.getMonth() + 1).padStart(2, '0') + "/" + String(data1.getFullYear()).padStart(4, '0');
            tabela += dataFinal1;
            tabela += (`</td>`);
            tabela += (`<td>`);
            tabela += filtrado[i]["ano_referencia"];
            tabela += (`</td>`);
            tabela += (`<td> 
            <span class="d-flex">
            <button onclick="editarPrevisao(` + i + `)" class="btn btn-success">
            <i class="material-icons"data-toggle="tooltip" title="Edit">&#xE254;</i>
            </button>
            </td>`);
            tabela += (`</tr>`);
        }
        tabela += (`</tbody>`);
        document.getElementById("tabela").innerHTML = tabela;

        paginasOrganizadas(filtrado,comeco,fim);
      });
    } else {
      erros(response.status);
    }
  });
}



//funções para enviar

function pegarLote() {
  fetch(servidor + 'read/lote', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 200) {
      response.json().then(function (json) {
        //console.log(json);
        let x = [];
        x[0] = "<option value=''>Lote</option>";
        for (i = 0; i < json.length; i++) {
          x[i+1] += "<option >" + json[i].cod_lote + "</option>";
        }
        document.getElementById("cod_lote").innerHTML = x;
      });
    } else {
      erros(response.status);
    }
  });
}

function pegarNaturezaDespesa() {
  fetch(servidor + 'read/naturezadespesa', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 200) {
      response.json().then(function (json) {
        //console.log(json);
        let x = [];
        for (i = 0; i < json.length; i++) {
          // o valor pego é o codigo, mas o campo mostra a descrição
          x[i] += "<option value=" + json[i].cod_natureza_despesa + ">" + json[i].cod_natureza_despesa + " - " + json[i].descricao + "</option>";
        }
        document.getElementById("cod_natureza_despesa").innerHTML = x;
      });
    } else {
      erros(response.status);
    }
  });
}

function enviar() {

  //  JSON usado para mandar as informações no fetch
  let info = {
    "cod_lote": "",
    "cod_natureza_despesa": "",
    "data": "",
    "tipo": "",
    "ano_referencia": "",
  };

  info.cod_lote = parseInt(document.getElementById("cod_lote").value);
  info.cod_natureza_despesa = parseInt(document.getElementById("cod_natureza_despesa").value);
  info.data = document.getElementById("data").value;
  info.tipo = document.getElementById("tipo").value;
  info.ano_referencia = parseInt(document.getElementById("ano_referencia").value);

  //transforma as informações em string para mandar
  let corpo = JSON.stringify(info);
  console.log(corpo);
  //função fetch para mandar
  fetch(servidor + 'read/previsaoempenho', {
    method: 'POST',
    body: corpo,
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 200 || response.status == 201) {
      location.window.replace="./gerenciaPrevisao.html";
    } else {
      erros(response.status);
    }
  });
}



//leva para o editor do campo selecionado
function editarPrevisao(valor) {
  localStorage.setItem("cod_previsao_empenho", jsonFinal[valor].cod_previsao_empenho);
  localStorage.setItem("cod_lote", jsonFinal[valor].cod_lote);
  localStorage.setItem("data", jsonFinal[valor].data);
  localStorage.setItem("tipo", jsonFinal[valor].tipo);
  localStorage.setItem("ano_referencia", jsonFinal[valor].ano_referencia);

  //para mostrar a descrição
  localStorage.setItem("natureza_despesa", jsonFinal[valor].natureza_despesa);
  window.location.href = "./gerenciaPrevisao.html";
}