//PRECISA ADAPTAR A LOTE

//pega o token do login
let meuToken = localStorage.getItem("token");

//pega o CNPJ escolhido anteriormente
let meuCNPJ = localStorage.getItem("cod_lote");

//JSON usado para mandar as informações no fetch
var info = {
  "cod_lote": " ",
  "cnpj": " ",
  "contrato": " ",
  "dt_inicio_vig": " ",
  "dt_final_vig": " ",
  "dt_reajuste": " ",
  "cep": " ",
  "nome_municipio": " ",
  "uf": " ",
  "observacao": " "
};


//captura o codigo do lote para usar como chave na edição
var a = document.getElementById("cod_lote");
a.value = localStorage.getItem("cod_lote");

//captura as informações do input e coloca no JSON

  function changer() {
    info.cod_lote = localStorage.getItem("cod_lote");
    var b = document.getElementById("cnpj");
    info.nome = b.value;
    var c = document.getElementById("contrato");
    info.endereco = c.value;
    var d = document.getElementById("dataI");
    info.numero = d.value;
    var e = document.getElementById("dataF");
    info.bairro = e.value;
    var f = document.getElementById("dataR");
    info.cep = f.value;
  }




function enviar() {

  //transforma as informações do token em json
  let corpo = JSON.stringify(info);
  //função fetch para mandar
  fetch('http://localhost:8080/read/lote/' + meuLote, {
    method: 'PUT',
    body: corpo,
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //checar o status do pedido
    console.log(response);

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
    return response.json().then(function (json) {
      console.log(json);
    });
  });
}