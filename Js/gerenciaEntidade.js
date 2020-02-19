//pega o token do login
let meuToken = localStorage.getItem("token");

//pega o CNPJ escolhido anteriormente
let meuCNPJ = localStorage.getItem("cnpj");
let cidades=[];


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


//captura as informações do input e coloca no JSON
function changer() {
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
  let nomeMun1 = document.getElementById("nomeMun");
  info.nome_municipio = nomeMun1.value;
  let obs1 = document.getElementById("obs");
  info.observacao = obs1.value;
}

function enabler(){
  let uf1 = document.getElementById("uf");
  info.uf = uf1.value;
  let i,y = [];
  for (i = 0; i < cidades.length; i++) {
    //h.value é o uf nesse caso
    if (cidades[i].uf == uf.value) {
      y[i] = "<option>" + cidades[i].nome_municipio + "</option>"
    }
  }
  document.getElementById("nomeMun").innerHTML = y;
}



function enviar() {

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
    } else if (response.status == 201) {
      alert("Usuário criado com sucesso");
      window.location.replace("./entidade.html");
    } else if (response.status == 202) {
      alert("Login efetivado com sucesso");
      window.location.replace("./entidade.html");
    } else if (response.status == 204) {
      alert("Apagado com sucesso.");
      window.location.replace("./entidade.html");
    } else if (response.status == 400) {
      window.location.replace("./errors/400.html");
    } else if (response.status == 401) {
      window.location.replace("./errors/401.html");
    } else if (response.status == 403) {
      window.location.replace("./errors/403.html");
    } else if (response.status == 404) {
      window.location.replace("./errors/404.html");
    } else if (response.status == 409) {
      alert("Erro: Usuário já existente.");
    } else if (response.status == 412) {
      alert("Erro: Informação colocada é incorreta.");
    } else if (response.status == 422) {
      alert("Erro: Usuário ou senha inválidos.");
    } else if (response.status == 500) {
      window.location.replace("./errors/500.html");
    } else if (response.status == 504) {
      window.location.replace("./errors/504.html");
    } else {
      alert("ERRO DESCONHECIDO");
    }
    return console.log(response);
  });
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
        //cria letiaveis
        let i, j = 1;
        let x = [],
          valorUF = [],
          valorFinalUF = [];

        //faz a ligação entre letiaveis e valores iniciais do banco
        valorUF[0] = json["0"].uf;
        valorFinalUF[0] = valorUF[0];
        //faz a ligação com os outros valores do banco
        for (i = 1; i < json.length; i++) {
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
        document.getElementById("nomeMun").innerHTML = y;

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
        let g = document.getElementById("nomeMun");
        g.value = localStorage.getItem("nome_municipio");
        let k = document.getElementById("obs");
        k.value = localStorage.getItem("observacao");
      });
    } else if (response.status == 400) {
      window.location.replace("./errors/400.html");
    } else if (response.status == 401) {
      window.location.replace("./errors/401.html");
    } else if (response.status == 403) {
      window.location.replace("./errors/403.html");
    } else if (response.status == 404) {
      window.location.replace("./errors/404.html");
    } else if (response.status == 409) {
      alert("Erro: Entidade já existente.");
    } else if (response.status == 412) {
      alert("Erro: Informação colocada é incorreta.");
    } else if (response.status == 422) {
      alert("Erro: Usuário ou senha inválidos.");
    } else if (response.status == 500) {
      window.location.replace("./errors/500.html");
    } else if (response.status == 504) {
      window.location.replace("./errors/504.html");
    } else {
      alert("ERRO DESCONHECIDO");
    }
  });
}