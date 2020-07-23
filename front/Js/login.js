//caso os cookies não estejam habilitados
if (navigator.cookieEnabled == false) {
  alert("Cookies estão desabilitados em seu navegador, o que é um problema para a navegação nesse site. Por favor permita cookies em seu navegador.");
}



//formula para ir de input para input com enter no formulário de login
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



function entrar() {

  //o formato usado para mandar as informações pelo fetch
  let info = {
    "login": document.getElementById("login").value,
    "senha": document.getElementById("senha").value,
  };

  //guarda o login para futuras referencias
  localStorage.setItem("logado", info.login);

  //transforma as informações do login em algo utilizavel
  let corpo = JSON.stringify(info);

  //função fetch para mandar o login e receber o token
  fetch(servidor + 'read/usuario/login', {
    method: 'POST',
    body: corpo,
  }).then(function (response) {

    //checar o status do pedido
    //console.log(corpo);
    //tratamento dos erros

    if (response.status == 200 || response.status == 202) {
      response.json().then(function (json) {
        localStorage.setItem("token", json);
        window.location.replace("./home.html");
      })
    } else {
      erros(response.status);
    }
  })
}