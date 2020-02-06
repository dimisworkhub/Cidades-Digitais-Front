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

function formatar(mascara, documento){
  var i = documento.value.length;
  var saida = mascara.substring(0,1);
  var texto = mascara.substring(i)
  
  if (texto.substring(0,1) != saida){
            documento.value += texto.substring(0,1);
  }
  
}



//testar se funciona depois
window.onload=function(){
  var i = 0;
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



window.onload=function(){
  var i = 0;
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