//Fazer Tabela
let cod_usuarioQuery = [];
//pega o token do login
let meuToken = localStorage.getItem("token");

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
    } else if (response.status == 201) {
      console.log("Usuario criado com sucesso");
    } else if (response.status == 204) {
      console.log("Apagado com sucesso.");
    } else if (response.status == 400) {
      window.location.replace("./errors/400.html");
    } else if (response.status == 401) {
      window.location.replace("./errors/401.html");
    } else if (response.status == 403) {
      window.location.replace("./errors/403.html");
    } else if (response.status == 404) {
      window.location.replace("./errors/404.html");
    } else if (response.status == 409) {
      console.log("Erro: usuario já existente.");
    } else if (response.status == 412) {
      console.log("Erro: Informação colocada é incorreta.");
    } else if (response.status == 422) {
      console.log("Erro: Usuário ou senha inválidos.");
    } else if (response.status == 500) {
      window.location.replace("./errors/500.html");
    } else if (response.status == 504) {
      window.location.replace("./errors/504.html");
    }
    //caso seja um dos erros não listados
    else {
      console.log("ERRO DESCONHECIDO");
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


    });
  });
}

function editarUsuario(valor) {
  localStorage.setItem("COD_USUARIO", cod_usuarioQuery[valor]);
  window.location.href = "./gerenciaUsuario.html";
}





//Fazer Entidade
var info = {
  "nome": "",
  "email": "",
  //"staus": "",
  "login": "",
  "senha": ""
};

function changer() {
  var b = document.getElementById("nome");
  info.nome = b.value;
  var c = document.getElementById("email");
  info.email = c.value;
  //var d = document.getElementById("status");
  //info.status = d.value;
  var e = document.getElementById("login");
  info.login = e.value;
  var f = document.getElementById("senha");
  info.senha = f.value;
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
    if (response.status == 200) {
      window.location.replace("./home.html");
    } else if (response.status == 201) {
      alert("Usuário criado com sucesso");
      window.location.replace("./home.html");
    } else if (response.status == 202) {
      alert("Login efetivado com sucesso");
      window.location.replace("./home.html");
    } else if (response.status == 204) {
      alert("Apagado com sucesso.");
      window.location.replace("./home.html");
    } else if (response.status == 400) {
      window.location.replace("./errors/400.html");
    } else if (response.status == 401) {
      window.location.replace("./errors/401.html");
    } else if (response.status == 403) {
      window.location.replace("./errors/403.html");
    } else if (response.status == 404) {
      window.location.replace("./errors/404.html");
    } else if (response.status == 409) {
      alert("Erro: Usuário já existente.");
    } else if (response.status == 412) {
      alert("Erro: Informação colocada é incorreta.");
    } else if (response.status == 422) {
      alert("Erro: Usuário ou senha inválidos.");
    } else if (response.status == 500) {
      window.location.replace("./errors/500.html");
    } else if (response.status == 504) {
      window.location.replace("./errors/504.html");
    } else {
      alert("ERRO DESCONHECIDO");
    }
    return response.json().then(function (json) {
      console.log(json);
    });
  });
}