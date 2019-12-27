var info = {nome: "", email: "", login: "", senha: ""};
var valoErro = 0;
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

function envio(){
   var objetivo = JSON.stringify(info);
   fetch("http://localhost:8000", {
      method: "POST",
      body: objetivo
   })
   .then(function() {
      console.log("ok");
   })
   .catch(function(error){
      console.log("Ao menos aqui eu vejo o erro: " + error.message);
   });
}

// sites promissores: https://scotch.io/tutorials/how-to-use-the-javascript-fetch-api-to-get-data e https://www.youtube.com/watch?v=vnPemSnnJYY