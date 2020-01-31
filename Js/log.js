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
  //headers usados:
  let head = new Headers();
  head.append("Content-type", "application/json");
  //função fetch para mandar o login e receber o token
  fetch('http://localhost:8080/read/usuario/login', {
    method: 'POST',
    body: corpo,
    headers: {head},
    cache: 'default',
  }).then(function(response){
    //checar o status do pedido
    console.log(response.status);
    //tratamento dos erros
    if(response.status == 200){
      alert("Status: OK");
    }
    else if(response.status ==201){
      alert("Login criado com sucesso");
    }
    else if(response.status == 202){
      response.json().then(function(json){
        sessionStorage.setItem("Token", json);
        console.log(json);
        head.append("Authorization", "Bearer "+sessionStorage.getItem("Token"))
        fetch("http://localhost:8080/1", {
        method: 'GET',
        headers: {head},
        })
      });
    }
    else if(response.status ==204){
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
      alert("Erro: Informação colocada é invalida. Siga as instruções abaixo.");
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
  
  })
} 