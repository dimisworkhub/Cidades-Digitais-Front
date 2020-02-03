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

function envio(){
  //pega o token do login
  let meuToken = sessionStorage.getItem("Token");

  //transforma as informações do token em json
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
    window.location = "./Menu CD/index.html";
    }
    else if(response.status ==201){
        alert("Usuário criado com sucesso");
    window.location = "./Menu CD/index.html";
    }
    else if(response.status == 202){
        alert("Login efetivado com sucesso");
    window.location = "./Menu CD/index.html";
    }
    else if(response.status ==204){
        alert("Apagado com sucesso.");
    window.location = "./Menu CD/index.html";
    }
    else if(response.status ==400){
    window.location = "./400.html";
    }
    else if(response.status ==401){
    window.location = "./401.html";
    }
    else if(response.status ==403){
    window.location = "./403.html";
    }
    else if(response.status ==404){
    window.location = "./404.html";
    }
    else if(response.status ==409){
      alert("Erro: Login já existente.");
    }
    else if(response.status == 412){
      alert("Erro: Informação colocada é incorreta.");
    }
    else if(response.status == 422){
      alert("Erro: Informação colocada é invalida. Siga as instruções abaixo.");
    }
    else if(response.status == 500){
      window.location = "./500.html";
    }
    else if(response.status == 504){
      window.location = "./504.html";
    }
    else{
      alert("ERRO DESCONHECIDO");
    }
    return response.json();
  }).then(function(response){
    console.log(response)
  });
}