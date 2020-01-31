//o json usado para mandar as informações pelo fetch
let info = {"nome" : "", "email" : "", "login" : "", "senha" : ""};

//função que altera as informações do json, capturando do html
function changer(){
let z = document.getElementById("submitNome");
info.nome = z.value;
let w = document.getElementById("submitEmail");
info.email = w.value;
let x = document.getElementById("submitLogin");
info.login = x.value;
let y = document.getElementById("submitSenha");
info.senha = y.value;
}

(function() {
  'use strict';
  window.addEventListener('load', function() {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    let forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    let validation = Array.prototype.filter.call(forms, function(form) {
      form.addEventListener('submit', function(event) {
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add('was-validated');
      }, false);
    });
  }, false);
})();

function envio(){
  let meuToken = sessionStorage.getItem("Token");
  //transforma as informações do login em json
  let corpo = JSON.stringify(info);

  //função fetch para mandar o login e receber o token
  fetch('http://localhost:8080/read/usuario/createuser', {
    method: 'POST',
    body: corpo,
    headers: {'Authorization': 'Bearer ' + meuToken},
  }).then(function(response){
    //checar o status do pedido
    console.log(response);
    //tratamento dos erros
    if(response.status == 200){
    }
    else if(response.status ==201){
      alert("Login criado com sucesso");
    }
    else if(response.status == 202){
      alert("Login efetuado com sucesso");
    }
    else if(response.status ==204){
      //no caso de deletar algo
      alert("Apagado com sucesso.");
    }
    else if(response.status ==400){
      //window.location.href = "http://localhost:8080/400";
    }
    else if(response.status ==401){
      //window.location.href = "http://localhost:8080/401";
    }
    else if(response.status ==403){
      //window.location.href = "http://localhost:8080/403";
    }
    else if(response.status ==404){
      //window.location.href = "http://localhost:8080/404";
    }
    else if(response.status ==409){
      alert("Erro: Login já existente.");
    }
    else if(response.status == 412){
      alert("Erro: Informação colocada é incorreta.");
    }
    else if(response.status == 422){
      alert("Erro: Informação colocada é invalida.");
    }
    else if(response.status == 500){
      //window.location.href = "http://localhost:8080/500";
    }
    else if(response.status == 504){
      //window.location.href = "http://localhost:8080/504";
    }
    else{
      alert("ERRO DESCONHECIDO");
    }
    return response.json();
  }).then(function(response){
    console.log(response)
  });
}
