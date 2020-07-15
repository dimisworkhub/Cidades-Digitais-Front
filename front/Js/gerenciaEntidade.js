//pega o CNPJ escolhido anteriormente
let meuCNPJ = localStorage.getItem("cnpj");
let meuNome = localStorage.getItem("nome");
let meuEndereco = localStorage.getItem("endereco");
let meuNumero = localStorage.getItem("numero");
let meuBairro = localStorage.getItem("bairro");
let meuCep = localStorage.getItem("cep");
let meuMunicipio = localStorage.getItem("nome_municipio");
let meuObs = localStorage.getItem("observacao");
let cidades = [];


window.onload = function () {

  fetch(servidor + 'read/municipio', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 200) {
      return response.json().then(function (json) {
        //pegando valores para usar em municipios
        cidades = json;
        //cria variaveis
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

        let y = [];
        for (i = 0; i < json.length; i++) {
          y[i] = "<option>" + json[i].nome_municipio + "</option>"
        }
        
        document.getElementById("nome_municipio").innerHTML = y;

        //captura os elementos anteriores para visualizar na edição
        document.getElementById("cnpj").value = localStorage.getItem("cnpj");
        document.getElementById("nome").value = localStorage.getItem("nome");
        document.getElementById("endereco").value = localStorage.getItem("endereco");
        document.getElementById("numero").value = localStorage.getItem("numero");
        document.getElementById("bairro").value = localStorage.getItem("bairro");
        document.getElementById("cep").value = localStorage.getItem("cep");
        document.getElementById("uf").value = localStorage.getItem("uf");
        document.getElementById("nome_municipio").value = localStorage.getItem("nome_municipio");
        document.getElementById("observacao").value = localStorage.getItem("observacao");
      });
    } else {
      erros(response.status);
    }
  });
}

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

function enviar() {

  //estrutura para o JSON usado no fetch
  let info = {
    "nome": "",
    "endereco": "",
    "numero": "",
    "bairro": "",
    "cep": "",
    "nome_municipio": "",
    "observacao": "",
  };

  let a = document.getElementById("nome").value;
  let b = document.getElementById("endereco").value;
  let c = document.getElementById("numero").value;
  let d = document.getElementById("bairro").value;
  let e = document.getElementById("cep").value;
  let f = document.getElementById("nome_municipio").value;
  let g = document.getElementById("observacao").value;

  info.nome = a.value;
  info.endereco = b.value;
  info.numero = c.value;
  info.bairro = d.value;
  info.cep = e.value;
  info.nome_municipio = f.value;
  info.observacao = g.value;

  //transforma as informações do token em json
  let corpo = JSON.stringify(info);
  console.log(corpo);
  //função fetch para mandar
  fetch(servidor + 'read/entidade/' + meuCNPJ, {
    method: 'PUT',
    body: corpo,
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 200) {
      window.location.replace("./entidade.html");
    } else {
      erros(response.status);
    }
    return console.log(response);
  });
}