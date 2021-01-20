//captura valores para os "selects" futuros
let resultadoClasse = "";
let resultadoNatureza = "";
let resultadoMunicipio = "";

let codAdmin = localStorage.getItem("administracao");

window.onload = function () {
  selecionaAdmin(codAdmin)
}

function selecionaAdmin(meuAdmin){
  if(meuAdmin == 1){
    editassunto();
    document.getElementById("titulo1").innerHTML = "Editar Assunto";
    document.getElementById("titulo2").innerHTML = "Editar Assunto";
  }
  else if(meuAdmin == 2){
    editcategoria();
    document.getElementById("titulo1").innerHTML = "Editar Categoria";
    document.getElementById("titulo2").innerHTML = "Editar Categoria";
  }
  else if(meuAdmin == 3){
    editclasseempenho();
    document.getElementById("titulo1").innerHTML = "Editar Classe de Empenho";
    document.getElementById("titulo2").innerHTML = "Editar Classe de Empenho";
  }
  else if(meuAdmin == 4){
    editetapa();
    document.getElementById("titulo1").innerHTML = "Editar Etapa";
    document.getElementById("titulo2").innerHTML = "Editar Etapa";
  }
  else if(meuAdmin == 5){
    selectClasse();
    selectNatureza();
    edititem();
    document.getElementById("titulo1").innerHTML = "Editar Itens";
    document.getElementById("titulo2").innerHTML = "Editar Itens";
  }
  else if(meuAdmin == 6){
    editmodulo();
    document.getElementById("titulo1").innerHTML = "Editar Modulos";
    document.getElementById("titulo2").innerHTML = "Editar Modulos";
  }
  else if(meuAdmin == 7){
    editmunicipio();
    document.getElementById("titulo1").innerHTML = "Editar Municipios";
    document.getElementById("titulo2").innerHTML = "Editar Municipios";
  }
  else if(meuAdmin == 8){
    editnaturezadespesa();
    document.getElementById("titulo1").innerHTML = "Editar Natureza de Despesa";
    document.getElementById("titulo2").innerHTML = "Editar Natureza de Despesa";
  }
  else if(meuAdmin == 9){
    selectMunicipio();
    editprefeito();
    document.getElementById("titulo1").innerHTML = "Editar Prefeito";
    document.getElementById("titulo2").innerHTML = "Editar Prefeito";
  }
  else if(meuAdmin == 10){
    edittipoitem();
    document.getElementById("titulo1").innerHTML = "Editar Tipo de Item";
    document.getElementById("titulo2").innerHTML = "Editar Tipo de Item";
  }
  else if(meuAdmin == 11){
    edittipologia();
    document.getElementById("titulo1").innerHTML = "Editar Tipologia";
    document.getElementById("titulo2").innerHTML = "Editar Tipologia";
  }
  else{
    alert("Erro desconhecido. Redirecionando para a página inicial.");
    window.location.href = "./home.html";
  }
}



//informaçãoes para assunto
function editassunto(){
  let campos =`<div class="form-group col-md-3">
  <label for="descricao">Descrição:</label>
  <input class="form-control" id="descricao"></input>
  </div>

  <div style="width:100%; text-align: center;">
  <div class="col-sm-6">
  <button style="background-color:#3a3a3a" type="button" class="btn btn-primary" onclick="enviarassunto()">Editar</button>
  </div>`

  document.getElementById("campos").innerHTML = campos;
  
  editassunto2();
}

function editassunto2(){
  //separado por questões de criação
  document.getElementById("descricao").value = localStorage.getItem("descricao");
}

function enviarassunto(){
  let info = {
    "descricao": document.getElementById("descricao").value,
  };
  enviar("assunto/" + localStorage.getItem("cod_assunto"),info);
}



//informaçãoes para categoria
function editcategoria(){
  let campos =`<div class="form-group col-md-3">
  <label for="descricao">Descrição:</label>
  <input class="form-control" id="descricao"></input>
  </div>

  <div style="width:100%; text-align: center;">
  <div class="col-sm-6">
  <button style="background-color:#3a3a3a" type="button" class="btn btn-primary" onclick="enviarcategoria()">Editar</button>
  </div>`

  document.getElementById("campos").innerHTML = campos;
  
  editcategoria2();
}
function editcategoria2(){
  //separado por questões de criação
  document.getElementById("descricao").value = localStorage.getItem("descricao");
}
function enviarcategoria(){
  let info = {
    "descricao": document.getElementById("descricao").value,
  };
  enviar("categoria/" + localStorage.getItem("cod_categoria"),info);
}



//informaçãoes para classe de empenho
function editclasseempenho(){
  let campos =`<div class="form-group col-md-4">
  <label for="descricao">Descrição:</label>
  <input class="form-control" id="descricao"></input>
  </div>

  <div style="width:100%; text-align: center;">
  <div class="col-sm-6">
  <button style="background-color:#3a3a3a" type="button" class="btn btn-primary" onclick="enviarclasseempenho()">Editar</button>
  </div>`

  document.getElementById("campos").innerHTML = campos;
  
  editclasseempenho2();
}
function editclasseempenho2(){
  //separado por questões de criação
  document.getElementById("descricao").value = localStorage.getItem("descricao");
}
function enviarclasseempenho(){
  let info = {
    "cod_classe_empenho": parseInt(localStorage.getItem("cod_classe_empenho")),
    "descricao": document.getElementById("descricao").value,
  };
  enviar("classeempenho/" + localStorage.getItem("cod_classe_empenho"),info);
}



//informaçãoes para etapas
function editetapa(){
  let campos =`<div class="form-group col-md-4">
  <label for="descricao">Descrição:</label>
  <input class="form-control" id="descricao"></input>
  </div>

  <div class="form-group col-md-4">
  <label for="duracao">Duração:</label>
  <input class="form-control" id="duracao"></input>
  </div>

  <div class="form-group col-md-4">
  <label for="depende">Depende:</label>
  <input class="form-control" id="depende"></input>
  </div>

  <div class="form-group col-md-4">
  <label for="delay">Delay:</label>
  <input class="form-control" id="delay"></input>
  </div>

  <div class="form-group col-md-4">
  <label for="setor_resp">Setor Responsável:</label>
  <input class="form-control" id="setor_resp"></input>
  </div>

  <div style="width:100%; text-align: center;">
  <div class="col-sm-6">
  <button style="background-color:#3a3a3a" type="button" class="btn btn-primary" onclick="enviaretapa()">Editar</button>
  </div>`

  document.getElementById("campos").innerHTML = campos;
  
  editetapa2();
}
function editetapa2(){
  //separado por questões de criação
  document.getElementById("descricao").value = localStorage.getItem("descricao");
  document.getElementById("duracao").value = localStorage.getItem("duracao");
  document.getElementById("depende").value = localStorage.getItem("depende");
  document.getElementById("delay").value = localStorage.getItem("delay");
  document.getElementById("setor_resp").value = localStorage.getItem("setor_resp");
}
function enviaretapa(){
  let info = {
    "cod_etapa": parseInt(localStorage.getItem("cod_etapa")),
    "descricao": document.getElementById("descricao").value,
    "duracao": parseInt(document.getElementById("duracao").value),
    "depende": parseInt(document.getElementById("depende").value),
    "delay": parseInt(document.getElementById("delay").value),
    "setor_resp": document.getElementById("setor_resp").value,
  };
  enviar("etapa/" + localStorage.getItem("cod_etapa"),info);
}


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
function edititem(){
  let campos =`<div class="form-group col-md-4">
  <label for="cod_tipo_item">Código do Tipo de Item:</label>
  <input class="form-control" id="cod_tipo_item"></input>
  </div>

  <div class="form-group col-md-4">
  <label for="cod_natureza_despesa">Natureza de Despeza:</label>
  <select class="form-control" id="cod_natureza_despesa">
  ` + resultadoNatureza + `
  </select>
  </div>

  <div class="form-group col-md-4">
  <label for="cod_classe_empenho">Classe de Empenho:</label>
  <select class="form-control" id="cod_classe_empenho">
  ` + resultadoClasse + `
  </select>
  </div>

  <div class="form-group col-md-4">
  <label for="descricao">Descrição:</label>
  <input class="form-control" id="descricao"></input>
  </div>

  <div class="form-group col-md-4">
  <label for="unidade">Unidade:</label>
  <input class="form-control" id="unidade"></input>
  </div>

  <div style="width:100%; text-align: center;">
  <div class="col-sm-6">
  <button style="background-color:#3a3a3a" type="button" class="btn btn-primary" onclick="enviaritem()">Editar</button>
  </div>`

  document.getElementById("campos").innerHTML = campos;

  console.log(campos)
  
  edititem2();
}
function edititem2(){
  //separado por questões de criação
  document.getElementById("cod_tipo_item").value = localStorage.getItem("cod_tipo_item");
  document.getElementById("cod_natureza_despesa").value = localStorage.getItem("cod_natureza_despesa");
  document.getElementById("cod_classe_empenho").value = localStorage.getItem("cod_classe_empenho");
  document.getElementById("descricao").value = localStorage.getItem("descricao");
  document.getElementById("unidade").value = localStorage.getItem("unidade");
}
function enviaritem(){
  let info = {
    "cod_item": parseInt(localStorage.getItem("cod_item")),
    "cod_tipo_item": document.getElementById("cod_tipo_item").value,
    "cod_natureza_despesa": parseInt(document.getElementById("cod_natureza_despesa").value),
    "cod_classe_empenho": parseInt(document.getElementById("cod_classe_empenho").value),
    "descricao": parseInt(document.getElementById("descricao").value),
    "unidade": document.getElementById("unidade").value,
  };
  enviar("itens/" + localStorage.getItem("cod_tipo_item"),info);
}



//informaçãoes para modulo
function editmodulo(){
  let campos =`<div class="form-group col-md-4">
  <label for="categoria_1">Categoria 1:</label>
  <input class="form-control" id="categoria_1"></input>
  </div>

  <div class="form-group col-md-4">
  <label for="categoria_2">Categoria 2:</label>
  <input class="form-control" id="categoria_2"></input>
  </div>

  <div class="form-group col-md-4">
  <label for="categoria_3">Categoria 3:</label>
  <input class="form-control" id="categoria_3"></input>
  </div>

  <div class="form-group col-md-4">
  <label for="descricao">Descrição:</label>
  <input class="form-control" id="descricao"></input>
  </div>

  <div style="width:100%; text-align: center;">
  <div class="col-sm-6">
  <button style="background-color:#3a3a3a" type="button" class="btn btn-primary" onclick="enviarmodulo()">Editar</button>
  </div>`

  document.getElementById("campos").innerHTML = campos;
  
  editmodulo2();
}
function editmodulo2(){
  //separado por questões de criação
  document.getElementById("categoria_1").value = localStorage.getItem("categoria_1");
  document.getElementById("categoria_2").value = localStorage.getItem("categoria_2");
  document.getElementById("categoria_3").value = localStorage.getItem("categoria_3");
  document.getElementById("descricao").value = localStorage.getItem("descricao");
}
function enviarmodulo(){
  let info = {
    "cod_modulo": parseInt(localStorage.getItem("cod_modulo")),
    "categoria_1": document.getElementById("categoria_1").value,
    "categoria_2": parseInt(document.getElementById("categoria_2").value),
    "categoria_3": parseInt(document.getElementById("categoria_3").value),
    "descricao": parseInt(document.getElementById("descricao").value),
  };
  
  //pega o usuario logado
  let userLogado = localStorage.getItem("logado");

  enviar("usuario/" + userLogado + "/modulo/" + localStorage.getItem("cod_modulo"),info);
}



//informaçãoes para municipio
function editmunicipio(){
  let campos =`<div class="form-group col-md-4">
  <label for="nome_municipio">Município:</label>
  <input class="form-control" id="nome_municipio"></input>
  </div>

  <div class="form-group col-md-4">
  <label for="populacao">População:</label>
  <input class="form-control" id="populacao"></input>
  </div>

  <div class="form-group col-md-4">
  <label for="uf">Unidade Federativa:</label>
  <input class="form-control" id="uf"></input>
  </div>

  <div class="form-group col-md-4">
  <label for="regiao">Região:</label>
  <input class="form-control" id="regiao"></input>
  </div>

  <div class="form-group col-md-4">
  <label for="cnpj">CNPJ:</label>
  <input class="form-control" id="cnpj"></input>
  </div>

  <div class="form-group col-md-4">
  <label for="dist_capital">Capital:</label>
  <input class="form-control" id="dist_capital"></input>
  </div>

  <div class="form-group col-md-4">
  <label for="endereco">Endereço:</label>
  <input class="form-control" id="endereco"></input>
  </div>

  <div class="form-group col-md-4">
  <label for="numero">Número:</label>
  <input class="form-control" id="numero"></input>
  </div>

  <div class="form-group col-md-4">
  <label for="complemento">Complemento:</label>
  <input class="form-control" id="complemento"></input>
  </div>

  <div class="form-group col-md-4">
  <label for="bairro">Bairro:</label>
  <input class="form-control" id="bairro"></input>
  </div>

  <div class="form-group col-md-4">
  <label for="idhm">IDHM:</label>
  <input class="form-control" id="idhm"></input>
  </div>

  <div class="form-group col-md-4">
  <label for="latitude">Latitude:</label>
  <input class="form-control" id="latitude"></input>
  </div>

  <div class="form-group col-md-4">
  <label for="longitude">Longitude:</label>
  <input class="form-control" id="longitude"></input>
  </div>

  <div style="width:100%; text-align: center;">
  <div class="col-sm-6">
  <button style="background-color:#3a3a3a" type="button" class="btn btn-primary" onclick="enviarmunicipio()">Editar</button>
  </div>`

  document.getElementById("campos").innerHTML = campos;
  
  editmunicipio2();
}
function editmunicipio2(){
  //separado por questões de criação
  document.getElementById("nome_municipio").value = localStorage.getItem("nome_municipio");
  document.getElementById("populacao").value = localStorage.getItem("populacao");
  document.getElementById("uf").value = localStorage.getItem("uf");
  document.getElementById("regiao").value = localStorage.getItem("regiao");
  document.getElementById("cnpj").value = localStorage.getItem("cnpj");
  document.getElementById("dist_capital").value = localStorage.getItem("dist_capital");
  document.getElementById("endereco").value = localStorage.getItem("endereco");
  document.getElementById("numero").value = localStorage.getItem("numero");
  document.getElementById("complemento").value = localStorage.getItem("complemento");
  document.getElementById("bairro").value = localStorage.getItem("bairro");
  document.getElementById("idhm").value = localStorage.getItem("idhm");
  document.getElementById("latitude").value = localStorage.getItem("latitude");
  document.getElementById("longitude").value = localStorage.getItem("longitude");
}
function enviarmunicipio(){
  let info = {
    "cod_ibge": parseInt(localStorage.getItem("cod_ibge")),
    "nome_municipio": document.getElementById("nome_municipio").value,
    "populacao": parseInt(document.getElementById("populacao").value),
    "uf": document.getElementById("uf").value,
    "regiao": document.getElementById("regiao").value,
    "cnpj": document.getElementById("cnpj").value,
    "dist_capital": parseInt(document.getElementById("dist_capital").value),
    "endereco": document.getElementById("endereco").value,
    "numero": document.getElementById("numero").value,
    "complemento": document.getElementById("complemento").value,
    "bairro": document.getElementById("bairro").value,
    "idhm": parseFloat(document.getElementById("idhm").value),
    "latitude": parseFloat(document.getElementById("latitude").value),
    "longitude": parseFloat(document.getElementById("longitude").value),
  };
  enviar("municipio/" + localStorage.getItem("cod_ibge"),info);
}



//informaçãoes para natureza de despesas
function editnaturezadespesa(){
  let campos =`<div class="form-group col-md-3">
  <label for="descricao">Descrição:</label>
  <input class="form-control" id="descricao"></input>
  </div>

  <div style="width:100%; text-align: center;">
  <div class="col-sm-6">
  <button style="background-color:#3a3a3a" type="button" class="btn btn-primary" onclick="enviarnaturezadespesa()">Editar</button>
  </div>`

  document.getElementById("campos").innerHTML = campos;
  
  editnaturezadespesa2();
}
function editnaturezadespesa2(){
  //separado por questões de criação
  document.getElementById("descricao").value = localStorage.getItem("descricao");
}
function enviarnaturezadespesa(){
  let info = {
    "cod_natureza_despesa": parseInt(localStorage.getItem("cod_natureza_despesa")),
    "descricao": document.getElementById("descricao").value,
  };
  enviar("naturezadespesa/" + localStorage.getItem("cod_natureza_despesa"),info);
}



//informaçãoes para prefeitos
function selectMunicipio() {
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
          resultadoMunicipio += "<option value='" + json[i]["cod_ibge"] + "'>" + json[i]["nome_municipio"] + "</option>";
        }
      });
    } else {
      erros(response.status);
    }
  });
}
function editprefeito(){
  let campos =`<div class="form-group col-md-4">
  <label for="cod_ibge">Município:</label>
  <select class="form-control" id="cod_ibge">
  ` + resultadoMunicipio + `
  </select>
  </div>

  <div class="form-group col-md-4">
  <label for="nome">Nome:</label>
  <input class="form-control" id="nome"></input>
  </div>

  <div class="form-group col-md-4">
  <label for="cpf">CPF:</label>
  <input class="form-control" id="cpf"></input>
  </div>

  <div class="form-group col-md-4">
  <label for="rg">RG:</label>
  <input class="form-control" id="rg"></input>
  </div>

  <div class="form-group col-md-4">
  <label for="partido">Partido:</label>
  <input class="form-control" id="partido"></input>
  </div>

  <div class="form-group col-md-4">
  <label for="exercicio">Exercício:</label>
  <input class="form-control" id="exercicio"></input>
  </div>

  <div style="width:100%; text-align: center;">
  <div class="col-sm-6">
  <button style="background-color:#3a3a3a" type="button" class="btn btn-primary" onclick="enviarprefeito()">Editar</button>
  </div>`

  document.getElementById("campos").innerHTML = campos;
  
  editprefeito2();
}
function editprefeito2(){
  //separado por questões de criação
  document.getElementById("cod_ibge").value = localStorage.getItem("cod_ibge");
  document.getElementById("nome").value = localStorage.getItem("nome");
  document.getElementById("cpf").value = localStorage.getItem("cpf");
  document.getElementById("rg").value = localStorage.getItem("rg");
  document.getElementById("partido").value = localStorage.getItem("partido");
  document.getElementById("exercicio").value = localStorage.getItem("exercicio");
}
function enviarprefeito(){
  let info = {
    "cod_prefeito": parseInt(localStorage.getItem("cod_prefeito")),
    "cod_ibge": document.getElementById("cod_ibge").value,
    "nome": parseInt(document.getElementById("nome").value),
    "cpf": parseInt(document.getElementById("cpf").value),
    "rg": parseInt(document.getElementById("rg").value),
    "partido": parseInt(document.getElementById("partido").value),
    "exercicio": parseInt(document.getElementById("exercicio").value),
  };
  enviar("prefeito/" + localStorage.getItem("cod_prefeito"),info);
}



//informaçãoes para Tipo de item
function edittipoitem(){
  let campos =`<div class="form-group col-md-3">
  <label for="descricao">Descrição:</label>
  <input class="form-control" id="descricao"></input>
  </div>

  <div style="width:100%; text-align: center;">
  <div class="col-sm-6">
  <button style="background-color:#3a3a3a" type="button" class="btn btn-primary" onclick="enviartipoitem()">Editar</button>
  </div>`

  document.getElementById("campos").innerHTML = campos;
  
  edittipoitem2();
}
function edittipoitem2(){
  //separado por questões de criação
  document.getElementById("descricao").value = localStorage.getItem("descricao");
}
function enviartipoitem(){
  let info = {
    "cod_tipo_item": parseInt(localStorage.getItem("cod_tipo_item")),
    "descricao": document.getElementById("descricao").value,
  };
  enviar("tipoitem/" + localStorage.getItem("cod_tipo_item"),info);
}



//informaçãoes para Tipologia
function edittipologia(){
  let campos =`<div class="form-group col-md-3">
  <label for="descricao">Descrição:</label>
  <input class="form-control" id="descricao"></input>
  </div>

  <div style="width:100%; text-align: center;">
  <div class="col-sm-6">
  <button style="background-color:#3a3a3a" type="button" class="btn btn-primary" onclick="enviartipologia()">Editar</button>
  </div>`

  document.getElementById("campos").innerHTML = campos;
  
  editnaturezadespesa2();
}
function edittipologia2(){
  //separado por questões de criação
  document.getElementById("descricao").value = localStorage.getItem("descricao");
}
function enviartipologia(){
  let info = {
    "cod_tipologia": parseInt(localStorage.getItem("cod_tipologia")),
    "descricao": document.getElementById("descricao").value,
  };
  enviar("tipologia/" + localStorage.getItem("cod_tipologia"),info);
}



function enviar(caminho,conteudo) {
  //transforma as informações do token em json
  let corpo = JSON.stringify(conteudo);
  //função fetch para enviar
  fetch(servidor + 'read/' + caminho, {
    method: "PUT",
    body: corpo,
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //checar o status do pedido
    //console.log(response);

    //tratamento dos erros
    if (response.status == 200 || response.status == 201 || response.status == 202) {
      // response.json().then(function (json) {
      //   console.log(json);
      // });
      window.location.href = "./visualizaAdministracao.html";
    } else {
      erros(response.status);
    }
  });
}