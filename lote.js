//precisa ser atualizado
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
    
    //ja com o site para testes
    fetch("localhost:8080/read/usuario", {
		method: "GET",
        mode: 'no-cors',
        headers: {'content-type' : 'application/json'},
	})
    .then(CheckError)
    .then(function(response)
    {
        return response;
        var objeto = JSON.parse(this.response);
    });
    var x = document.getElementById("submitLogin");
    info.login = x.value;
}