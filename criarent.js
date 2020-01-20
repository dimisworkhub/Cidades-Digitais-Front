var info = {"cnpj" : " ","nome" : " ","endereco" : " ","numero" : " ","bairro" : " ","cep" : " ","nome_municipio" : " ","uf" : " ","observacao" : " "};
function changer(){
var a = document.getElementById("submitCNPJ");
info.cnpj = a.value;
var b = document.getElementById("submitNome");
info.nome = b.value;
var c = document.getElementById("submitEndereco");
info.endereco = c.value;
var d = document.getElementById("submitNumero");
info.numero = d.value;
var e = document.getElementById("submitBairro");
info.bairro = e.value;
var f = document.getElementById("submitCEP");
info.cep = f.value;
var g = document.getElementById("submitNomeMun");
info.nome_municipio = g.value;
var h = document.getElementById("submitUF");
info.uf = h.value;
var i = document.getElementById("submitObs");
info.observacao = i.value;
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

function enviar(){
    var objetivo = JSON.stringify(info);
    //ja com o site para testes
    fetch("localhost:8080/read/entidade", {
		method: "POST",
    mode: 'no-cors',
    headers: {'content-type' : 'application/json'},
		body: objetivo
	})
    .then(CheckError)
    .then(response => console.log("ok?") );
}



function formatar(mascara, documento){
  var i = documento.value.length;
  var saida = mascara.substring(0,1);
  var texto = mascara.substring(i)
  
  if (texto.substring(0,1) != saida){
            documento.value += texto.substring(0,1);
  }
  
}



//testar se funciona depois
window.onload=function estados(){
  var i = 0;
  var j = i+1;
  var x;
  //ja com o site para testes
  fetch("localhost:8080/read/municipios", {
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
  x += "<option>" + response.uf[i] + "</option>"
}
  document.getElementById("estados").innerHTML = x;
}



//testar se funciona depois
window.onload=function municipios(){
  var i = 0;
  var j = i+1;
  var x;
  //ja com o site para testes
  fetch("localhost:8080/read/municipios", {
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
  x += "<option>" + response.nome_municipio[i] + "</option>"
}
  document.getElementById("municipios").innerHTML = x;
}