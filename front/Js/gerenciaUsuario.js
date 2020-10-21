
//pega o valor do usuario logado
let codigoLogado = localStorage.getItem("codigoLogado");

//pega o valor do usuário selecionado
let meuCodigo = localStorage.getItem("cod_usuario");

//para modulos
let jsonFinal = [];

window.onload = function () {
  // inserindo os valores no html
  document.getElementById("cod_usuario").value = meuCodigo;
  document.getElementById("nome").value = localStorage.getItem("nome");
  document.getElementById("email").value = localStorage.getItem("email");
  document.getElementById("login").value = localStorage.getItem("login");
  document.getElementById("status").value = localStorage.getItem("status");
  document.getElementById("senha").value = localStorage.getItem("senha");
}


function enviar() {

  let info = {
    "cod_usuario": parseInt(meuCodigo),
    "nome": document.getElementById("nome").value,
    "email": document.getElementById("email").value,
    "login": document.getElementById("login").value,
    "status": document.getElementById("status").value,
    "senha": document.getElementById("senha").value,
  };

  //transforma as informações do token em json
  let corpo = JSON.stringify(info);
  //console.log(corpo);
  //função fetch para mandar
  fetch(servidor + 'read/usuario/' + parseInt(codigoLogado), {
    method: 'PUT',
    body: corpo,
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //checar o status do pedido
    //console.log(response.status);

    //tratamento dos erros
    if (response.status == 200 || response.status == 202) {
      window.location.replace("./usuario.html");
    } else {
      erros(response.status);
    }
  });
}

function usuarioModulo(){

  //função fetch para mandar
  fetch(servidor + 'read/usuario/' + meuCodigo + "/modulo", {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {
    //tratamento dos erros
    if (response.status == 200) {
      //console.log(response.statusText);

      //pegar o json que possui a tabela
      response.json().then(function (json) {

        //para manipular os valores
        jsonFinal = json;

        console.log(json);

        let tabela = (`<thead style="background: #4b5366; color:white; font-size:15px">
            <tr>
            <th style="width:5%" scope="col">Código</th>
            <th style="width:10%" scope="col">Módulo</th>
            <th style="width:15%" scope="col">Categoria 1</th>
            <th style="width:15%" scope="col">Categoria 2</th>
            <th style="width:15%" scope="col">Categoria 3</th>
            <th style="width:35%" scope="col">Descrição</th>
            <th style="width:5%" scope="col">Edição</th>
            </tr>
            </thead>`);
        tabela += (`<tbody>`);


        for (let i = 0; i < jsonFinal.length; i++) {
          tabela += (`<tr> <td>`);
          tabela += jsonFinal[i]["cod_usuario"];
          tabela += (`</td> <td>`);
          tabela += jsonFinal[i]["cod_modulo"];
          tabela += (`</td> <td>`);
          tabela += jsonFinal[i]["categoria_1"];
          tabela += (`</td> <td>`);
          tabela += jsonFinal[i]["categoria_2"];
          tabela += (`</td> <td>`);
          tabela += jsonFinal[i]["categoria_3"];
          tabela += (`</td> <td>`);
          tabela += jsonFinal[i]["descricao"];
          tabela += (`</td> <td>
          <span class="d-flex">
          <button onclick="removerModulo(` + i + `)" class="btn btn-success"><img src="img/delete-icon.png" width="30px"></button>
          </span> </td> </tr>`);
        }
        tabela += (`</tbody>`);
        document.getElementById("tabela").innerHTML = tabela;
      });
    } else {
      erros(response.status);
    }
  });
}

function removerModulo(valorModulo) {

  let info = {
    "cod_usuario": parseInt(jsonFinal[valorModulo].cod_usuario),
    "cod_modulo": parseInt(jsonFinal[valorModulo].cod_modulo),
  }

  //transforma as informações do token em json
  let corpo = JSON.stringify(info);
  //função fetch para deletar
  fetch(servidor + 'read/usuario/' + codigoLogado + "/modulo", {
    method: 'DELETE',
    body:corpo,
    headers: {
      'Authorization': 'Bearer ' + meuToken,
    },
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 204) {
      //alert("Apagado com sucesso.");
      location.reload();
    } else {
      erros(response.status);
    }
    return response.json().then(function (json) {
      //console.log(json);
    });
  });
}