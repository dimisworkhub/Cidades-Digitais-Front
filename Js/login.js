//tratamento de erros
function erros(value) {
	if (value == 400) {
		window.location.href = "./errors/400.html";
	} else if (value == 401) {
		window.location.href = "./errors/401.html";
	} else if (value == 403) {
		window.location.href = "./errors/403.html";
	} else if (value == 404) {
		window.location.href = "./errors/404.html";
	} else if (value == 409) {
		alert("Erro: Adição já existente.");
	} else if (value == 412) {
		alert("Erro: Informação colocada é incorreta.");
	} else if (value == 422) {
		alert("Erro: Usuário ou senha incorreto(s).");
	} else if (value == 500) {
		window.location.href = "./errors/500.html";
	} else if (value == 504) {
		window.location.href = "./errors/504.html";
	} else {
		alert("ERRO DESCONHECIDO");
	}
}



//para definir o ip do servidor (ou algo do tipo, podem corrigir)
let servidor = "http://localhost:8080/";

//caso os cookies não estejam habilitados
if (navigator.cookieEnabled == false) {
  alert("Cookies estão desabilitados em seu navegador, o que é um problema para a navegação nesse site. Por favor permita cookies no seu navegador.");
}

//faz com que se possa ir pro proximo input com enter
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
  "senha": " ",
};

function entrar() {
  //captura o valor e guarda o valor no info
  info.login = document.getElementById("login").value;
  info.senha = document.getElementById("senha").value;

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