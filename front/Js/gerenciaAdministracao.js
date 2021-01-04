//captura valores para os "selects" futuros
let resultadoClasse;
let resultadoNatureza;
let resultadoPrefeitos;

window.onload = function () {
  selectClasse();
  selectNatureza();
  selectPrefeitos();
}



//informaçãoes para assunto
function editassunto(valor){
  document.getElementById("descricao" + valor).innerHTML = "<input></input>";
  document.getElementById("botaoEdicao").innerHTML = `<button id="botaoEdicao" onclick="edit` + caminho + `(` + i + `)" class="btn btn-success"><i class="material-icons"data-toggle="tooltip" title="Edit">&#xE254;</i></button>`;
}
function editassunto2(){
  let info = {
    "descricao": document.getElementById("descricao").value,
  };
  enviar("assunto",info,'PUT');
}



//informaçãoes para categoria
function editcategoria(){
  document.getElementById("descricao" + valor).innerHTML = "<input></input>";
  document.getElementById("botaoEdicao").innerHTML = `<button id="botaoEdicao" onclick="edit` + caminho + `(` + i + `)" class="btn btn-success"><i class="material-icons"data-toggle="tooltip" title="Edit">&#xE254;</i></button>`;
}
function editcategoria2(){
  let info = {
    "descricao": document.getElementById("descricao").value,
  };
  enviar("categoria",info,'PUT');
}



//informaçãoes para classe de empenho
function editclasseempenho(){
  document.getElementById("descricao" + valor).innerHTML = "<input></input>";
  document.getElementById("botaoEdicao").innerHTML = `<button id="botaoEdicao" onclick="edit` + caminho + `(` + i + `)" class="btn btn-success"><i class="material-icons"data-toggle="tooltip" title="Edit">&#xE254;</i></button>`;
}
function editclasseempenho2(){
  let info = {
    "descricao": document.getElementById("descricao").value,
  };
  enviar("classeempenho",info,'PUT');
}



//informaçãoes para etapas
function editetapa(){}
function editetapa2(){}



//informaçãoes para itens
function selectNatureza() {
  fetch(servidor + 'read/naturezadespesa', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 200) {
      response.json().then(function (json) {
        for (let i = 0; i < json.length; i++) {
          resultadoNatureza += "<option value=" + json[i]["cod_natureza_despesa"] + ">" + json[i]["descricao"] + "</option>";
        }
      });
    } else {
      erros(response.status);
    }
  });
}
function selectClasse() {
  fetch(servidor + 'read/classeempenho', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 200) {
      response.json().then(function (json) {
        for (let i = 0; i < json.length; i++) {
          resultadoClasse += "<option value=" + json[i]["cod_classe_empenho"] + ">" + json[i]["descricao"] + "</option>";
        }
      });
    } else {
      erros(response.status);
    }
  });
}
function edititem(){}
function edititem2(){}



//informaçãoes para modulo
function editmodulo(){}
function editmodulo2(){}



//informaçãoes para municipio
function editmunicipio(){}
function editmunicipio2(){}



//informaçãoes para natureza de despesas
function editnaturezadespesa(){
  document.getElementById("descricao" + valor).innerHTML = "<input></input>";
  document.getElementById("botaoEdicao").innerHTML = `<button id="botaoEdicao" onclick="edit` + caminho + `(` + i + `)" class="btn btn-success"><i class="material-icons"data-toggle="tooltip" title="Edit">&#xE254;</i></button>`;
}
function editnaturezadespesa2(){
  let info = {
    "descricao": document.getElementById("descricao").value,
  };
  enviar("naturezadespesa",info,'PUT');
}



//informaçãoes para prefeitos
function selectPrefeitos() {
  fetch(servidor + 'read/municipio', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 200) {
      response.json().then(function (json) {
        for (let i = 0; i < json.length; i++) {
          resultadoPrefeitos += "<option>" + json[i]["cod_ibge"] + "</option>";
        }
      });
    } else {
      erros(response.status);
    }
  });
}
function editprefeitos(){}
function editprefeitos2(){}



//informaçãoes para Tipo de item
function edittipoitem(){
  document.getElementById("descricao" + valor).innerHTML = "<input></input>";
  document.getElementById("botaoEdicao").innerHTML = `<button id="botaoEdicao" onclick="edit` + caminho + `(` + i + `)" class="btn btn-success"><i class="material-icons"data-toggle="tooltip" title="Edit">&#xE254;</i></button>`;
}
function edittipoitem2(){
  let info = {
    "descricao": document.getElementById("descricao").value,
  };
  enviar("tipoitem",info,'PUT');
}



//informaçãoes para Tipologia
function edittipologia(){
  document.getElementById("descricao" + valor).innerHTML = "<input></input>";
  document.getElementById("botaoEdicao").innerHTML = `<button id="botaoEdicao" onclick="edit` + caminho + `(` + i + `)" class="btn btn-success"><i class="material-icons"data-toggle="tooltip" title="Edit">&#xE254;</i></button>`;
}
function edittipologia2(){
  let info = {
    "descricao": document.getElementById("descricao").value,
  };
  enviar("tipologia",info,'PUT');
}



function enviar(caminho,info,metodo) {
  //transforma as informações do token em json
  let corpo = JSON.stringify(info);
  //função fetch para enviar
  fetch(servidor + 'read/' + caminho, {
    method: metodo,
    body: corpo,
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //checar o status do pedido
    //console.log(response);

    //tratamento dos erros
    if (response.status == 200 || response.status == 201 || response.status == 202) {
      response.json().then(function (json) {
        //console.log(json);
      });
      location.reload();
    } else {
      erros(response.status);
    }
  });
}