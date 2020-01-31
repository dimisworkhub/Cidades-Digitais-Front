//o json usado para mandar as informações pelo fetch
let info = {"login" : " ","senha" : " "};

//função que altera as informações do json, capturando do html
function changer(){
let x = document.getElementById("submitLogin");
info.login = x.value;
let y = document.getElementById("submitSenha");
info.senha = y.value;
}

function entrar(){
  //transforma as informações do login em json
  let corpo = JSON.stringify(info);

  //função fetch para mandar o login e receber o token
  fetch('http://localhost:8080/read/usuario/login',{
    method: 'POST',
    //headers: {'redirect': 'follow'},
    body: corpo,
  }).then(function(response){

    //checar o status do pedido
    console.log(response.status);

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
      //no caso a senha
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
      response.json().then(function(json){
      sessionStorage.setItem("Token", json);
    });
  })
}