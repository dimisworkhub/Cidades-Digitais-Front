//captura valores para os "selects" futuros
let resultadoClasse;
let resultadoNatureza;
let resultadoMunicipio;

let codAdmin = localStorage.getItem("administracao");

//para colocar no meio de estruturas HTML e organiza-las para o módulo
let divInicio = '<div class="col-12 col-sm-12 mt-4">';
let divMeio = '</div><div class="col-12 col-sm-12 mt-4">';
let divFim = '</div>';

//estrutura para fazer o processo funcionar
let caminho;
let titulo;
let estrutura =[];

//utilizado apenas para
let paraEdicao;

window.onload = function () {
  mascara();
  selecionaAdmin(codAdmin);
  //console.log(codAdmin);
}



//FUNÇÕES DE EDIÇÃO ESCRITAS DE FORMA A USAREM OS PROPRIOS CAMINHOS COMO PARTE DO PROCESSO DE CHAMADA



function selecionaAdmin(meuAdmin){
  if(meuAdmin == 1){
    visAssunto();
    document.getElementById("titulo1").innerHTML = "Tabela Assunto";
    document.getElementById("titulo2").innerHTML = "Tabela Assunto";
  }
  else if(meuAdmin == 2){
    visCategoria();
    document.getElementById("titulo1").innerHTML = "Tabela Categoria";
    document.getElementById("titulo2").innerHTML = "Tabela Categoria";
  }
  else if(meuAdmin == 3){
    visClasseEmpenho();
    document.getElementById("titulo1").innerHTML = "Tabela Classe de Empenho";
    document.getElementById("titulo2").innerHTML = "Tabela Classe de Empenho";
  }
  else if(meuAdmin == 4){
    visEtapa();
    document.getElementById("titulo1").innerHTML = "Tabela Etapa";
    document.getElementById("titulo2").innerHTML = "Tabela Etapa";
  }
  else if(meuAdmin == 5){
    selectClasse();
    selectNatureza();
    visItem();
    document.getElementById("titulo1").innerHTML = "Tabela Itens";
    document.getElementById("titulo2").innerHTML = "Tabela Itens";
  }
  else if(meuAdmin == 6){
    visModulo();
    document.getElementById("titulo1").innerHTML = "Tabela Modulos";
    document.getElementById("titulo2").innerHTML = "Tabela Modulos";
  }
  else if(meuAdmin == 7){
    visMunicipio();
    document.getElementById("titulo1").innerHTML = "Tabela Municipios";
    document.getElementById("titulo2").innerHTML = "Tabela Municipios";
  }
  else if(meuAdmin == 8){
    visNaturezaDespesa();
    document.getElementById("titulo1").innerHTML = "Tabela Natureza de Despesa";
    document.getElementById("titulo2").innerHTML = "Tabela Natureza de Despesa";
  }
  else if(meuAdmin == 9){
    selectMunicipio();
    visPrefeito();
    document.getElementById("titulo1").innerHTML = "Tabela Prefeito";
    document.getElementById("titulo2").innerHTML = "Tabela Prefeito";
  }
  else if(meuAdmin == 10){
    visTipoItem();
    document.getElementById("titulo1").innerHTML = "Tabela Tipo de Item";
    document.getElementById("titulo2").innerHTML = "Tabela Tipo de Item";
  }
  else if(meuAdmin == 11){
    visTipologia();
    document.getElementById("titulo1").innerHTML = "Tabela Tipologia";
    document.getElementById("titulo2").innerHTML = "Tabela Tipologia";
  }
  else{
    alert("Erro desconhecido. Redirecionando para a página inicial.");
    window.location.href = "./home.html";
  }
}



function adicionaAdmin(meuAdmin){
  if(meuAdmin == 1){
    addAssunto();
    document.getElementById("titulo3").innerHTML = "Tabela para Assunto";
  }
  else if(meuAdmin == 2){
    addCategoria();
    document.getElementById("titulo3").innerHTML = "Tabela para Categoria";
  }
  else if(meuAdmin == 3){
    addClasseEmpenho();
    document.getElementById("titulo3").innerHTML = "Tabela para Classe de Empenho";
  }
  else if(meuAdmin == 4){
    addEtapa();
    document.getElementById("titulo3").innerHTML = "Tabela para Etapa";
  }
  else if(meuAdmin == 5){
    addItem();
    document.getElementById("titulo3").innerHTML = "Tabela para Item";
  }
  else if(meuAdmin == 6){
    addModulo();
    document.getElementById("titulo3").innerHTML = "Tabela para Módulo";
  }
  else if(meuAdmin == 7){
    addMunicipio();
    document.getElementById("titulo3").innerHTML = "Tabela para Município";
  }
  else if(meuAdmin == 8){
    addNaturezaDespesa();
    document.getElementById("titulo3").innerHTML = "Tabela para Natureza de Despesa";
  }
  else if(meuAdmin == 9){
    addPrefeito();
    document.getElementById("titulo3").innerHTML = "Tabela para Prefeito";
  }
  else if(meuAdmin == 10){
    addTipoItem();
    document.getElementById("titulo3").innerHTML = "Tabela para Tipo de Item";
  }
  else if(meuAdmin == 11){
    addTipologia();
    document.getElementById("titulo3").innerHTML = "Tabela para Tipologia";
  }
  else{
    alert("Erro desconhecido. Redirecionando para a página inicial.");
    window.location.href = "./home.html";
  }
}



//informaçãoes para assunto
function addAssunto() {
  let formulario = divInicio;
  formulario += (`<label for="descricao">Descrição</label>`);
  formulario += (`<textarea class="multisteps-form__input form-control" name="descricao" id="adddescricao" maxlength="45" value=""></textarea>`);
  formulario += divFim;
  document.getElementById("modalAdicao").innerHTML = formulario;

  let botao = (`<button class="btn btn-primary multi-button ml-auto" type="button" onclick="envioAssunto()" title="Adicionar">Adicionar</button>`);
  document.getElementById("botaoEnvio").innerHTML = botao;

}
function envioAssunto() {
  let info = {
    "descricao": document.getElementById("adddescricao").value,
  };
  enviar("assunto",info,'POST');
}
function visAssunto() {
  caminho = "assunto";
  titulo = `<th style="width:20%" scope="col">Código do Assunto</th>
  <th style="width:75%" scope="col">Descrição</th>`;
  estrutura = ["cod_assunto", "descricao"];
  paginacao();
}
function editassunto(valor){
  localStorage.setItem("cod_assunto", paraEdicao[valor].cod_assunto);
  localStorage.setItem("descricao", paraEdicao[valor].descricao);
  window.location.href = "./gerenciaAdministracao.html";
}



//informaçãoes para categoria
function addCategoria() {
  let formulario = divInicio;
  formulario += (`<label for="descricao">Descrição</label>`);
  formulario += (`<textarea class="multisteps-form__input form-control" name="descricao" id="adddescricao" maxlength="45"></textarea>`);
  formulario += divFim;
  document.getElementById("modalAdicao").innerHTML = formulario;

  let botao = (`<button class="btn btn-primary multi-button ml-auto" type="button" onclick="envioCategoria()" title="Adicionar">Adicionar</button>`);
  document.getElementById("botaoEnvio").innerHTML = botao;
}
function envioCategoria() {
  let info = {
    "descricao": document.getElementById("adddescricao").value,
  };
  enviar("categoria",info,'POST');
}
function visCategoria() {
  caminho = "categoria";
  titulo = `<th style="width:20%" scope="col">Código da Categoria</th>
  <th style="width:75%" scope="col">Descrição</th>`;
  estrutura = ["cod_categoria", "descricao"];
  paginacao();
}
function editcategoria(valor){
  localStorage.setItem("cod_categoria", paraEdicao[valor].cod_categoria);
  localStorage.setItem("descricao", paraEdicao[valor].descricao);
  window.location.href = "./gerenciaAdministracao.html";
}



//informaçãoes para classe de empenho
function addClasseEmpenho() {
  let formulario = divInicio
  formulario += (`<label for="cod_classe_empenho">Código da Classe de Empenho</label>`);
  formulario += (`<input class="multisteps-form__input form-control inteiros" name="cod_classe_empenho" id="addcod_classe_empenho"></input>`);
  formulario += divMeio;
  formulario += (`<label for="descricao">Descrição</label>`);
  formulario += (`<textarea class="multisteps-form__input form-control" name="descricao" id="adddescricao" maxlength="100"></textarea>`);
  formulario += divFim;
  document.getElementById("modalAdicao").innerHTML = formulario;

  let botao = (`<button class="btn btn-primary multi-button ml-auto" type="button" onclick="envioClasseEmpenho()" title="Adicionar">Adicionar</button>`);
  document.getElementById("botaoEnvio").innerHTML = botao;
}
function envioClasseEmpenho() {
  let info = {
    "cod_classe_empenho": parseInt(document.getElementById("addcod_classe_empenho").value),
    "descricao": document.getElementById("adddescricao").value,
  };
  enviar("classeempenho",info,'POST');
}
function visClasseEmpenho() {
  caminho = "classeempenho";
  titulo = `<th style="width:20%" scope="col">Código de Classe de Empenho</th>
  <th style="width:75%" scope="col">Descrição</th>`;
  estrutura = ["cod_classe_empenho", "descricao"];
  paginacao();
}
function editclasseempenho(valor){
  localStorage.setItem("cod_classe_empenho", paraEdicao[valor].cod_classe_empenho);
  localStorage.setItem("descricao", paraEdicao[valor].descricao);
  window.location.href = "./gerenciaAdministracao.html";
}



//informaçãoes para etapas
function addEtapa() {
  let formulario = divInicio;
  formulario += (`<label for="descricao">Descrição</label>`);
  formulario += (`<textarea class="multisteps-form__input form-control" name="descricao" id="adddescricao" maxlength="45"></textarea>`);
  formulario += divMeio;
  formulario += (`<label for="duracao">Duração</label>`);
  formulario += (`<input class="multisteps-form__input form-control inteiros" name="duracao" id="addduracao"></input>`);
  formulario += divMeio;
  formulario += (`<label for="depende">Depende</label>`);
  formulario += (`<input class="multisteps-form__input form-control inteiros" name="depende" id="adddepende"></input>`);
  formulario += divMeio;
  formulario += (`<label for="delay">Delay</label>`);
  formulario += (`<input class="multisteps-form__input form-control inteiros" name="delay" id="adddelay"></input>`);
  formulario += divMeio;
  formulario += (`<label for="setor_resp">Setor Responsável</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="setor_resp" id="addsetor_resp" maxlength="45"></input>`);
  formulario += divFim;
  document.getElementById("modalAdicao").innerHTML = formulario;

  let botao = (`<button class="btn btn-primary multi-button ml-auto" type="button" onclick="envioEtapa()" title="Adicionar">Adicionar</button>`);
  document.getElementById("botaoEnvio").innerHTML = botao;
}
function envioEtapa() {
  let info = {
    "descricao": document.getElementById("adddescricao").value,
    "duracao": parseInt(document.getElementById("addduracao").value),
    "depende": parseInt(document.getElementById("adddepende").value),
    "delay": parseInt(document.getElementById("adddelay").value),
    "setor_resp": document.getElementById("addsetor_resp").value,
  };
  enviar("etapa",info,'POST');
}
function visEtapa() {
  caminho = "etapa";
  titulo = `<th style="width:10%" scope="col">Código de Etapas</th>
  <th style="width:40%" scope="col">Descrição</th>
  <th style="width:10%" scope="col">Duração</th>
  <th style="width:10%" scope="col">Depende</th>
  <th style="width:10%" scope="col">Delay</th>
  <th style="width:15%" scope="col">Setor Responsável</th>`;
  estrutura = ["cod_etapa", "descricao", "duracao", "depende", "delay", "setor_resp"];
  paginacao();
}
function editetapa(valor){
  localStorage.setItem("cod_etapa", paraEdicao[valor].cod_etapa);
  localStorage.setItem("descricao", paraEdicao[valor].descricao);
  localStorage.setItem("duracao", paraEdicao[valor].duracao);
  localStorage.setItem("depende", paraEdicao[valor].depende);
  localStorage.setItem("delay", paraEdicao[valor].delay);
  localStorage.setItem("setor_resp", paraEdicao[valor].setor_resp);
  window.location.href = "./gerenciaAdministracao.html";
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
function addItem() {
  let formulario = divInicio;
  formulario += (`<label for="cod_item">Código do Item</label>`);
  formulario += (`<input class="multisteps-form__input form-control inteiros" name="addcod_item" id="addcod_item"></input>`);
  formulario += divMeio;
  formulario += (`<label for="cod_tipo_item">Código do Tipo de Item</label>`);
  formulario += (`<input class="multisteps-form__input form-control inteiros" name="cod_tipo_item" id="addcod_tipo_item"></input>`);
  formulario += divMeio;
  formulario += (`<label for="cod_natureza_despesa">Código da Natureza</label>`);
  formulario += (`<select class="multisteps-form__input form-control inteiros" name="cod_natureza_despesa" id="addcod_natureza_despesa" maxlength="45">`);

  formulario += resultadoNatureza;

  formulario += (`</select>`);
  
  formulario += divMeio;

  formulario += (`<label for="cod_classe_empenho">Código da Classe</label>`);
  formulario += (`<select class="multisteps-form__input form-control inteiros" name="cod_classe_empenho" id="addcod_classe_empenho" maxlength="45">`);

  formulario += resultadoClasse;

  formulario += (`</select>`);
  
  formulario += divMeio;

  formulario += (`<label for="descricao">Descrição</label>`);
  formulario += (`<textarea class="multisteps-form__input form-control" name="descricao" id="adddescricao" maxlength="100"></textarea>`);
  formulario += divMeio;
  formulario += (`<label for="unidade">Unidade</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="unidade" id="addunidade" maxlength="45"></input>`);
  formulario += divFim;
  document.getElementById("modalAdicao").innerHTML = formulario;

  let botao = (`<button class="btn btn-primary multi-button ml-auto" type="button" onclick="envioItem()" title="Adicionar">Adicionar</button>`);
  document.getElementById("botaoEnvio").innerHTML = botao;
}
function envioItem() {
  let info = {
    "cod_item": parseInt(document.getElementById("addcod_item").value),
    "cod_tipo_item": parseInt(document.getElementById("addcod_tipo_item").value),
    "cod_natureza_despesa": parseInt(document.getElementById("addcod_natureza_despesa").value),
    "cod_classe_empenho": parseInt(document.getElementById("addcod_classe_empenho").value),
    "descricao": document.getElementById("adddescricao").value,
    "unidade": document.getElementById("addunidade").value,
  };
  enviar("itens",info,'POST');
}
function visItem() {
  caminho = "itens";
  titulo = `<th style="width:10%" scope="col">Código do Item</th>
  <th style="width:10%" scope="col">Código do Tipo de Item</th>
  <th style="width:10%" scope="col">Natureza de Despeza</th>
  <th style="width:10%" scope="col">Classe de Empenho</th>
  <th style="width:45%" scope="col">Descrição</th>
  <th style="width:10%" scope="col">Unidade</th>`;
  estrutura = ["cod_item", "cod_tipo_item", "cod_natureza_despesa", "cod_classe_empenho", "descricao", "unidade"];
  paginacao();
}
function edititens(valor){
  localStorage.setItem("cod_item", paraEdicao[valor].cod_item);
  localStorage.setItem("cod_tipo_item", paraEdicao[valor].cod_tipo_item);
  localStorage.setItem("cod_natureza_despesa", paraEdicao[valor].cod_natureza_despesa);
  localStorage.setItem("cod_classe_empenho", paraEdicao[valor].cod_classe_empenho);
  localStorage.setItem("descricao", paraEdicao[valor].descricao);
  localStorage.setItem("unidade", paraEdicao[valor].unidade);
  window.location.href = "./gerenciaAdministracao.html";
}



//informaçãoes para modulo
function addModulo() {
  let formulario = divInicio;
  formulario += (`<label for="cod_modulo">Código do Módulo</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="cod_modulo" id="addcod_modulo"></input>`);
  formulario += divMeio;
  formulario += (`<label for="categoria_1">Categoria 1</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="categoria_1" id="addcategoria_1" maxlength="45"></input>`);
  formulario += divMeio;
  formulario += (`<label for="categoria_2">Categoria 2</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="categoria_2" id="addcategoria_2" maxlength="45"></input>`);
  formulario += divMeio;
  formulario += (`<label for="categoria_3">Categoria 3</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="categoria_3" id="addcategoria_3" maxlength="45"></input>`);
  formulario += divMeio;
  formulario += (`<label for="descricao">Descrição</label>`);
  formulario += (`<textarea class="multisteps-form__input form-control" name="descricao" id="adddescricao" maxlength="200"></textarea>`);
  formulario += divFim;
  document.getElementById("modalAdicao").innerHTML = formulario;

  let botao = (`<button class="btn btn-primary multi-button ml-auto" type="button" onclick="envioModulo()" title="Adicionar">Adicionar</button>`);
  document.getElementById("botaoEnvio").innerHTML = botao;
}
function envioModulo() {
  let info = {
    "cod_modulo": parseInt(document.getElementById("addcod_modulo").value),
    "categoria_1": document.getElementById("addcategoria_1").value,
    "categoria_2": document.getElementById("addcategoria_2").value,
    "categoria_3": document.getElementById("addcategoria_3").value,
    "descricao": document.getElementById("adddescricao").value,
  };
  enviar("modulo",info,'POST');
}
function visModulo() {
  caminho = "modulo";
  titulo = `<th style="width:20%" scope="col">Código de Modulo</th>
  <th style="width:10%" scope="col">Categoria 1</th>
  <th style="width:10%" scope="col">Categoria 2</th>
  <th style="width:10%" scope="col">Categoria 3</th>
  <th style="width:45%" scope="col">Descrição</th>`;
  estrutura = ["cod_modulo", "categoria_1", "categoria_2", "categoria_3", "descricao"];
  paginacao();
}
function editmodulo(valor){
  localStorage.setItem("cod_modulo", paraEdicao[valor].cod_modulo);
  localStorage.setItem("categoria_1", paraEdicao[valor].categoria_1);
  localStorage.setItem("categoria_2", paraEdicao[valor].categoria_2);
  localStorage.setItem("categoria_3", paraEdicao[valor].categoria_3);
  localStorage.setItem("descricao", paraEdicao[valor].descricao);
  window.location.href = "./gerenciaAdministracao.html";
}



//informaçãoes para municipio
function addMunicipio() {
  let formulario = divInicio;
  formulario += (`<label for="cod_ibge">Código do IBGE</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="cod_ibge" id="addcod_ibge"></input>`);
  formulario += divMeio;
  formulario += (`<label for="descricao_municipio">Nome do Município</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="nome_municipio" id="addnome_municipio" maxlength="50"></input>`);
  formulario += divMeio;
  formulario += (`<label for="populacao">População</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="populacao" id="addpopulacao"></input>`);
  formulario += divMeio;
  formulario += (`<label for="uf">UF</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="uf" id="adduf" maxlength="2"></input>`);
  formulario += divMeio;
  formulario += (`<label for="regiao">Região</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="regiao" id="addregiao" maxlength="15"></input>`);
  formulario += divMeio;
  formulario += (`<label for="cnpj">CNPJ</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="cnpj" id="addcnpj" maxlength="14"></input>`);
  formulario += divMeio;
  formulario += (`<label for="dist_capital">Capital Distrital</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="dist_capital" id="adddist_capital"></input>`);
  formulario += divMeio;
  formulario += (`<label for="endereco">Endereço</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="endereco" id="addendereco" maxlength="45"></input>`);
  formulario += divMeio;
  formulario += (`<label for="numero">Número</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="numero" id="addnumero" maxlength="10"></input>`);
  formulario += divMeio;
  formulario += (`<label for="complemento">Complemento</label>`);
  formulario += (`<textarea class="multisteps-form__input form-control" name="complemento" id="addcomplemento" maxlength="250"></textarea>`);
  formulario += divMeio;
  formulario += (`<label for="bairro">Bairro</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="bairro" id="addbairro" maxlength="45"></input>`);
  formulario += divMeio;
  formulario += (`<label for="idhm">IDHM</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="idhm" id="addidhm"></input>`);
  formulario += divMeio;
  formulario += (`<label for="latitude">Latitude</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="latitude" id="addlatitude"></input>`);
  formulario += divMeio;
  formulario += (`<label for="longitude">Longitude</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="longitude" id="addlongitude"></input>`);
  formulario += divFim;
  document.getElementById("modalAdicao").innerHTML = formulario;

  let botao = (`<button class="btn btn-primary multi-button ml-auto" type="button" onclick="envioMunicipio()" title="Adicionar">Adicionar</button>`);
  document.getElementById("botaoEnvio").innerHTML = botao;
}
function envioMunicipio() {
  let info = {
    "cod_ibge": parseInt(document.getElementById("addcod_ibge").value),
    "nome_municipio": document.getElementById("addnome_municipio").value,
    "populacao": parseInt(document.getElementById("addpopulacao").value),
    "uf": document.getElementById("adduf").value,
    "regiao": document.getElementById("addregiao").value,
    "cnpj": document.getElementById("addcnpj").value,
    "dist_capital": parseInt(document.getElementById("adddist_capital").value),
    "endereco": document.getElementById("addendereco").value,
    "numero": document.getElementById("addnumero").value,
    "complemento": document.getElementById("addcomplemento").value,
    "bairro": document.getElementById("addbairro").value,
    "idhm": parseFloat(document.getElementById("addidhm").value),
    "latitude": parseFloat(document.getElementById("addlatitude").value),
    "longitude": parseFloat(document.getElementById("addlongitude").value),
  };
  enviar("municipio",info,'POST');
}
function visMunicipio() {
  caminho = "municipio";
  titulo = `<th style="width:5%" scope="col">Código do IBGE</th>
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
  <th style="width:5%" scope="col">Longitude</th>`;
  estrutura = ["cod_ibge", "nome_municipio", "populacao", "uf", "regiao", "cnpj", "dist_capital", "endereco", "numero", "complemento", "bairro", "idhm", "latitude", "longitude"];
  paginacao();
}
function editmunicipio(valor){
  localStorage.setItem("cod_ibge", paraEdicao[valor].cod_ibge);
  localStorage.setItem("nome_municipio", paraEdicao[valor].nome_municipio);
  localStorage.setItem("populacao", paraEdicao[valor].populacao);
  localStorage.setItem("uf", paraEdicao[valor].uf);
  localStorage.setItem("regiao", paraEdicao[valor].regiao);
  localStorage.setItem("cnpj", paraEdicao[valor].cnpj);
  localStorage.setItem("dist_capital", paraEdicao[valor].dist_capital);
  localStorage.setItem("endereco", paraEdicao[valor].endereco);
  localStorage.setItem("numero", paraEdicao[valor].numero);
  localStorage.setItem("complemento", paraEdicao[valor].complemento);
  localStorage.setItem("bairro", paraEdicao[valor].bairro);
  localStorage.setItem("idhm", paraEdicao[valor].idhm);
  localStorage.setItem("latitude", paraEdicao[valor].latitude);
  localStorage.setItem("longitude", paraEdicao[valor].longitude);
  window.location.href = "./gerenciaAdministracao.html";
}



//informaçãoes para natureza de despesas
function addNaturezaDespesa() {
  let formulario = divInicio;
  formulario += (`<label for="cod_natureza_despesa">Código de Natureza de Despesa</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="cod_natureza_despesa" id="addcod_natureza_despesa"></input>`);
  formulario += divMeio;
  formulario += (`<label for="descricao">Descrição</label>`);
  formulario += (`<textarea class="multisteps-form__input form-control" name="descricao" id="adddescricao" maxlength="100"></textarea>`);
  formulario += divFim;
  document.getElementById("modalAdicao").innerHTML = formulario;

  let botao = (`<button class="btn btn-primary multi-button ml-auto" type="button" onclick="envioNaturezaDespesa()" title="Adicionar">Adicionar</button>`);
  document.getElementById("botaoEnvio").innerHTML = botao;
}
function envioNaturezaDespesa() {
  let info = {
    "cod_natureza_despesa": parseInt(document.getElementById("addcod_natureza_despesa").value),
    "descricao": document.getElementById("adddescricao").value,
  };
  enviar("naturezadespesa",info,'POST');
}
function visNaturezaDespesa() {
  caminho = "naturezadespesa";
  titulo = `<th style="width:20%" scope="col">Código da Natureza da Despesa</th>
  <th style="width:75%" scope="col">Descrição</th>`;
  estrutura = ["cod_natureza_despesa", "descricao"];
  paginacao();
}
function editnaturezadespesa(valor){
  localStorage.setItem("cod_natureza_despesa", paraEdicao[valor].cod_natureza_despesa);
  localStorage.setItem("descricao", paraEdicao[valor].descricao);
  window.location.href = "./gerenciaAdministracao.html";
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
function addPrefeito() {
  let formulario = divInicio;
  formulario += (`<label for="cod_prefeito">Código do Prefeito</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="cod_prefeito" id="addcod_prefeito"></input>`);
  formulario += divMeio;
  formulario += (`<label for="cod_ibge">Código do IBGE</label>`);
  formulario += (`<select class="multisteps-form__select form-control" name="cod_ibge" id="addcod_ibge" maxlength="7">`);

  formulario += resultadoMunicipio;

  formulario += (`</select>`);
  
  formulario += divMeio;

  formulario += (`<label for="nome">Nome</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="nome" id="addnome" maxlength="45"></input>`);
  formulario += divMeio;
  formulario += (`<label for="cpf">CPF</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="cpf" id="addcpf" maxlength="11"></input>`);
  formulario += divMeio;
  formulario += (`<label for="rg">RG</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="rg" id="addrg" maxlength="20"></input>`);
  formulario += divMeio;
  formulario += (`<label for="partido">Partido</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="partido" id="addpartido" maxlength="45"></input>`);
  formulario += divMeio;
  formulario += (`<label for="exercicio">Exercício</label>`);
  formulario += (`<input class="multisteps-form__input form-control" name="exercicio" id="addexercicio" maxlength="45"></input>`);
  formulario += divFim;
  document.getElementById("modalAdicao").innerHTML = formulario;

  let botao = (`<button class="btn btn-primary multi-button ml-auto" type="button" onclick="envioPrefeitos()" title="Adicionar">Adicionar</button>`);
  document.getElementById("botaoEnvio").innerHTML = botao;
}
function envioPrefeitos() {
  let info = {
    "cod_ibge": parseInt(document.getElementById("addcod_ibge").value),
    "nome": document.getElementById("addnome").value,
    "cpf": document.getElementById("addcpf").value,
    "rg": document.getElementById("addrg").value,
    "partido": document.getElementById("addpartido").value,
    "exercicio": document.getElementById("addexercicio").value,
  };
  enviar("prefeitos",info,'POST');
}
function visPrefeito() {
  caminho = "prefeitos";
  titulo = `<th style="width:10%" scope="col">Código do IBGE</th>
  <th style="width:10%" scope="col">Nome</th>
  <th style="width:20%" scope="col">CPF</th>
  <th style="width:20%" scope="col">RG</th>
  <th style="width:20%" scope="col">Partido</th>
  <th style="width:15%" scope="col">Exercício</th>`;
  estrutura = ["cod_ibge", "nome", "cpf", "rg", "partido", "exercicio"];
  paginacao();
}
function editprefeitos(valor){
  localStorage.setItem("cod_prefeito", paraEdicao[valor].cod_prefeito);
  localStorage.setItem("cod_ibge", paraEdicao[valor].cod_ibge);
  localStorage.setItem("nome", paraEdicao[valor].nome);
  localStorage.setItem("cpf", paraEdicao[valor].cpf);
  localStorage.setItem("rg", paraEdicao[valor].rg);
  localStorage.setItem("partido", paraEdicao[valor].partido);
  localStorage.setItem("exercicio", paraEdicao[valor].exercicio);
  window.location.href = "./gerenciaAdministracao.html";
}



//informaçãoes para Tipo de item
function addTipoItem() {
  let formulario = divInicio;
  formulario += (`<label for="cod_tipo_item">Código do Tipo de Item:</label>`);
  formulario += (`<input class="multisteps-form__input form-control inteiros" name="cod_tipo_item" id="addcod_tipo_item"></input>`);
  formulario += divMeio;
  formulario += (`<label for="descricao">Descrição:</label>`);
  formulario += (`<textarea class="multisteps-form__input form-control" name="descricao" id="adddescricao" maxlength="100"></textarea>`);
  formulario += divFim;
  document.getElementById("modalAdicao").innerHTML = formulario;

  let botao = (`<button class="btn btn-primary multi-button ml-auto" type="button" onclick="envioTipoItem()" title="Adicionar">Adicionar</button>`);
  document.getElementById("botaoEnvio").innerHTML = botao;
}
function envioTipoItem() {
  let info = {
    "cod_tipo_item": parseInt(document.getElementById("addcod_tipo_item").value),
    "descricao": document.getElementById("adddescricao").value,
  };
  enviar("tipoitem",info,'POST');
}
function visTipoItem() {
  caminho = "tipoitem";
  titulo = `<th style="width:20%" scope="col">Código de Tipo de Item</th>
  <th style="width:75%" scope="col">Descrição</th>`;
  estrutura = ["cod_tipo_item", "descricao"];
  paginacao();
}
function edittipoitem(valor){
  localStorage.setItem("cod_tipo_item", paraEdicao[valor].cod_tipo_item);
  localStorage.setItem("descricao", paraEdicao[valor].descricao);
  window.location.href = "./gerenciaAdministracao.html";
}



//informaçãoes para Tipologia
function addTipologia() {
  let formulario = divInicio;
  formulario += (`<label for="descricao">Descrição</label>`);
  formulario += (`<textarea class="multisteps-form__input form-control" name="descricao" id="adddescricao" maxlength="45"></textarea>`);
  formulario += divFim;
  document.getElementById("modalAdicao").innerHTML = formulario;

  let botao = (`<button class="btn btn-primary multi-button ml-auto" type="button" onclick="envioTipologia()" title="Adicionar">Adicionar</button>`);
  document.getElementById("botaoEnvio").innerHTML = botao;
}
function envioTipologia() {
  let info = {
    "descricao": document.getElementById("adddescricao").value,
  };
  enviar("tipologia",info,'POST');
}
function visTipologia() {
  caminho = "tipologia";
  titulo = `<th style="width:20%" scope="col">Código de Tipologia</th>
  <th style="width:75%" scope="col">Descrição</th>`;
  estrutura = ["cod_tipologia", "descricao"];
  paginacao();
}
function edittipologia(valor){
  localStorage.setItem("cod_tipologia", paraEdicao[valor].cod_tipologia);
  localStorage.setItem("descricao", paraEdicao[valor].descricao);
  window.location.href = "./gerenciaAdministracao.html";
}



//sistema para todas as tabelas
function paginacao() {

  porPagina = document.getElementById("quantos").value;
  let comeco = contador * porPagina;
  let fim = (contador + 1) * porPagina;

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

        //sistema de filtragem:
        let filtrado = [];
        filtrado = filtro(json,estrutura);

        paraEdicao = filtrado;

        //console.log(json);

        for (let i = comeco; i < fim && i < filtrado.length; i++) {

          //produz a lista da tabela
          tabela += (`<tr>`);

          for (j = 0; j < estrutura.length; j++) {
            if(codAdmin < 4 || codAdmin == 11){

              //para pegar o ultimo código
              codigoSelecionado = (filtrado[i][estrutura[j]] + 1);

            }
            tabela += (`<td id="` + estrutura[j] + `">`);
            tabela += filtrado[i][estrutura[j]];
            tabela += (`</td>`);
          }

          tabela += (`<td> <span class="d-flex">
          <button id="botaoEdicao" onclick="edit` + caminho + `(` + i + `)" class="btn btn-success"><i class="material-icons"data-toggle="tooltip" title="Edit">&#xE254;</i></button>
          </span> </td> </tr>`);
        }
        tabela += (`</tbody>`);
        document.getElementById("tabela").innerHTML = tabela;

        paginasOrganizadas(filtrado,comeco,fim);
      });
    } else {
      //erros(response.status);
    }
  });
}



function enviar(caminho,conteudo,metodo) {
  //transforma as informações do token em json
  let corpo = JSON.stringify(conteudo);
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
      // response.json().then(function (json) {
      //   console.log(json);
      // });
      location.reload();
    } else {
      erros(response.status);
    }
  });
}