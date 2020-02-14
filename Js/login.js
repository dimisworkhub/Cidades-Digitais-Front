//caso os cookies não estejam habilitados
if (navigator.cookieEnabled == false) {
  alert("Os cookies estão desabilitados, o que é um problema para a navegação nesse site. Por favor permita cookies no seu navegador.");
}

//faz com que se possa
let input = document.getElementById("login");
input.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("senha").select();
  }
});
let input2 = document.getElementById("senha");
input2.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("botao").click();
  }
});

//o json usado para mandar as informações pelo fetch
let info = {
  "login": " ",
  "senha": " "
};

//função que altera as informações do json, capturando do html
function changer() {
  //captura o valor
  let a = document.getElementById("login");
  //guarda o valor no JSON
  info.login = a.value;
  //captura o valor
  let b = document.getElementById("senha");
  //guarda o valor no JSON
  info.senha = b.value;
}

function entrar() {
  //transforma as informações do login em json
  let corpo = JSON.stringify(info);

  //função fetch para mandar o login e receber o token
  fetch('http://localhost:8080/read/usuario/login', {
    method: 'POST',
    body: corpo,
  }).then(function (response) {

    //checar o status do pedido
    console.log(response.status);

    //tratamento dos erros

    if (response.status == 200) {
      alert("Login feito com sucesso");
      window.location.replace("./home.html");
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
    response.json().then(function (json) {
      localStorage.setItem("token", json);
    });
  })
}