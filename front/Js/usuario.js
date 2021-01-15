//Fazer Tabela
let listaModulo = [];

//pega o usuario logado
let userLogado = localStorage.getItem("logado");

//pega o valor do usuario logado
let codigoLogado = localStorage.getItem("codigoLogado");

//organizar os modulos
let userCriado,
  userTotal = [],
  valorModulo = [];

function paginacao() {

  console.log(userLogado);

  porPagina = document.getElementById("quantos").value;
  let comeco = contador * porPagina;
  let fim = (contador + 1) * porPagina;

  //função fetch para mandar
  fetch(servidor + 'read/usuario', {
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

        let tabela = (`<thead style="background: #4b5366; color:white; font-size:15px">
            <tr>
            <th scope="col">Código</th>
            <th scope="col">Nome</th>
            <th scope="col">E-mail</th>
            <th scope="col">Login</th>
            <th scope="col">Status</th>
            <th scope="col">Opções</th>
            </tr>
            </thead>`);
        tabela += (`<tbody>`);

        // função para checar quem está ativo ou inativo
        let selecao = document.getElementById("status").value;
        
        //para quando o status for inativo
        let j = 0;
        let jsonDeStatus = [];
        for (let i = 0; i < json.length; i++) {
          if (selecao == 1) {
            if (json[i]["status"] == 1) {
              jsonDeStatus[j] = json[i];
              j++;
            }
          }
          else if (selecao == 2){
            if (json[i]["status"] == 0) {
              jsonDeStatus[j] = json[i];
              j++;
            }
          }
          else{
            jsonDeStatus = json;
          }
        }

        //sistema de filtragem:
        let filtrado = [];
        filtrado = filtro(jsonDeStatus,["cod_usuario","nome","email","login","status"]);

        //para edição
        jsonFinal=filtrado;

        for (let i = comeco; i < fim && i < filtrado.length; i++) {
          userTotal[i] = filtrado[i];

          if (userLogado == filtrado[i]["login"]) {
            localStorage.setItem("codigoLogado", filtrado[i]["cod_usuario"]);
          }

          tabela += (`<tr> <td>`);
          tabela += filtrado[i]["cod_usuario"];
          tabela += (`</td> <td>`);
          tabela += filtrado[i]["nome"];
          tabela += (`</td> <td>`);
          tabela += filtrado[i]["email"];
          tabela += (`</td> <td>`);
          tabela += filtrado[i]["login"];
          tabela += (`</td> <td>`);

          if(filtrado[i]["status"] == 1){
            tabela += "Ativo";
          }else{
            tabela += "Inativo";
          }

          tabela += (`</td> <td> <span class="d-flex">
                <button onclick="editarUsuario(` + i + `)" class="btn btn-success"> <i class="material-icons"data-toggle="tooltip" title="Edit">&#xE254;</i> </button>
                </span> </td> </tr>`);
        }
        tabela += (`</tbody>`);
        document.getElementById("tabela").innerHTML = tabela;

        paginasOrganizadas(filtrado,comeco,fim);
      });
    } else {
      erros(response.status);
    }
  });
}

window.onload = function () {
  this.paginacao();

  //Fazer Tabela para Modulos

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
          tabelaMod += (`<tr> <td>
                <span class="custom-checkbox">
                <input class="checking" onclick="modulos(` + i + `)" type="checkbox" id="checkbox` + i + `" name="options[]" value="` + json[i]["cod_modulo"] + `">
                <label for="checkbox` + i + `"></label>
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
          tabelaMod += (`</td> </tr>`);
        }

        tabelaMod += (`</tbody>`);
        document.getElementById("tabelaMod").innerHTML = tabelaMod;

        $(document).ready(function () {
          // Select/Deselect checkboxes
          let checkbox = $('table tbody input[type="checkbox"]');
          $("#selectAll").click(function () {
            if (this.checked) {

              checkbox.each(function () {
                this.checked = true;
              });

              for (i = 0; i < json.length; i++) {
                valorModulo[i] = document.getElementById("checkbox" + i).value;
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

function editarUsuario(valor) {
  localStorage.setItem("cod_usuario", userTotal[valor].cod_usuario);
  localStorage.setItem("nome", userTotal[valor].nome);
  localStorage.setItem("email", userTotal[valor].email);
  localStorage.setItem("login", userTotal[valor].login);
  localStorage.setItem("status", userTotal[valor].status);
  localStorage.setItem("senha", userTotal[valor].senha);
  window.location.href = "./gerenciaUsuario.html";
}

//pega os valores de modulo dos checkboxes e coloca na estrutura valorModulo
function modulos(numCod) {
  let mods = document.getElementById("checkbox" + numCod);
  if (mods.checked) {
    valorModulo[numCod] = mods.value;
  } else {
    valorModulo[numCod] = null;
  }
}

function enviar() {

  //estrutura usada para mandar o JSON no fetch
  let info = {
    "nome": document.getElementById("nome").value,
    "email": document.getElementById("email").value,
    "login": document.getElementById("login").value,
    "senha": document.getElementById("senha").value,
  };

  //transforma as informações do token em json
  let corpo = JSON.stringify(info);

  //função fetch para mandar
  fetch(servidor + 'read/usuario/createuser', {
    method: 'POST',
    body: corpo,
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //checar o status do pedido
    //console.log(response);

    //tratamento dos erros
    if (response.status == 201) {
      //alert("Usuário criado com sucesso");
      response.json().then(function (json) {
        userCriado = json.cod_usuario;
      });
    } else {
      erros(response.status);
      location.reload();
    }
  });
}

function enviarModulo(){
  
  let cooldown =0, l = 0;
  let meuCodigo = 0;
  let infoAdicionar = [];

  //função fetch para mandar
  fetch(servidor + 'read/usuario', {
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

        for (let i = 0; i < json.length; i++) {
          meuCodigo = json[i].cod_usuario
        }

        for (let i = 0; i < listaModulo.length; i++) {

          if(document.getElementById("checkbox"+i).checked==true){
            // console.log(document.getElementById("checkbox"+i))
            infoAdicionar[l] = {
              "cod_usuario": parseFloat(meuCodigo),
              "cod_modulo": parseFloat(valorModulo[i]),
            }
            l++
          } 
          
        }
        
        //transforma todas as informações do token em json
        let corpoModulo = JSON.stringify(infoAdicionar);
        
        if(infoAdicionar.length>0){
          console.log(infoAdicionar.length);
      
          if(infoAdicionar.length == 80){
            cooldown = infoAdicionar.length
          }else if(infoAdicionar.length< 80){
            cooldown = infoAdicionar.length
          }else{
            cooldown = infoAdicionar.length - 80
          }
          
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
            
            console.log(response)
            //tratamento dos erros
            if (response.status == 200 || response.status == 201) {
            } else {
              erros(response.status);
            }
          });
        
        }
        cooldown = cooldown + 80;
        console.log(cooldown)
        if(cooldown<10){
          alert(`Por favor aguarde. Esta operação pode levar em média ${-(cooldown)} segundos.`);
        }else{
          alert(`Por favor aguarde. Esta operação pode levar em média ${cooldown/10} segundos.`);
        }
        setTimeout(function () {
          // location.reload();
        }, cooldown * 100);

      });
    } else {
      erros(response.status);
    }
  });
}