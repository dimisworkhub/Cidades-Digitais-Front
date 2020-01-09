var info = {login: "", senha: ""};
function changer(){

var x = document.getElementById("submitLogin") ;
info.login = x.value;

var y = document.getElementById("submitSenha") ;
info.senha = y.value;
}

function CheckError(response) {
	if (response.status >= 200 && response.status < 300) {
	  return response.json();
	} else {
	  throw Error(response.statusText);
	}
  }

function entrar(){
    fetch("http://localhost:8080/test", {
		method: "GET",
		mode: 'no-cors'
	})
	.then(CheckError)
    .then((jsonResponse) => {
    }).catch((error) => {
       console.log(error);
    });
}