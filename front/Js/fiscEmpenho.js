//variaveis globais
let jsonFinal;

window.onload = function () {
  paginacao();
}

function paginacao() {
  porPagina = document.getElementById("quantos").value;
  let comeco = contador * porPagina;
  let fim = (contador + 1) * porPagina;

  //função fetch para chamar os itens de previsão da tabela
  fetch(servidor + 'read/empenho', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //checar os status de pedidos
    //console.log(response);

    //tratamento dos erros
    if (response.status == 200) {
      
      response.json().then(function (json) {

        //console.log(json)

        let tabela = (`<thead style="background: #4b5366; color:white; font-size:15px">
        <tr>
        <th style="width:15%" scope="col">Código de Empenho</th>
        <th style="width:10%" scope="col">Lote</th>
        <th style="width:40%" scope="col">Natureza de Despesa/Previsão de Empenho</th>
        <th style="width:10%" scope="col">Tipo</th>
        <th style="width:15%" scope="col">Data</th>
        <th style="width:10%" scope="col">Opções</th>
        </tr>
        </thead>`);
        tabela += (`<tbody>`);


        //sistema de filtragem:
        let filtrado = [];
        filtrado = filtro(json,["cod_previsao_empenho","cod_empenho","cod_natureza_despesa","descricao","cod_lote","data"]);
        jsonFinal=filtrado;


        for (let i = comeco; i < fim && i < filtrado.length; i++) {
          //captura itens para tabela
          tabela += (`<tr>`);
          tabela += (`<td>`);
          tabela += filtrado[i]["cod_empenho"];
          tabela += (`</td>`);
          tabela += (`<td>`);
          tabela += filtrado[i]["cod_lote"];
          tabela += (`</td>`);
          tabela += (`<td>`);
          tabela += filtrado[i]["cod_natureza_despesa"] + " - " + filtrado[i]["descricao"] + " - " + filtrado[i]["cod_previsao_empenho"];
          tabela += (`</td>`);
          tabela += (`<td>`);
          if(filtrado[i]["tipo"]=="o"){
            tabela += "Original";
          }
          else if(filtrado[i]["tipo"]=="r"){
            tabela += "Reajuste";
          }
          tabela += (`</td>`);
          tabela += (`<td>`);
          let data1 = new Date(filtrado[i]["data"]);
          let dataFinal1 = String(data1.getDate()).padStart(2, '0') + "/" + String(data1.getMonth() + 1).padStart(2, '0') + "/" + String(data1.getFullYear()).padStart(4, '0');
          tabela += dataFinal1;
          tabela += (`</td>`);
          tabela += (`<td> 
          <span class="d-flex">
          <button onclick="editarEmpenho(` + i + `)" class="btn btn-success">
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



//no botão de adicionar
function pegarPrevisao() {
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
        x[0] += "<option value=''>Natureza de Despesa</option>";
        for (i = 0; i < json.length; i++) {
          x[i] += "<option value='" + json[i].cod_natureza_despesa + "'>" + json[i].descricao + "</option>";
        }
        document.getElementById("cod_natureza_despesa").innerHTML = x;

        //define valor
        document.getElementById("cod_previsao_empenho").innerHTML = "<option>Código de Previsão de Empenho</option>";
        document.getElementById("cod_previsao_empenho").disabled = true;
      });
    } else {
      erros(response.status);
    }
  });
}


function enabler() {

  //ativa o campo
  document.getElementById("cod_previsao_empenho").disabled = false;

  fetch(servidor + 'read/previsaoempenho', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 200) {
      response.json().then(function (json) {
        console.log(json);
        let j = 0;
        let natureza = document.getElementById("cod_natureza_despesa").value;
        let listaPrevisao = [];
        for (let i = 0; i < json.length; i++) {
          if (natureza == json[i]["cod_natureza_despesa"]) {
            listaPrevisao[j] = json[i];
            j++;
          }
        }

        let x = [];
        x[0] += "<option >Código de Previsão de Empenho</option>";
        for (i = 0; i < listaPrevisao.length; i++) {
          x[i+1] += "<option>" + listaPrevisao[i].cod_previsao_empenho + "</option>";
        }
        document.getElementById("cod_previsao_empenho").innerHTML = x;
      });
    } else {
      erros(response.status);
    }
  });
}

function enviar() {

  //  JSON usado para mandar as informações no fetch
  let info = {
    "cod_empenho": "",
    "cod_previsao_empenho": "",
    "data": "",
  };

  info.cod_previsao_empenho = parseInt(document.getElementById("cod_previsao_empenho").value);
  info.cod_empenho = document.getElementById("cod_empenho").value;
  info.data = document.getElementById("data").value;

  //transforma as informações em string para mandar
  let corpo = JSON.stringify(info);
  //função fetch para mandar
  fetch(servidor + 'read/empenho', {
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

//leva para o editor do campo selecionado
function editarEmpenho(valor) {
  localStorage.setItem("id_empenho", jsonFinal[valor].id_empenho);
  localStorage.setItem("cod_empenho", jsonFinal[valor].cod_empenho);
  localStorage.setItem("cod_previsao_empenho", jsonFinal[valor].cod_previsao_empenho);
  localStorage.setItem("natureza_despesa", jsonFinal[valor].natureza_despesa);
  localStorage.setItem("descricao", jsonFinal[valor].descricao);
  localStorage.setItem("tipo", jsonFinal[valor].tipo);
  localStorage.setItem("data", jsonFinal[valor].data);
  window.location.href = "./gerenciaEmpenho.html";
}