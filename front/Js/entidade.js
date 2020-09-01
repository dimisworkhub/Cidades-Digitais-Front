//capturar itens para mandar no gerenciaEstrutura
let jsonFinal = [];

//pega o JSON de municípios para uso em "adicionar entidades"
let cidades = [];
document.getElementById("nome_municipio").disabled = true;

function enabler() {
  let uf1 = document.getElementById("uf").value;
  document.getElementById("nome_municipio").disabled = false;
  let i, y = [];
  for (i = 0; i < cidades.length; i++) {
    if (cidades[i].uf == uf1) {
      y[i] = "<option>" + cidades[i].nome_municipio + "</option>"
    }
  }
  
  document.getElementById("nome_municipio").innerHTML = y;
}



function pegarMunicipio(){
  fetch(servidor + 'read/municipio', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 200) {
      response.json().then(function (json) {
        //pegando valores para usar em municipios
        cidades = json;
        //cria letiaveis
        let i, j = 0;
        let x = [],
          valorUF = [],
          valorFinalUF = [];

        //faz a ligação entre variaveis e valores do banco
        for (i = 0; i < json.length; i++) {
          valorUF[i] = json[i].uf;
          if (valorUF[i] != valorUF[i - 1]) {
            valorFinalUF[j] = valorUF[i];
            j++;
          }
        }
        for (i = 0; i < j; i++) {
          x[i] += "<option>" + valorFinalUF[i] + "</option>";
        }
        
        document.getElementById("uf").innerHTML = x;
        paginacao();
      });
    } else {
      erros(response.status);
    }
  });
}

window.onload = function () {
  this.pegarMunicipio();
}

function paginacao() {
  porPagina = document.getElementById("quantos").value;
  let comeco = contador * porPagina;
  let fim = (contador + 1) * porPagina;

  //função fetch para mandar itens 
  fetch(servidor + 'read/entidade', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {
    //tratamento dos erros
    if (response.status == 200) {
      console.log(response.statusText);

      //pegar o json que possui a tabela
      response.json().then(function (json) {

        let tabela = (`<thead style="background: #4b5366; color:white; font-size:15px">
            <tr>
            <th style="width:18%" scope="col">CNPJ</th>
            <th style="width:10%" scope="col">Nome</th>
            <th style="width:15%" scope="col">Endereço</th>
            <th style="width:5%" scope="col">Número</th>
            <th style="width:10%" scope="col">Bairro</th>
            <th style="width:11%" scope="col">CEP</th>
            <th style="width:2%" scope="col">UF</th>
            <th style="width:14%" scope="col">Município</th>
            <th style="width:10%" scope="col">Observações</th>
            <th style="width:5%" scope="col">Opções</th>
            </tr>
            </thead>`);
        tabela += (`<tbody> <tr>`);

        //sistema de filtragem:
        let filtrado = [];
        filtrado = filtro(json,["cnpj","nome","endereco","bairro","cep","uf","nome_municipio","observacao"]);

        //para edição
        jsonFinal=filtrado;

        for (let i = comeco; i < fim && i < filtrado.length; i++) {
          tabela += (`<td class="cnpj">`);
          tabela += filtrado[i]["cnpj"];
          tabela += (`</td> <td>`);
          tabela += filtrado[i]["nome"];
          tabela += (`</td> <td>`);
          tabela += filtrado[i]["endereco"];
          tabela += (`</td> <td>`);
          tabela += filtrado[i]["numero"];
          tabela += (`</td> <td>`);
          tabela += filtrado[i]["bairro"];
          tabela += (`</td> <td  class="cep">`);
          tabela += filtrado[i]["cep"];
          tabela += (`</td> <td>`);
          tabela += filtrado[i]["uf"];
          tabela += (`</td> <td>`);
          tabela += filtrado[i]["nome_municipio"];
          tabela += (`</td> <td>`);
          tabela += filtrado[i]["observacao"];
          tabela += (`</td> <td> 
                <span class="d-flex">
                <button onclick="editarEntidade(` + i + `)" class="btn btn-success">
                <i class="material-icons"data-toggle="tooltip" title="Edit">&#xE254;</i>
                </button> 
                </span> </td>`);
          tabela += (`</tr> <tr>`);
        }
        tabela += (`</tr> </tbody>`);
        document.getElementById("tabela").innerHTML = tabela;
        mascara();
        paginasOrganizadas(filtrado,comeco,fim);
      });
    } else {
      erros(response.status);
    }
  });
}



function enviar() {

  //estrutura usada para mandar o JSON no fetch
  let info = {
    "cnpj": document.getElementById("cnpj").value,
    "nome": document.getElementById("nome").value,
    "endereco": document.getElementById("endereco").value,
    "numero": document.getElementById("numero").value,
    "bairro": document.getElementById("bairro").value,
    "cep": document.getElementById("cep").value,
    "uf": document.getElementById("uf").value,
    "nome_municipio": document.getElementById("nome_municipio").value,
    "observacao": document.getElementById("observacao").value,
  };

  //transforma as informações do token em json
  let corpo = JSON.stringify(info);
  //console.log(corpo);

  //função fetch para mandar
  fetch(servidor + 'read/entidade', {
    method: 'POST',
    body: corpo,
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 201) {
      alert("Entidade criada com sucesso");
      location.reload();
    } else {
      erros(response.status);
    }
  });
}

//leva para o editor da entidade selecionada
function editarEntidade(valor) {
  localStorage.setItem("cnpj", jsonFinal[valor].cnpj);
  localStorage.setItem("nome", jsonFinal[valor].nome);
  localStorage.setItem("endereco", jsonFinal[valor].endereco);
  localStorage.setItem("numero", jsonFinal[valor].numero);
  localStorage.setItem("bairro", jsonFinal[valor].bairro);
  localStorage.setItem("cep", jsonFinal[valor].cep);
  localStorage.setItem("uf", jsonFinal[valor].uf);
  localStorage.setItem("nome_municipio", jsonFinal[valor].nome_municipio);
  localStorage.setItem("observacao", jsonFinal[valor].observacao);
  window.location.href = "./gerenciaEntidade.html";
}