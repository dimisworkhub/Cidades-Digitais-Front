var info = {"nome" : "", "email" : "", "login" : "", "senha" : ""};

function changer(){

var z = document.getElementById("submitNome");
info.nome = z.value;

var w = document.getElementById("submitEmail");
info.email = w.value;
  
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
          /*switch(response.status){
          case '403': ;break;
          case '404': ;break;
          case '412': ;break;
          case '500': ;break;
          case '504': ;break;
          }*/
  }
}
function entrar(){
    var objetivo = JSON.stringify(info);
    fetch("file:///home/mctic/Desktop/MCTIC-master/login.html", {
		method: "POST",
		mode: 'no-cors',
		body: objetivo
	})
    .then(CheckError);
}
