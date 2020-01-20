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
//testar se funciona depois
  window.onload=function lista(){
    var i = 0;
    var j = i+1;
    var x;
    //ja com o site para testes
    fetch("localhost:8080/read/entidade", {
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
    for (i in objeto) {
    x += "<tr>" + "<td>" + response.cnpj[i] + "</td>" + "<td>" + response.nome[i] + "</td>" + "<td>" + response.endereco[i] + "</td>" + "<td>" + response.numero[i] + "</td>" + "<td>" + response.bairro[i] + "</td>" + "<td>" + response.cep[i] + "</td>" + "<td>" + response.nome_municipio[i] + "</td>" + "<td>" + response.uf[i] + "</td>" + "<td>" + response.observacao[i] + "</td>" + "</tr>";
    }
    document.getElementById("lista").innerHTML = x;
}
