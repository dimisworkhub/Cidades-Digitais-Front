

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
}

function entrar(){
  //transforma as informações do login em json
  let corpo = JSON.stringify(info);

  //função fetch para mandar o login e receber o token
  fetch('http://localhost:8080/read/usuario/login',{
    method: 'POST',
    body: corpo,
  }).then(function(response){

    //checar o status do pedido
    console.log(response.status);

    //tratamento dos erros
    if(response.status == 200){
      window.location.replace("./home.html");
    }
    else if(response.status ==201){
      alert("Usuário criado com sucesso");
      window.location.replace("./home.html");
    }
    else if(response.status == 202){
      alert("Login efetivado com sucesso");
      window.location.replace("./home.html");
    }
    else if(response.status ==204){
      alert("Apagado com sucesso.");
      window.location.replace("./home.html");
    }
    else if(response.status ==400){
      window.location.replace("./errors/400.html");
    }
    else if(response.status ==401){
      window.location.replace("./errors/401.html");
    }
    else if(response.status ==403){
      window.location.replace("./errors/403.html");
    }
    else if(response.status ==404){
      window.location.replace("./errors/404.html");
    }
    else if(response.status ==409){
      alert("Erro: Usuário já existente.");
    }
    else if(response.status == 412){
      alert("Erro: Informação colocada é incorreta.");
    }
    else if(response.status == 422){
      alert("Erro: Usuário ou senha inválidos.");
    }
    else if(response.status == 500){
      window.location.replace("./errors/500.html");
    }
    else if(response.status == 504){
      window.location.replace("./errors/504.html");
    }
    else{
      alert("ERRO DESCONHECIDO");
    }
      response.json().then(function(json){
      sessionStorage.setItem("Token", json);
    });
  })
}