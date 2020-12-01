//pega o valor do usuario logado
let codigoLogado = localStorage.getItem("codigoLogado");

//pega o valor do usuário selecionado
let meuCodigo = localStorage.getItem("cod_usuario");

//para pegar os modulos usados
let modulosUsuario = [];

window.onload = function () {
  // inserindo os valores no html
  document.getElementById("cod_usuario").value = meuCodigo;
  document.getElementById("nome").value = localStorage.getItem("nome");
  document.getElementById("email").value = localStorage.getItem("email");
  document.getElementById("login").value = localStorage.getItem("login");
  document.getElementById("status").value = localStorage.getItem("status");
  document.getElementById("senha").value = localStorage.getItem("senha");
  console.log(codigoLogado);
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
  fetch(servidor + 'read/usuario/' + codigoLogado, {
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
      //erros(response.status);
    }
  });
}







//para visualizar os modulos
function usuarioModulo(){
  document.getElementById("editar").innerHTML = (`<button class="btn btn-success" data-toggle="modal" onclick="adicionarModulo()" data-target="#adicionarModulo">Adicionar Modulos</button>`);
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
        modulosUsuario = json;

        //console.log(json);

        let tabela = (`<thead style="background: #4b5366; color:white; font-size:15px">
            <tr>
            <th style="width:10%" scope="col">Módulo</th>
            <th style="width:20%" scope="col">Categoria 1</th>
            <th style="width:20%" scope="col">Categoria 2</th>
            <th style="width:20%" scope="col">Categoria 3</th>
            <th style="width:25%" scope="col">Descrição</th>
            <th style="width:5%" scope="col">Edição</th>
            </tr>
            </thead>`);
        tabela += (`<tbody>`);

        for (let i = 0; i < modulosUsuario.length; i++) {
          tabela += (`</td> <td>`);
          tabela += modulosUsuario[i]["cod_modulo"];
          tabela += (`</td> <td>`);
          tabela += modulosUsuario[i]["categoria_1"];
          tabela += (`</td> <td>`);
          tabela += modulosUsuario[i]["categoria_2"];
          tabela += (`</td> <td>`);
          tabela += modulosUsuario[i]["categoria_3"];
          tabela += (`</td> <td>`);
          tabela += modulosUsuario[i]["descricao"];
          tabela += (`</td> <td> <span class="d-flex">
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

//para inserir com os modulos
let valorModulo = [];

//para saber qual foi clickado e remover
let controleDeClick = [];

function adicionarModulo(){
  //função fetch para mandar itens do modulo
  fetch(servidor + 'read/modulo', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 200 || response.status == 201) {
      //console.log(response.statusText);

      //pegar o json que possui a tabela
      response.json().then(function (json) {

        //usado para listar os modulos usados na criação do usuario
        listaModulo = json;

        let tabelaMod = (`<thead style="background: #4b5366; color:white; font-size:15px">
                <tr>
                <th style="width:5%"> <span class="custom-checkbox">
                <input type="checkbox" id="selectAll" >
                <label for="selectAll"></label>
                </span></th>
                <th style="width:5%" scope="col">Cód. Módulo</th>
                <th style="width:5%" scope="col">Módulo</th>
                <th style="width:5%" scope="col">Sub. Módulo</th>
                <th style="width:5%" scope="col">Ação</th>
                </tr>
                </thead>`);
        tabelaMod += (`<tbody>`);

        for (let i = 0; i < json.length; i++) {

          //para saber qual foi clickado e remover
          controleDeClick[i] = false;

          tabelaMod += (`<tr> <td>
                <span class="custom-checkbox">
                <input class="checking" onclick="modulos(` + i + `)" type="checkbox" id="checkbox` + i + `" name="options[]" value="` + json[i]["cod_modulo"] + `">
                <label for="checkbox` + i + `"></label>
                </span>
                </td>`);
          tabelaMod += (`<td>`);
          tabelaMod += json[i]["cod_modulo"];
          tabelaMod += (`</td> <td>`);
          tabelaMod += json[i]["categoria_1"];
          tabelaMod += (`</td> <td>`);
          tabelaMod += json[i]["categoria_2"];
          tabelaMod += (`</td> <td>`);
          tabelaMod += json[i]["categoria_3"];
          tabelaMod += (`</td> </tr>`);
        }

        tabelaMod += (`</tbody>`);
        document.getElementById("tabelaMod").innerHTML = tabelaMod;

        //fazendo os modulos selecionados aparecerem
        for(let i = 0; i < json.length; i++){
          //garantindo valor inicial
          valorModulo[i] = null;
          for(let j = 0; j < modulosUsuario.length; j++){
            if(json[i].cod_modulo == modulosUsuario[j].cod_modulo){
              document.getElementById("checkbox" + i).click();
            }
          }
        }

        $(document).ready(function () {
          // Select/Deselect checkboxes
          let checkbox = $('table tbody input[type="checkbox"]');
          $("#selectAll").click(function () {
            if (this.checked) {

              checkbox.each(function () {
                this.checked = true;
              });

              for (i = 0; i < json.length; i++) {
                valorModulo[i] = listaModulo[i]["cod_modulo"];
              }
            } else {

              checkbox.each(function () {
                this.checked = false;
              });

              for (i = 0; i < json.length; i++) {
                valorModulo[i] = null;
              }
            }
          });
          checkbox.click(function () {
            if (!this.checked) {
              $("#selectAll").prop("checked", false);
            }
          });
        });

      });

    } else {
      erros(response.status);
    }
  });
}

//pega os valores de modulo dos checkboxes e coloca na estrutura valorModulo
function modulos(numCod) {
  let mods = document.getElementById("checkbox" + numCod);
  if (mods.checked) {
    valorModulo[numCod] = mods.value;
    if(controleDeClick[numCod] == false){
      controleDeClick[numCod] = true;
    }else{
      controleDeClick[numCod] = false;
    }
  } else {
    valorModulo[numCod] = null;
    if(controleDeClick[numCod] == false){
      controleDeClick[numCod] = true;
    }else{
      controleDeClick[numCod] = false;
    }
  }
}

function enviarModulo(){

  let j = 0;
  let infoAdicionar = [];
  let infoDeletar = [];

  for (let i = 0; i < listaModulo.length; i++) {

    if (valorModulo[i] != null && controleDeClick == true){
      infoAdicionar[j] = {
        "cod_usuario": parseFloat(meuCodigo),
        "cod_modulo": parseFloat(valorModulo[i]),
      }
      j++;

      //transforma todas as informações do token em json
      let corpoModulo = JSON.stringify(infoAdicionar);
      console.log(corpoModulo);
      
      //função fetch para mandar
      fetch(servidor + 'read/usuario/' + codigoLogado + '/modulo', {
        method: 'POST',
        body: corpoModulo,
        headers: {
          'Authorization': 'Bearer ' + meuToken
        },
      }).then(function (response) {

        //checar o status do pedido
        console.log(response.statusText);

        //tratamento dos erros
        if (response.status == 200 || response.status == 201) {
          //alert("Módulos inseridos com sucesso");
        } else {
          erros(response.status);
        }
      });
    }

    else{
      if(controleDeClick == true){

        //transforma as informações do token em json
        let corpoDeletar = JSON.stringify(infoDeletar);
        console.log(corpoDeletar);

        //função fetch para deletar
        fetch(servidor + 'read/usuario/' + codigoLogado + "/modulo", {
          method: 'DELETE',
          body:corpoDeletar,
          headers: {
            'Authorization': 'Bearer ' + meuToken,
          },
        }).then(function (response) {

          //checar o status do pedido
          console.log(response.statusText);

          //tratamento dos erros
          if (response.status == 204) {
            //alert("Apagado com sucesso.");
          } else {
            erros(response.status);
          }
        });
      }
    }

  }

  //location.reload();

}



//para remover modulos
function removerModulo(valorModulo) {

  //será ajustado para funcionar com varios valores
  let info = [];
  info[0] = {
    "cod_usuario": parseInt(modulosUsuario[valorModulo].cod_usuario),
    "cod_modulo": parseInt(modulosUsuario[valorModulo].cod_modulo),
  }

  //transforma as informações do token em json
  let corpo = JSON.stringify(info);
  //console.log(corpo);

  //função fetch para deletar
  fetch(servidor + 'read/usuario/' + codigoLogado + "/modulo", {
    method: 'DELETE',
    body:corpo,
    headers: {
      'Authorization': 'Bearer ' + meuToken,
    },
  }).then(function (response) {

    //checar o status do pedido
    console.log(response.statusText);

    //tratamento dos erros
    if (response.status == 204) {
      //alert("Apagado com sucesso.");
      //location.reload();
    } else {
      erros(response.status);
    }
    // return response.json().then(function (json) {
    //   console.log(json);
    // });
  });
}