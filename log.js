var info = {login: "", senha: ""};
function changer(){
  
var x = document.getElementById("submitLogin") ;
info.login = x.value;

var y = document.getElementById("submitSenha") ;
info.senha = y.value;

}

function envio(){ 
  
   var objetivo = JSON.stringify(info);
  
}