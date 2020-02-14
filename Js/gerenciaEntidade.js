//pega o token do login
let meuToken = localStorage.getItem("token");

//pega o CNPJ escolhido anteriormente
let meuCNPJ = localStorage.getItem("cnpj");

//JSON usado para mandar as informações no fetch
var info = {"cnpj" : " ","nome" : " ","endereco" : " ","numero" : " ","bairro" : " ","cep" : " ","nome_municipio" : " ","uf" : " ","observacao" : " "};


//captura o CNPJ para usar como chave na edição
var a = document.getElementById("cnpj");
a.value=localStorage.getItem("cnpj");

//captura as informações do input e coloca no JSON
function changer(){
info.cnpj = localStorage.getItem("cnpj");
var b = document.getElementById("nome");
info.nome = b.value;
var c = document.getElementById("endereco");
info.endereco = c.value;
var d = document.getElementById("numero");
info.numero = d.value;
var e = document.getElementById("bairro");
info.bairro = e.value;
var f = document.getElementById("cep");
info.cep = f.value;
var g = document.getElementById("nomeMun");
info.nome_municipio = g.value;
var h = document.getElementById("uf");
info.uf = h.value;
var i = document.getElementById("obs");
info.observacao = i.value;
}



function enviar(){

  //transforma as informações do token em json
  let corpo = JSON.stringify(info);
  //função fetch para mandar
  fetch('http://localhost:8080/read/entidade/'+meuCNPJ, {
    method: 'PUT',
    body: corpo,
    headers: {'Authorization': 'Bearer ' + meuToken},
  }).then(function(response){

    //tratamento dos erros
    if(response.status == 200){
      window.location.replace("./entidade.html");
    }
    else if(response.status ==201){
      alert("Usuário criado com sucesso");
      window.location.replace("./entidade.html");
    }
    else if(response.status == 202){
      alert("Login efetivado com sucesso");
      window.location.replace("./entidade.html");
    }
    else if(response.status ==204){
      alert("Apagado com sucesso.");
      window.location.replace("./entidade.html");
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
    return console.log(response);
    });
}

window.onload=function(){

  fetch('http://localhost:8080/read/municipio', {
    method: 'GET',
    headers: {'Authorization': 'Bearer ' + meuToken},
  }).then(function(response){

    //checar o status do pedido
    console.log(response);
  
    //tratamento dos erros
    if(response.status == 200){
      console.log("200 ok.");
    }
    else if(response.status ==201){
      alert("Usuário criado com sucesso");
      window.location.replace("./entidade.html");
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
    return response.json().then(function(json){
      let x,y,i;
      x = "<option>" + json["0"].uf + "</option>"
      for (i=0;i<json.length;i++) {
        x += "<option>" + json[i].uf + "</option>"
      }
        document.getElementById("uf").innerHTML = x;

      y = "<option>" + json["0"].nome_municipio + "</option>"
      for (i=0;i<json.length;i++){
        y += "<option>" + json[i].nome_municipio + "</option>"
      }
        document.getElementById("nomeMun").innerHTML = y;
      })

    });
}