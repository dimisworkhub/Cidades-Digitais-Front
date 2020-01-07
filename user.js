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

function CheckError(response) {
   if (response.status >= 200 && response.status <= 299) {
     return response.json();
   } else {
     throw Error(response.statusText);
   }
 }
   

function envio(){
   fetch("http://localhost:8080", {
      method: "POST",
      mode: 'no-cors',
      body: JSON.stringify(info)
   })
   .then(CheckError)
   .then((jsonResponse) => {
   }).catch((error) => {
      console.log(error);
   });
}