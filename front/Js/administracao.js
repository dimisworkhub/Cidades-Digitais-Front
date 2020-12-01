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
function addAssunto() {
  let formulario = (`<label for="descricao">Descrição</label>`);
  formulario += (`<textarea class="multisteps-form__input form-control" name="descricao" id="descricao" maxlength="45"></textarea>`);
  document.getElementById("modalAdicao").innerHTML = formulario;

  let botao = (`<button class="btn btn-primary multi-button ml-auto js-btn-next" type="button" onclick="envioAssunto()" title="Next">Adicionar</button>`);
  document.getElementById("botaoEnvio").innerHTML = botao;
}
function envioAssunto() {
  let info = {
    "descricao": document.getElementById("descricao").value,
  };
  enviar("assunto",info,'POST');
}
function visAssunto() {
  visualizar("assunto", `<th style="width:20%" scope="col">Código do Assunto</th>
  <th style="width:75%" scope="col">Descrição</th>`, ["cod_assunto", "descricao"]);
}
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
function addCategoria() {
  let formulario = (`<label for="descricao">Descrição</label>`);
  formulario += (`<textarea class="multisteps-form__input form-control" name="descricao" id="descricao" maxlength="45"></textarea>`);
  document.getElementById("modalAdicao").innerHTML = formulario;

  let botao = (`<button class="btn btn-primary multi-button ml-auto js-btn-next" type="button" onclick="envioCategoria()" title="Next">Adicionar</button>`);
  document.getElementById("botaoEnvio").innerHTML = botao;
}
function envioCategoria() {
  let info = {
    "descricao": document.getElementById("descricao").value,
  };
  enviar("categoria",info,'POST');
}
function visCategoria() {
  visualizar("categoria", `<th style="width:20%" scope="col">Código da Categoria</th>
  <th style="width:75%" scope="col">Descrição</th>`, ["cod_categoria", "descricao"]);
}
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
function addClasseEmpenho() {
  let formulario = (`<label for="cod_classe_empenho">Código da Classe</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="cod_classe_empenho" id="cod_classe_empenho"></input>`);
  formulario += (`<label for="descricao">Descrição</label>`);
  formulario += (`<textarea class="multisteps-form__input form-control" name="descricao" id="descricao" maxlength="100"></textarea>`);
  document.getElementById("modalAdicao").innerHTML = formulario;

  let botao = (`<button class="btn btn-primary multi-button ml-auto js-btn-next" type="button" onclick="envioClasseEmpenho()" title="Next">Adicionar</button>`);
  document.getElementById("botaoEnvio").innerHTML = botao;
}
function envioClasseEmpenho() {
  let info = {
    "cod_classe_empenho": parseInt(document.getElementById("cod_classe_empenho").value),
    "descricao": document.getElementById("descricao").value,
  };
  enviar("classeempenho",info,'POST');
}
function visClasseEmpenho() {
  visualizar("classeempenho", `<th style="width:20%" scope="col">Código de Classe de Empenho</th>
  <th style="width:75%" scope="col">Descrição</th>`, ["cod_classe_empenho", "descricao"]);
}
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
function addEtapa() {
  let formulario = (`<label for="descricao">Descrição</label>`);
  formulario += (`<textarea class="multisteps-form__input form-control" name="descricao" id="descricao" maxlength="45"></textarea>`);
  formulario += (`<label for="duracao">Duração</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="duracao" id="duracao"></input>`);
  formulario += (`<label for="depende">Depende</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="depende" id="depende"></input>`);
  formulario += (`<label for="delay">Delay</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="delay" id="delay"></input>`);
  formulario += (`<label for="setor_resp">Setor Responsável</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="setor_resp" id="setor_resp" maxlength="45"></input>`);
  document.getElementById("modalAdicao").innerHTML = formulario;

  let botao = (`<button class="btn btn-primary multi-button ml-auto js-btn-next" type="button" onclick="envioEtapa()" title="Next">Adicionar</button>`);
  document.getElementById("botaoEnvio").innerHTML = botao;
}
function envioEtapa() {
  let info = {
    "descricao": document.getElementById("descricao").value,
    "duracao": parseInt(document.getElementById("duracao").value),
    "depende": parseInt(document.getElementById("depende").value),
    "delay": parseInt(document.getElementById("delay").value),
    "setor_resp": document.getElementById("setor_resp").value,
  };
  enviar("etapa",info,'POST');
}
function visEtapa() {
  visualizar("etapa", `<th style="width:10%" scope="col">Código de Etapas</th>
  <th style="width:40%" scope="col">Descrição</th>
  <th style="width:10%" scope="col">Duração</th>
  <th style="width:10%" scope="col">Depende</th>
  <th style="width:10%" scope="col">Delay</th>
  <th style="width:15%" scope="col">Setor Responsável</th>`, ["cod_etapa", "descricao", "duracao", "depende", "delay", "setor_resp"]);
}
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
function addItem() {
  let formulario = (`<label for="cod_item">Código do Item</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="cod_item" id="cod_item"></input>`);
  formulario += (`<label for="cod_tipo_item">Código do Tipo de Item</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="cod_tipo_item" id="cod_tipo_item"></input>`);
  formulario += (`<label for="cod_natureza_despeza">Código da Natureza</label>`);
  formulario += (`<select class="multisteps-form__input form-control" name="cod_natureza_despeza" id="cod_natureza_despeza" maxlength="45">`);

  formulario += resultadoNatureza;

  formulario += (`</select>`);
  formulario += (`<label for="cod_classe_empenho">Código da Classe</label>`);
  formulario += (`<select class="multisteps-form__input form-control" name="cod_classe_empenho" id="cod_classe_empenho" maxlength="45">`);

  formulario += resultadoClasse;

  formulario += (`</select>`);
  formulario += (`<label for="descricao">Descrição</label>`);
  formulario += (`<textarea class="multisteps-form__input form-control" name="descricao" id="descricao" maxlength="100"></textarea>`);
  formulario += (`<label for="unidade">Unidade</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="unidade" id="unidade" maxlength="45"></input>`);

  document.getElementById("modalAdicao").innerHTML = formulario;
  let botao = (`<button class="btn btn-primary multi-button ml-auto js-btn-next" type="button" onclick="envioItem()" title="Next">Adicionar</button>`);
  document.getElementById("botaoEnvio").innerHTML = botao;
}
function envioItem() {
  let info = {
    "cod_item": parseInt(document.getElementById("cod_item").value),
    "cod_tipo_item": parseInt(document.getElementById("cod_tipo_item").value),
    "cod_natureza_despeza": parseInt(document.getElementById("cod_natureza_despeza").value),
    "cod_classe_empenho": parseInt(document.getElementById("cod_classe_empenho").value),
    "descricao": document.getElementById("descricao").value,
    "unidade": document.getElementById("unidade").value,
  };
  enviar("itens",info,'POST');
}
function visItem() {
  visualizar("itens", `<th style="width:10%" scope="col">Código do Item</th>
  <th style="width:10%" scope="col">Código do Tipo de Item</th>
  <th style="width:10%" scope="col">Código da Natureza</th>
  <th style="width:10%" scope="col">Código da Classe</th>
  <th style="width:45%" scope="col">Descrição</th>
  <th style="width:10%" scope="col">Unidade</th>`, ["cod_item", "cod_tipo_item", "cod_natureza_despesa", "cod_classe_empenho", "descricao", "unidade"]);
}
function edititem(){}
function edititem2(){}



//informaçãoes para modulo
function addModulo() {
  let formulario = (`<label for="cod_modulo">Código do Módulo</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="cod_modulo" id="cod_modulo"></input>`);
  formulario += (`<label for="categoria_1">Categoria 1</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="categoria_1" id="categoria_1" maxlength="45"></input>`);
  formulario += (`<label for="categoria_2">Categoria 2</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="categoria_2" id="categoria_2" maxlength="45"></input>`);
  formulario += (`<label for="categoria_3">Categoria 3</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="categoria_3" id="categoria_3" maxlength="45"></input>`);
  formulario += (`<label for="descricao">Descrição</label>`);
  formulario += (`<textarea class="multisteps-form__input form-control" name="descricao" id="descricao" maxlength="200"></textarea>`);

  document.getElementById("modalAdicao").innerHTML = formulario;
  let botao = (`<button class="btn btn-primary multi-button ml-auto js-btn-next" type="button" onclick="envioModulo()" title="Next">Adicionar</button>`);
  document.getElementById("botaoEnvio").innerHTML = botao;
}
function envioModulo() {
  let info = {
    "cod_modulo": parseInt(document.getElementById("cod_modulo").value),
    "categoria_1": document.getElementById("categoria_1").value,
    "categoria_2": document.getElementById("categoria_2").value,
    "categoria_3": document.getElementById("categoria_3").value,
    "descricao": document.getElementById("descricao").value,
  };
  enviar("modulo",info,'POST');
}
function visModulo() {
  visualizar("modulo", `<th style="width:20%" scope="col">Código de Modulo</th>
  <th style="width:10%" scope="col">Categoria 1</th>
  <th style="width:10%" scope="col">Categoria 2</th>
  <th style="width:10%" scope="col">Categoria 3</th>
  <th style="width:45%" scope="col">Descrição</th>`, ["cod_modulo", "categoria_1", "categoria_2", "categoria_3", "descricao"]);
}
function editmodulo(){}
function editmodulo2(){}



//informaçãoes para municipio
function addMunicipio() {
  let formulario = (`<label for="cod_ibge">Código do IBGE</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="cod_ibge" id="cod_ibge"></input>`);
  formulario += (`<label for="nome_municipio">Nome do Município</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="nome_municipio" id="nome_municipio" maxlength="50"></input>`);
  formulario += (`<label for="populacao">População</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="populacao" id="populacao"></input>`);
  formulario += (`<label for="uf">UF</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="uf" id="uf" maxlength="2"></input>`);
  formulario += (`<label for="regiao">Região</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="regiao" id="regiao" maxlength="15"></input>`);
  formulario += (`<label for="cnpj">CNPJ</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="cnpj" id="cnpj" maxlength="14"></input>`);
  formulario += (`<label for="dist_capital">Capital Distrital</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="dist_capital" id="dist_capital"></input>`);
  formulario += (`<label for="endereco">Endereço</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="endereco" id="endereco" maxlength="45"></input>`);
  formulario += (`<label for="numero">Número</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="numero" id="numero" maxlength="10"></input>`);
  formulario += (`<label for="complemento">Complemento</label>`);
  formulario += (`<textarea class="multisteps-form__input form-control" name="complemento" id="complemento" maxlength="250"></textarea>`);
  formulario += (`<label for="bairro">Bairro</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="bairro" id="bairro" maxlength="45"></input>`);
  formulario += (`<label for="idhm">IDHM</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="idhm" id="idhm"></input>`);
  formulario += (`<label for="latitude">Latitude</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="latitude" id="latitude"></input>`);
  formulario += (`<label for="longitude">Longitude</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="longitude" id="longitude"></input>`);
  document.getElementById("modalAdicao").innerHTML = formulario;

  let botao = (`<button class="btn btn-primary multi-button ml-auto js-btn-next" type="button" onclick="envioMunicipio()" title="Next">Adicionar</button>`);
  document.getElementById("botaoEnvio").innerHTML = botao;
}
function envioMunicipio() {
  let info = {
    "cod_ibge": document.getElementById("cod_ibge").value,
    "nome_municipio": parseInt(document.getElementById("nome_municipio").value),
    "populacao": parseInt(document.getElementById("populacao").value),
    "uf": parseInt(document.getElementById("uf").value),
    "regiao": parseInt(document.getElementById("regiao").value),
    "cnpj": parseInt(document.getElementById("cnpj").value),
    "dist_capital": parseInt(document.getElementById("dist_capital").value),
    "endereco": parseInt(document.getElementById("endereco").value),
    "numero": parseInt(document.getElementById("numero").value),
    "complemento": parseInt(document.getElementById("complemento").value),
    "bairro": document.getElementById("bairro").value,
    "idhm": document.getElementById("idhm").value,
    "latitude": document.getElementById("latitude").value,
    "longitude": document.getElementById("longitude").value,
  };
  enviar("municipio",info,'POST');
}
function visMunicipio() {
  visualizar("municipio", `<th style="width:5%" scope="col">Código do IBGE</th>
  <th style="width:10%" scope="col">Nome do Município</th>
  <th style="width:5%" scope="col">População</th>
  <th style="width:5%" scope="col">UF</th>
  <th style="width:5%" scope="col">Região</th>
  <th style="width:5%" scope="col">CNPJ</th>
  <th style="width:10%" scope="col">Capital Distrital</th>
  <th style="width:10%" scope="col">Endereço</th>
  <th style="width:5%" scope="col">Número</th>
  <th style="width:10%" scope="col">Complemento</th>
  <th style="width:10%" scope="col">Bairro</th>
  <th style="width:5%" scope="col">IDHM</th>
  <th style="width:5%" scope="col">Latitude</th>
  <th style="width:5%" scope="col">Longitude</th>`, ["cod_ibge", "nome_municipio", "populacao", "uf", "regiao", "cnpj", "dist_capital", "endereco", "numero", "complemento", "bairro", "idhm", "latitude", "longitude"]);
}
function editmunicipio(){}
function editmunicipio2(){}


//informaçãoes para natureza de despesas
function addNaturezaDespesa() {
  let formulario = (`<label for="cod_natureza_despesa">Código da Natureza</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="cod_natureza_despesa" id="cod_natureza_despesa"></input>`);
  formulario += (`<label for="descricao">Descrição</label>`);
  formulario += (`<textarea class="multisteps-form__input form-control" name="descricao" id="descricao" maxlength="100"></textarea>`);
  document.getElementById("modalAdicao").innerHTML = formulario;

  let botao = (`<button class="btn btn-primary multi-button ml-auto js-btn-next" type="button" onclick="envioNaturezaDespesa()" title="Next">Adicionar</button>`);
  document.getElementById("botaoEnvio").innerHTML = botao;
}
function envioNaturezaDespesa() {
  let info = {
    "cod_natureza_despesa": parseInt(document.getElementById("cod_natureza_despesa").value),
    "descricao": document.getElementById("descricao").value,
  };
  enviar("naturezadespesa",info,'POST');
}
function visNaturezaDespesa() {
  visualizar("naturezadespesa", `<th style="width:20%" scope="col">Código da Natureza da Despesa</th>
  <th style="width:75%" scope="col">Descrição</th>`, ["cod_natureza_despesa", "descricao"]);
}
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
function addPrefeitos() {
  let formulario = (`<label for="cod_prefeito">Código do Prefeito</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="cod_prefeito" id="cod_prefeito"></input>`);
  formulario += (`<label for="cod_ibge">Código do IBGE</label>`);
  formulario += (`<select class="multisteps-form__select form-control" name="cod_ibge" id="cod_ibge" maxlength="7">`);

  formulario += resultadoPrefeitos;

  formulario += (`</select>`);
  formulario += (`<label for="nome">Nome</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="nome" id="nome" maxlength="45"></input>`);
  formulario += (`<label for="cpf">CPF</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="cpf" id="cpf" maxlength="11"></input>`);
  formulario += (`<label for="rg">RG</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="rg" id="rg" maxlength="20"></input>`);
  formulario += (`<label for="partido">Partido</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="partido" id="partido" maxlength="45"></input>`);
  formulario += (`<label for="exercicio">Exercício</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="exercicio" id="exercicio" maxlength="45"></input>`);
  document.getElementById("modalAdicao").innerHTML = formulario;

  let botao = (`<button class="btn btn-primary multi-button ml-auto js-btn-next" type="button" onclick="envioPrefeitos()" title="Next">Adicionar</button>`);
  document.getElementById("botaoEnvio").innerHTML = botao;
}
function envioPrefeitos() {
  let info = {
    "cod_ibge": parseInt(document.getElementById("cod_ibge").value),
    "nome": document.getElementById("nome").value,
    "cpf": document.getElementById("cpf").value,
    "rg": document.getElementById("rg").value,
    "partido": document.getElementById("partido").value,
    "exercicio": document.getElementById("exercicio").value,
  };
  enviar("prefeitos",info,'POST');
}
function visPrefeitos() {
  visualizar("prefeitos", `<th style="width:10%" scope="col">Código do IBGE</th>
  <th style="width:10%" scope="col">Nome</th>
  <th style="width:20%" scope="col">CPF</th>
  <th style="width:20%" scope="col">RG</th>
  <th style="width:20%" scope="col">Partido</th>
  <th style="width:15%" scope="col">Exercício</th>`, ["cod_ibge", "nome", "cpf", "rg", "partido", "exercicio"]);
}
function editprefeitos(){}
function editprefeitos2(){}


//informaçãoes para Tipo de item
function addTipoItem() {
  let formulario = (`<label for="cod_tipo_item">Código do Tipo de Item</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="cod_tipo_item" id="cod_tipo_item" maxlength="100"></input>`);
  formulario += (`<label for="descricao">Descrição</label>`);
  formulario += (`<textarea class="multisteps-form__input form-control" name="descricao" id="descricao" maxlength="100"></textarea>`);
  document.getElementById("modalAdicao").innerHTML = formulario;

  let botao = (`<button class="btn btn-primary multi-button ml-auto js-btn-next" type="button" onclick="envioTipoItem()" title="Next">Adicionar</button>`);
  document.getElementById("botaoEnvio").innerHTML = botao;
}
function envioTipoItem() {
  let info = {
    "cod_tipo_item": parseInt(document.getElementById("cod_tipo_item").value),
    "descricao": document.getElementById("descricao").value,
  };
  enviar("tipoitem",info,'POST');
}
function visTipoItem() {
  visualizar("tipoitem", `<th style="width:20%" scope="col">Código de Tipo de Item</th>
  <th style="width:75%" scope="col">Descrição</th>`, ["cod_tipo_item", "descricao"]);
}
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
function addTipologia() {
  let formulario = (`<label for="descricao">Descrição</label>`);
  formulario += (`<textarea class="multisteps-form__input form-control" name="descricao" id="descricao" maxlength="45"></textarea>`);
  document.getElementById("modalAdicao").innerHTML = formulario;

  let botao = (`<button class="btn btn-primary multi-button ml-auto js-btn-next" type="button" onclick="envioTipologia()" title="Next">Adicionar</button>`);
  document.getElementById("botaoEnvio").innerHTML = botao;
}
function envioTipologia() {
  let info = {
    "descricao": document.getElementById("descricao").value,
  };
  enviar("tipologia",info,'POST');
}
function visTipologia() {
  visualizar("tipologia", `<th style="width:20%" scope="col">Código de Tipologia</th>
  <th style="width:75%" scope="col">Descrição</th>`, ["cod_tipologia", "descricao"]);
}
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



function visualizar(caminho,titulo,estrutura) {
  //função fetch para chamar os itens de previsão da tabela
  fetch(servidor + 'read/' + caminho, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //checar os status de pedidos
    //console.log(response)

    //tratamento dos erros
    if (response.status == 200) {
      //console.log(response.statusText);

      //pegar o json que possui a tabela
      response.json().then(function (json) {

        let tabela = (`<thead style="background: #4b5366; color:white; font-size:15px">
        <tr>` + titulo + `
        <th style="width:5%" scope="col">Editar</th>
        </tr>
        </thead>`);
        tabela += (`<tbody>`);

        //console.log(json);

        for (i = 0; i < json.length; i++) {
          //produz a lista da tabela
          tabela += (`<tr>`);

          for (j = 0; j < estrutura.length; j++) {
            tabela += (`<td id="` + estrutura[j] + `">`);
            tabela += json[i][estrutura[j]];
            tabela += (`</td>`);
          }

          tabela += (`<td> <span class="d-flex">
          <button id="botaoEdicao" onclick="edit` + caminho + `(` + i + `)" class="btn btn-success"><i class="material-icons"data-toggle="tooltip" title="Edit">&#xE254;</i></button>
          </span> </td> </tr>`);
        }
        tabela += (`</tbody>`);
        document.getElementById("tabela").innerHTML = tabela;
      });
    } else {
      erros(response.status);
    }
  });
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