var info = {nome: "", email: "", login: "", senha: ""};
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
  
}
fetch("/read/usuario/createuser", {
   method: "POST",
   body: objetivo
});