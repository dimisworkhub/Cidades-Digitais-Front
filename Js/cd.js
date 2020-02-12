//Fazer Tabela
let cod_ibgeQuery=[];
//pega o token do login
let meuToken = localStorage.getItem("token");

window.onload=function(){
    //função fetch para mandar
    fetch('http://localhost:8080/read/cd', {
      method: 'GET',
      headers: {'Authorization': 'Bearer ' + meuToken},
    }).then(function(response){
      //tratamento dos erros
      if(response.status == 200){
        console.log("ok");
      }
      else if(response.status ==201){
        console.log("Cidade Digital criada com sucesso");
      }
      else if(response.status ==204){
        console.log("Apagado com sucesso.");
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
        console.log("Erro: cd já existente.");
      }
      else if(response.status == 412){
        console.log("Erro: Informação colocada é incorreta.");
      }
      else if(response.status == 422){
        console.log("Erro: Usuário ou senha inválidos.");
      }
      else if(response.status == 500){
        window.location.replace("./errors/500.html");
      }
      else if(response.status == 504){
        window.location.replace("./errors/504.html");
      }
      //caso seja um dos erros não listados
      else{
        console.log("ERRO DESCONHECIDO");
      }
      //pegar o json que possui a tabela
      return response.json().then(function(json){
        console.log(json);

        let tabela = (`<thead style="background: #4b5366; color:white; font-size:15px">
          <tr>
          <th> <span class="custom-checkbox">
          <input type="checkbox" id="selectAll">
          <label for="selectAll"></label>
          </span></th>
          <th scope="col">Código IBGE do Município</th>
          <th scope="col">Município</th>
          <th scope="col">Código Lote</th>
          <th scope="col">O.S. Projeto Executivo</th>
          <th scope="col">Data de Projeto Executivo</th>
          <th scope="col">O.S. Implementação</th>
          <th scope="col">Data de Implementação</th>
          <th scope="col">Opções</th>
          </tr>
          </thead>`);
        tabela += (`<tbody> <tr>`);



            for(let i=0;i<json.length;i++){
              cod_ibgeQuery[i]=json[i]["cod_ibge"]; 
              tabela += (`<td>
              <span class="custom-checkbox">
              <input type="checkbox" id="checkbox1" name="options[]" value="1">
              <label for="checkbox1"></label>
              </span>
              </td>`);
              tabela += (`<td>`);
              tabela += json[i]["cod_ibge"]; 
              tabela += (`</td> <td>`);
              tabela += json[i]["nome_municipio"] 
              tabela += (`</td> <td>`);
              tabela += json[i]["cod_lote"] 
              tabela += (`</td> <td>`);
              tabela += json[i]["os_pe"] 
              tabela += (`</td> <td>`);
              tabela += json[i]["data_pe"] 
              tabela += (`</td> <td>`);
              tabela += json[i]["os_imp"] 
              tabela += (`</td> <td>`);
              tabela += json[i]["data_imp"] 
              tabela += (`</td> <td> 
              <span class="d-flex">
              <button onclick="editarCd(`+ i +`)" class="btn btn-success">
              <i class="material-icons"data-toggle="tooltip" title="Edit">&#xE254;</i>
              </button>
              <button onclick="apagarCd()" class="btn btn-danger">
              <i class="material-icons"data-toggle="tooltip" title="Delete">&#xE872;</i>
              </button> 
              </span> </td>`);
              tabela += (`</tr> <tr>`);          
            }


        tabela += (`</tr> </tbody>`);
        document.getElementById("tabela").innerHTML= tabela;
            
            $(document).ready(function () {
            // Select/Deselect checkboxes
            var checkbox = $('table tbody input[type="checkbox"]');
            $("#selectAll").click(function () {
              if (this.checked) {
                checkbox.each(function () {
                   this.checked = true;
                 });
              }else {
                checkbox.each(function () {
                  this.checked = false;
                 });
               }
             });
            checkbox.click(function () {
              if (!this.checked) {
                 $("#selectAll").prop("checked", false);
              }
            });
          });


        });
      });
}

function editarCd(valor){
localStorage.setItem("COD_IBGE", cod_ibgeQuery[valor]);
window.location.href = "./gerenciaCd.html";
}





//Fazer Entidade
var info = {"cod_ibge" : " ","cod_lote" : " ","os_pe" : " ","data_pe" : " ","os_imp" : " ","data_imp" : " "};

function changer(){
var a = document.getElementById("cod_ibge");
info.cod_ibge = a.value;
var b = document.getElementById("cod_lote");
info.cod_lote = b.value;
var c = document.getElementById("os_pe");
info.os_pe = c.value;
var d = document.getElementById("data_pe");
info.data_pe = d.value;
var e = document.getElementById("os_imp");
info.os_imp = e.value;
var f = document.getElementById("data_imp");
info.data_imp = f.value;
}

function formatar(mascara, documento){
  var i = documento.value.length;
  var saida = mascara.substring(0,1);
  var texto = mascara.substring(i)
  
  if (texto.substring(0,1) != saida){
    documento.value += texto.substring(0,1);
  }
  
}

function enviar(){

  //pega o token do login
  let meuToken = localStorage.getItem("token");

  //transforma as informações do token em json
  let corpo = JSON.stringify(info);

  //função fetch para mandar
  fetch('http://localhost:8080/read/cd', {
    method: 'POST',
    body: corpo,
    headers: {'Authorization': 'Bearer ' + meuToken},
  }).then(function(response){

    //checar o status do pedido
    console.log(response);

    //tratamento dos erros
    if(response.status == 200){
      window.location.replace("./cd.html");
    }
    else if(response.status ==201){
      alert("Usuário criado com sucesso");
      window.location.replace("./cd.html");
    }
    else if(response.status == 202){
      alert("Login efetivado com sucesso");
      window.location.replace("./cd.html");
    }
    else if(response.status ==204){
      alert("Apagado com sucesso.");
      window.location.replace("./cd.html");
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
    console.log(json);
      });
    });
}