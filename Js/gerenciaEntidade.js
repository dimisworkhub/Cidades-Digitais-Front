var info = {"cnpj" : " ","nome" : " ","endereco" : " ","numero" : " ","bairro" : " ","cep" : " ","nome_municipio" : " ","uf" : " ","observacao" : " "};
var a = document.getElementById("CNPJ");
a.value=sessionStorage.getItem("CNPJ");

function changer(){
info.cnpj = sessionStorage.getItem("CNPJ");
var b = document.getElementById("submitNome");
info.nome = b.value;
var c = document.getElementById("submitEndereco");
info.endereco = c.value;
var d = document.getElementById("submitNumero");
info.numero = d.value;
var e = document.getElementById("submitBairro");
info.bairro = e.value;
var f = document.getElementById("submitCEP");
info.cep = f.value;
var g = document.getElementById("submitNomeMun");
info.nome_municipio = g.value;
var h = document.getElementById("submitUF");
info.uf = h.value;
var i = document.getElementById("submitObs");
info.observacao = i.value;
}

function formatar(mascara, documento){
  var i = documento.value.length;
  var saida = mascara.substring(0,1);
  var texto = mascara.substring(i)
  
  if (texto.substring(0,1) != saida){
            documento.value += texto.substring(0,1);
  }
  
}

function envio(){

  //pega o token do login
  let meuToken = sessionStorage.getItem("Token");
  //pega o CNPJ escolhido anteriormente
  //let meuCNPJ = sessionStorage.getItem("CNPJ");
  //transforma as informações do token em json
  let corpo = JSON.stringify(info);

  //função fetch para mandar
  fetch('http://localhost:8080/read/entidade', {
    method: 'EDIT',
    body: corpo,
    headers: {'Authorization': 'Bearer ' + meuToken},
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
      //no caso a senha
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
    return response.json().then(function(response){
    console.log(response)
      });
    });
}

/*

//testar se funciona depois
window.onload=function(){

  //pega o token do login
  let meuToken = sessionStorage.getItem("Token");

  fetch('http://localhost:8080/read/municipio', {
    method: 'GET',
    headers: {'Authorization': 'Bearer ' + meuToken},
  }).then(function(response){

    //checar o status do pedido
    console.log(response);

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

    //remover comentação quando municipio for adcionado
    //else if(response.status ==404){
    //  window.location.replace("./errors/404.html");
    //}
    else if(response.status ==409){
      alert("Erro: Usuário já existente.");
    }
    else if(response.status == 412){
      //no caso a senha
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
      for (let i=0;i<json.length;i++) {
        x += "<option>" + response.uf[i] + "</option>"
      }
        document.getElementById("estados").innerHTML = x;
      });
    });
}

window.onload=function(){

  //pega o token do login
  let meuToken = sessionStorage.getItem("Token");

  fetch('http://localhost:8080/read/municipio', {
    method: 'GET',
    headers: {'Authorization': 'Bearer ' + meuToken},
  }).then(function(response){

    //checar o status do pedido
    console.log(response);

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

    //remover comentação quando municipio for adcionado
    //else if(response.status ==404){
    //  window.location.replace("./errors/404.html");
    //}
    else if(response.status ==409){
      alert("Erro: Usuário já existente.");
    }
    else if(response.status == 412){
      //no caso a senha
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
      for (let i=0;i<json.length;i++) {
        x += "<option>" + response.nome_municipio[i] + "</option>"
      }
        document.getElementById("municipios").innerHTML = x;
      });
    });
}*/