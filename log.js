var info = {"login" : " ","senha" : " "};

function changer(){

var x = document.getElementById("submitLogin");
info.login = x.value;

var y = document.getElementById("submitSenha");
info.senha = y.value;
}

function CheckError(response) {
	if (response.status >= 200 && response.status < 300) {
	  return console.log(response);
	} else {
	  throw ("Erro encontrado: " + response.status);
	  switch(response.status){
          case '403': window.location.replace("file:///home/mctic/Desktop/dimi%20was%20here/403.html");break;
          case '404': window.location.replace("file:///home/mctic/Desktop/dimi%20was%20here/404.html");break;
          case '412': alert("Usuario ou senha incorretos.") ;break;
          case '500': window.location.replace("file:///home/mctic/Desktop/dimi%20was%20here/500.html");break;
          case '504': window.location.replace("file:///home/mctic/Desktop/dimi%20was%20here/504.html");break;
          }
	}
  }

function entrar(){
    var objetivo = JSON.stringify(info);
    //ja com o site para testes
    fetch("localhost:8080/read/usuario", {
		method: "POST",
    mode: 'no-cors',
    headers: {'content-type' : 'application/json'},
		body: objetivo
	})
    .then(CheckError)
    .then(response => console.log("ok?") );
}
