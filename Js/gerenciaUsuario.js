//pega o token do login
let meuToken = localStorage.getItem("token");

//tratamento de erros
function erros(value){
  if (value == 400) {
    window.location.replace("./errors/400.html");
  } else if (value == 401) {
    window.location.replace("./errors/401.html");
  } else if (value == 403) {
    window.location.replace("./errors/403.html");
  } else if (value == 404) {
    window.location.replace("./errors/404.html");
  } else if (value == 409) {
    alert("Erro: Usuário já existente.");
  } else if (value == 412) {
    alert("Erro: Informação colocada é incorreta.");
  } else if (value == 422) {
    alert("Erro: Informação incorreta.");
  } else if (value == 500) {
    window.location.replace("./errors/500.html");
  } else if (value == 504) {
    window.location.replace("./errors/504.html");
  } else {
    alert("ERRO DESCONHECIDO");
  }
}


//o json usado para mandar as informações pelo fetch
let info = {
  "nome": "",
  "email": "",
  "login": "",
  "senha": ""
};

//função que altera as informações do json, capturando do html
function changer() {
  let z = document.getElementById("nome");
  info.nome = z.value;
  let w = document.getElementById("email");
  info.email = w.value;
  let x = document.getElementById("login");
  info.login = x.value;
  let y = document.getElementById("senha");
  info.senha = y.value;
  let a = document.getElementById("status");
  info.status = a.value;
  
}

function enviar() {

  //transforma as informações do token em json
  let corpo = JSON.stringify(info);

  //função fetch para mandar
  fetch('http://localhost:8080/read/usuario/createuser', {
    method: 'POST',
    body: corpo,
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //checar o status do pedido
    console.log(response.status);

    //tratamento dos erros
    if (response.status == 200) {
      window.location.replace("./criarUsuario.html");
    } else if (response.status == 201) {
      alert("Usuário criado com sucesso");
      window.location.replace("./criarUsuario.html");
    } else if (response.status == 202) {
      alert("Login efetivado com sucesso");
      window.location.replace("./criarUsuario.html");
    } else if (response.status == 204) {
      alert("Apagado com sucesso.");
      window.location.replace("./criarUsuario.html");
    } else {
      erros(response.status);
    }
    return response.json().then(function (response) {
      console.log("Resultado: " + response.status);
    });
  });
}