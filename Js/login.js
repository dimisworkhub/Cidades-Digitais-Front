//o json usado para mandar as informações pelo fetch
let info = {"login" : " ","senha" : " "};

//função que altera as informações do json, capturando do html
function changer(a){
  //captura o valor
let x = document.getElementById("submitLogin");
  //guarda o valor no JSON
info.login = x.value;
  //captura o valor
let y = document.getElementById("submitSenha");
  //guarda o valor no JSON
info.senha = y.value;

var nomeInput = document.getElementById(a);
  if (!nomeInput.checkValidity()) {
    document.getElementById(a + "2").innerHTML = nomeInput.validationMessage;
  } else {
    document.getElementById(a + "2").innerHTML = "Valor Aceito";
  }
}

function entrar(){
  //transforma as informações do login em json
  let corpo = JSON.stringify(info);

  //função fetch para mandar o login e receber o token
  fetch('https://httpstat.us/400',{
    method: 'POST',
    body: corpo,
  }).then(function(response){

    //checar o status do pedido
    console.log(response.status);

    //tratamento dos erros
    if(response.status == 200){
    location.replace = "./Menu CD/index.html";
    }
    else if(response.status ==201){
      alert("Usuário criado com sucesso");
    location.replace = "./Menu CD/index.html";
    }
    else if(response.status == 202){
      alert("Login efetivado com sucesso");
      location.replace = "./Menu CD/index.html";
    }
    else if(response.status ==204){
      alert("Apagado com sucesso.");
      location.replace = "./Menu CD/index.html";
    }
    else if(response.status ==400){
      location.replace = "./400.html";
    }
    else if(response.status ==401){
      location.replace = "./401.html";
    }
    else if(response.status ==403){
      location.replace = "./403.html";
    }
    else if(response.status ==404){
      location.replace = "./404.html";
    }
    else if(response.status ==409){
      alert("Erro: Login já existente.");
    }
    else if(response.status == 412){
      //no caso a senha
      alert("Erro: Informação colocada é incorreta.");
    }
    else if(response.status == 422){
      alert("Erro: Informação colocada é invalida. Siga as instruções abaixo.");
    }
    else if(response.status == 500){
      location.replace = "./500.html";
    }
    else if(response.status == 504){
      location.replace = "./504.html";
    }
    else{
      alert("ERRO DESCONHECIDO");
    }
      response.json().then(function(json){
      sessionStorage.setItem("Token", json);
    });
  })
}