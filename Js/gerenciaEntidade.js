//pega o token do login
let meuToken = localStorage.getItem("token");

//pega o CNPJ escolhido anteriormente
let meuCNPJ = localStorage.getItem("cnpj");
let cidades=[];

//tratamento de erros
function erros(value) {
  if (value == 400) {
    window.location.replace("./errors/400.html");
  } else if (value == 401) {
    window.location.replace("./errors/401.html");
  } else if (value == 403) {
    window.location.replace("./errors/403.html");
  } else if (value == 404) {
    window.location.replace("./errors/404.html");
  } else if (value == 409) {
    alert("Erro: Lote já existente.");
  } else if (value == 412) {
    alert("Erro: Informação colocada é incorreta.");
  } else if (value == 422) {
    alert("Erro: Formato de informação não aceito.");
  } else if (value == 500) {
    window.location.replace("./errors/500.html");
  } else if (value == 504) {
    window.location.replace("./errors/504.html");
  } else {
    alert("ERRO DESCONHECIDO");
  }
}


//JSON usado para mandar as informações no fetch
let info = {
  "cnpj": " ",
  "nome": " ",
  "endereco": " ",
  "numero": " ",
  "bairro": " ",
  "cep": " ",
  "nome_municipio": " ",
  "uf": " ",
  "observacao": " "
};

function enabler(){
  let i,y = [];
  let ufNovo = document.getElementById("uf");
  info.uf = ufNovo.value;
  for (i = 0; i < cidades.length; i++) {
    if (cidades[i].uf == info.uf) {
      y[i] = "<option>" + cidades[i].nome_municipio + "</option>"
    }
  }
  document.getElementById("nome_municipio").innerHTML = y;
}

window.onload = function () {

  fetch('http://localhost:8080/read/municipio', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 200) {
      return response.json().then(function (json) {
        //pegando valores para usar em municipios
        cidades=json;
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
        x.sort();
        document.getElementById("uf").innerHTML = x;
        let y = [];
        for (i = 0; i < json.length; i++) {
          y[i] = "<option>" + json[i].nome_municipio + "</option>"
        }
        y.sort();
        document.getElementById("nome_municipio").innerHTML = y;

        //captura os elementos anteriores para visualizar na edição
        let a = document.getElementById("cnpj");
        a.value = localStorage.getItem("cnpj");
        let b = document.getElementById("nome");
        b.value = localStorage.getItem("nome");
        let c = document.getElementById("endereco");
        c.value = localStorage.getItem("endereco");
        let d = document.getElementById("numero");
        d.value = localStorage.getItem("numero");
        let e = document.getElementById("bairro");
        e.value = localStorage.getItem("bairro");
        let f = document.getElementById("cep");
        f.value = localStorage.getItem("cep");
        let h = document.getElementById("uf");
        h.value = localStorage.getItem("uf");
        enabler();
        let g = document.getElementById("nome_municipio");
        g.value = localStorage.getItem("nome_municipio");
        let k = document.getElementById("obs");
        k.value = localStorage.getItem("observacao");
        
        //garantindo que os campos não alterados não sejam nulos
        info.nome = b.value;
        info.endereco = c.value;
        info.numero = d.value;
        info.bairro = e.value;
        info.cep = f.value;
        info.nome_municipio = g.value;
        info.observacao = k.value;
      });
    } else {
      erros(response.status);
    }
  });
}

function enviar() {
  
  info.cnpj = localStorage.getItem("cnpj");
  let nome1 = document.getElementById("nome");
  info.nome = nome1.value;
  let endereco1 = document.getElementById("endereco");
  info.endereco = endereco1.value;
  let numero1 = document.getElementById("numero");
  info.numero = numero1.value;
  let bairro1 = document.getElementById("bairro");
  info.bairro = bairro1.value;
  let cep1 = document.getElementById("cep");
  info.cep = cep1.value;
  let nome_municipio1 = document.getElementById("nome_municipio");
  info.nome_municipio = nome_municipio1.value;
  let obs1 = document.getElementById("obs");
  info.observacao = obs1.value;

  //transforma as informações do token em json
  let corpo = JSON.stringify(info);
  //função fetch para mandar
  fetch('http://localhost:8080/read/entidade/' + meuCNPJ, {
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