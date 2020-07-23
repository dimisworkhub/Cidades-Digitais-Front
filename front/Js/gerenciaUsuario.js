
//pega o valor do usuario logado
let codigoLogado = localStorage.getItem("codigoLogado");


window.onload = function () {
  // inserindo os valores no html
  document.getElementById("cod_usuario").value = localStorage.getItem("cod_usuario");
  document.getElementById("nome").value = localStorage.getItem("nome");
  document.getElementById("email").value = localStorage.getItem("email");
  document.getElementById("login").value = localStorage.getItem("login");
  document.getElementById("status").value = localStorage.getItem("status");
  document.getElementById("senha").value = localStorage.getItem("senha");
}


function enviar() {

  let info = {
    "cod_usuario": parseInt(document.getElementById("cod_usuario").value),
    "nome": document.getElementById("nome").value,
    "email": document.getElementById("email").value,
    "login": document.getElementById("login").value,
    "status": document.getElementById("status").value,
    "senha": document.getElementById("senha").value,
  };

  //transforma as informações do token em json
  let corpo = JSON.stringify(info);
  //console.log(corpo);
  //função fetch para mandar
  fetch(servidor + 'read/usuario/' + parseInt(codigoLogado), {
    method: 'PUT',
    body: corpo,
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //checar o status do pedido
    //console.log(response.status);

    //tratamento dos erros
    if (response.status == 200 || response.status == 202) {
      response.json().then(function (json) {
        //console.log(json);
      window.location.replace("./usuario.html");
      });
    } else {
      erros(response.status);
    }
  });
}