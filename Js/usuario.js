//Fazer Tabela
let cod_usuarioQuery = [];
//pega o token do login
let meuToken = localStorage.getItem("token");


//tratamento de erros
function erros(value){
  if (value == 400) {
    window.location.replace("./errors/400.html");
  } else if (value == 401) {
    window.location.replace("./errors/401.html");
  } else if (value == 403) {
    window.location.replace("./errors/403.html");
  } else if (value == 404) {
    window.location.replace("./errors/404.html");
  } else if (value == 409) {
    alert("Erro: Usuário já existente.");
  } else if (value == 412) {
    alert("Erro: Informação colocada é incorreta.");
  } else if (value == 422) {
    alert("Erro: Informação incorreta.");
  } else if (value == 500) {
    window.location.replace("./errors/500.html");
  } else if (value == 504) {
    window.location.replace("./errors/504.html");
  } else {
    alert("ERRO DESCONHECIDO");
  }
}


window.onload = function () {
    //função fetch para mandar
    fetch('http://localhost:8080/read/usuario', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + meuToken
        },
      }).then(function (response) {
          //tratamento dos erros
          if (response.status == 200) {
            console.log("ok");
          } else {
            erros(response.status);
          }
          //pegar o json que possui a tabela
          return response.json().then(function (json) {
            console.log(json);
            console.log(response.text);

            let tabela = (`<thead style="background: #4b5366; color:white; font-size:15px">
          <tr>
          <th> <span class="custom-checkbox">
          <input type="checkbox" id="selectAll">
          <label for="selectAll"></label>
          </span></th>
          <th scope="col">Cód. Usuario</th>
          <th scope="col">Nome</th>
          <th scope="col">E-mail</th>
          <th scope="col">Status</th>
          <th scope="col">Login</th>
          <th scope="col">Opções</th>
          </tr>
          </thead>`);
            tabela += (`<tbody> <tr>`);



            for (let i = 0; i < json.length; i++) {
              cod_usuarioQuery[i] = json[i]["cod_usuario"];
              tabela += (`<td>
              <span class="custom-checkbox">
              <input type="checkbox" id="checkbox1" name="o
              console.log(response.text);ptions[]" value="1">
              <label for="checkbox1"></label>
              </span>
              </td>`);
              tabela += (`<td>`);
              tabela += json[i]["cod_usuario"];
              tabela += (`</td> <td>`);
              tabela += json[i]["nome"]
              tabela += (`</td> <td>`);
              tabela += json[i]["email"]
              tabela += (`</td> <td>`);
              tabela += json[i]["status"]
              tabela += (`</td> <td>`);
              tabela += json[i]["login"]
              tabela += (`</td> <td> 
              <span class="d-flex">
              <button onclick="editarUsuario(` + i + `)" class="btn btn-success">
              <i class="material-icons"data-toggle="tooltip" title="Edit">&#xE254;</i>
              </button>
              <button onclick="apagarUsuario()" class="btn btn-danger">
              <i class="material-icons"data-toggle="tooltip" title="Delete">&#xE872;</i>
              </button> 
              </span> </td>`);
              tabela += (`</tr> <tr>`);
            }


            tabela += (`</tr> </tbody>`);
            document.getElementById("tabela").innerHTML = tabela;

            $(document).ready(function () {
              // Select/Deselect checkboxes
              var checkbox = $('table tbody input[type="checkbox"]');
              $("#selectAll").click(function () {
                if (this.checked) {
                  checkbox.each(function () {
                    this.checked = true;
                  });
                } else {
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



    //Fazer Tabela para Modulos

    //função fetch para mandar itens 
    //mudar para modulo quando possivel e se necessario
    fetch('http://localhost:8080/read/entidade', {
       method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + meuToken
      },
        }).then(function (response) {
             //tratamento dos erros
            if (response.status == 200) {
               console.log("ok");
             } else if (response.status == 201) {
              console.log("Entidade criada com sucesso");
            } else if (response.status == 204) {
              console.log("Apagado com sucesso.");
             } else {
               erros(response.status);
            }
             //pegar o json que possui a tabela
            return response.json().then(function (json) {
              console.log(json);
              let cod_moduloQuery = [];
              let tabelaMod = (`<thead style="background: #4b5366; color:white; font-size:15px">
              <tr>
              <th> <span class="custom-checkbox">
              <input type="checkbox" id="selectAll">
              <label for="selectAll"></label>
              </span></th>
              <th scope="col">Cód. Módulo</th>
              <th scope="col">Módulo</th>
              <th scope="col">Sub. Módulo</th>
              <th scope="col">Ação</th>
              </tr>
              </thead>`);
              tabelaMod += (`<tbody> <tr>`);



              for (let i = 0; i < json.length; i++) {
                cod_moduloQuery[i] = json[i]["cod_modulo"];
                tabelaMod += (`<td>
              <span class="custom-checkbox">
              <input type="checkbox" id="checkbox1" name="o
              console.log(response.text);ptions[]" value="1">
              <label for="checkbox1"></label>
              </span>
              </td>`);
                tabelaMod += (`<td>`);
                tabelaMod += json[i]["cod_modulo"];
                tabelaMod += (`</td> <td>`);
                tabelaMod += json[i]["categoria_1"]
                tabelaMod += (`</td> <td>`);
                tabelaMod += json[i]["categoria_2"]
                tabelaMod += (`</td> <td>`);
                tabelaMod += json[i]["categoria_3"]
                tabelaMod += (`</td>`);
                tabelaMod += (`</tr> <tr>`);
              }


              tabelaMod += (`</tr> </tbody>`);
              document.getElementById("tabelaMod").innerHTML = tabelaMod;
            });
          });
        });
      });
}
function editarUsuario(valor) {
  localStorage.setItem("cod_usuario", cod_usuarioQuery[valor]);
  window.location.href = "./gerenciaUsuario.html";
}


//Fazer Usuário
var info = {
  "nome": "",
  "email": "",
  "login": "",
  "senha": ""
};

function changer() {
  var a = document.getElementById("nome");
  info.nome = a.value;
  var b = document.getElementById("email");
  info.email = b.value;
  var c = document.getElementById("login");
  info.login = c.value;
  var d = document.getElementById("senha");
  info.senha = d.value;
}

function enviar() {

  //transforma as informações do token em json
  let corpo = JSON.stringify(info);

  //função fetch para mandar
  fetch('http://localhost:8080/read/usuario/createuser', {
    method: 'POST',
    body: corpo,
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //checar o status do pedido
    console.log(response);

    //tratamento dos erros
    if (response.status == 201) {
      alert("Usuário criado com sucesso");
    } else {
      erros(response.status);
   }
    return response.json().then(function (json) {
      console.log(json);
    });
  });
}

function apagarUsuario(valor) {
  //transforma as informações do token em json
  let corpo = JSON.stringify(info);

  //função fetch para mandar
 fetch('http://localhost:8080/read/usuario/' + cod_usuarioQuery[valor], {
   method: 'DELETE',
   headers: {
     'Authorization': 'Bearer ' + meuToken
   },
 }).then(function (response) {
   //checar o status do pedido
   console.log(response);
   //tratamento dos erros
   if (response.status == 204) {
     alert("Apagado com sucesso.");
     window.location.replace("./usuario.html");
   } else {
     erros(response.status);
   }
 });
}