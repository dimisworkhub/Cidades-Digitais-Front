//capturar chave primaria
let loteQuery=[];
//Fazer Tabela
window.onload=function(){
    //pega o token do login
    let meuToken = sessionStorage.getItem("Token");
    //função fetch para mandar
    fetch('http://localhost:8080/read/lote', {
      method: 'GET',
      headers: {'Authorization': 'Bearer ' + meuToken},
    }).then(function(response){
      //tratamento dos erros
      if(response.status == 200){
        console.log("ok");
      }
      else if(response.status ==201){
        console.log("Entidade criada com sucesso");
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
        console.log("Erro: Usuário já existente.");
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
          <th scope="col">Lote</th>
          <th scope="col">CNPJ</th>
          <th scope="col">Contrato</th>
          <th scope="col">Data de Inicio</th>
          <th scope="col">Data Final</th>
          <th scope="col">Data de Reajuste</th>
          <th scope="col">Opções</th>
          </tr>
          </thead>`);
        tabela += (`<tbody> <tr>`);

            for(let i=0;i<json.length;i++){
              loteQuery[i]=json[i]["cnpj"]; 
              tabela += (`<td>
              <span class="custom-checkbox">
              <input type="checkbox" id="checkbox1" name="options[]" value="1">
              <label for="checkbox1"></label>
              </span>
              </td>`);
              tabela += (`<td>`);
              tabela += json[i]["cod_lote"]; 
              tabela += (`</td> <td>`);
              tabela += json[i]["cnpj"]; 
              tabela += (`</td> <td>`);
              tabela += json[i]["contrato"];
              tabela += (`</td> <td>`);

              tabela += json[i]["dt_inicio_vig"];
              tabela += (`</td> <td>`);
                let data2=json[i]["dt_final_vig"]
              tabela += data2;
              tabela += (`</td> <td>`);
              let data3=json[i]["dt_reajuste"];
              tabela += data3;
              tabela += (`</td> <td> 
              <span class="d-flex">
              <button onclick="editarLote(`+ i +`)" class="btn btn-success">
              <i class="material-icons"data-toggle="tooltip" title="Edit">&#xE254;</i>
              </button>
              <button onclick="apagarLote()" class="btn btn-danger">
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

function editarEntidade(valor){
sessionStorage.setItem("CNPJ", cnpjQuery[valor]);
window.location.href = "./gerenciaEntidade.html";
}





//Fazer Entidade
var info = {"cnpj" : " ","nome" : " ","endereco" : " ","numero" : " ","bairro" : " ","cep" : " ","nome_municipio" : " ","uf" : " ","observacao" : " "};

function changer(){
var a = document.getElementById("submitLote");
info.cnpj = a.value;
var b = document.getElementById("submitCNPJ");
info.nome = b.value;
var c = document.getElementById("submitContrato");
info.endereco = c.value;
var d = document.getElementById("submitDataI");
info.numero = d.value;
var e = document.getElementById("submitDataF");
info.bairro = e.value;
var f = document.getElementById("submitDataR");
info.cep = f.value;
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
  let meuToken = sessionStorage.getItem("Token");

  //transforma as informações do token em json
  let corpo = JSON.stringify(info);

  //função fetch para mandar
  fetch('http://localhost:8080/read/entidade', {
    method: 'POST',
    body: corpo,
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