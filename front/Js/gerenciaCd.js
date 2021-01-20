//usado para mostrar a cidade selecionada
let meuMunicipio = localStorage.getItem("nome_municipio");
let meuUF = localStorage.getItem("uf");

//pega os valores corretos das variaveis
let meuCodigo = localStorage.getItem("cod_ibge");
let meuLote = localStorage.getItem("cod_lote");

window.onload = function () {

  // inserindo os valores nos campos
  document.getElementById("nome_municipio").value = meuMunicipio + " - " + meuUF;
  document.getElementById("cod_lote").value = meuLote;
  document.getElementById("os_pe").value = localStorage.getItem("os_pe");
  document.getElementById("os_imp").value = localStorage.getItem("os_imp");

  //estes campos precisam de adaptações para utilizar de suas mascaras
  document.getElementById("data_pe").value = arrumaData(localStorage.getItem("data_pe"));
  document.getElementById("data_imp").value = arrumaData(localStorage.getItem("data_imp"));

  mascara();
}

function enviar() {

  //JSON usado para mandar as informações no fetch
  let info = {
    "cod_ibge": parseInt(meuCodigo),
    "cod_lote": parseInt(meuLote),
    "os_pe": document.getElementById("os_pe").value,
    "data_pe": mascaraData(document.getElementById("data_pe").value),
    "os_imp": document.getElementById("os_imp").value,
    "data_imp": mascaraData(document.getElementById("data_imp").value),
  };

  //transforma as informações do token em json
  let corpo = JSON.stringify(info);
  //função fetch para mandar
  fetch(servidor + 'read/cd/' + meuCodigo, {
    method: 'PUT',
    body: corpo,
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //checar o status do pedido
    //console.log(response);

    //tratamento dos erros
    if (response.status == 200 || response.status == 201) {
      //checar o json
      response.json().then(function (json) {

        //console.log(json);

      });
      window.location.replace("./cd.html");
    } else {
      erros(response.status);
    }
  });
}







//CD acompanhamento
let listaUacom = [],
  listaEdicaoAssunto = [],
  meuData = [];

//usado para fazer o id dos botões de assunto
let idAssunto = 0;

//para remover valores na parte de edição
let valorRemovido = [];

//dataAssunto usado para enviar assuntos após enviar as informações de acompanhamento
let dataAssunto;

function uacom() {

  //cria o botão para editar
  document.getElementById("editar").innerHTML = (`<button class="btn btn-success" data-toggle="modal" data-target="#adicionarUacom" onclick="pegarAssuntos()">Novo Acompanhamento</button>`);
  document.getElementById("editar2").innerHTML = "";

  //função fetch para chamar itens da tabela
  fetch(servidor + 'read/uacom/' + meuCodigo, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //checar os status de pedidos
    //console.log(response)

    //tratamento dos erros
    if (response.status == 200) {
      //console.log(response.statusText);

      //pegar o json que possui a tabela
      response.json().then(function (json) {

        //console.log(json);

        listaUacom = json;

        let tabela = (`<thead style="background: #4b5366; color:white; font-size:15px">
        <tr>
        <th style="width:20%" scope="col">Data</th>
        <th style="width:20%" scope="col">Assunto</th>
        <th style="width:20%" scope="col">Titulo</th>
        <th style="width:35%" scope="col">Relato</th>
        <th style="width:5%" scope="col">Editar</th>
        </tr>
        </thead>`);
        tabela += (`<tbody>`);

        for (i = 0; i < listaUacom.length; i++) {

          meuData[i] = listaUacom[i]["data"];

          tabela += (`<tr>`);
          tabela += (`<td class="data3">`);
          tabela += arrumaData2(listaUacom[i]["data"]);
          tabela += (`</td> <td>`);
          tabela += listaUacom[i]["descricao"];
          tabela += (`</td> <td>`);
          tabela += listaUacom[i]["titulo"];
          tabela += (`</td> <td>`);
          tabela += listaUacom[i]["relato"];
          tabela += (`</td>`);
          tabela += (`<td>
                  <span class="d-flex">
                  <button onclick="abrirEdicao(` + i + `)" class="btn btn-success" data-toggle="modal" data-target="#adicionarUacom">
                  <i class="material-icons"data-toggle="tooltip" title="Edit">&#xE254;</i>
                  </button>
                  </span> </td>`);
          tabela += (`</tr>`);
        }

        tabela += (`</tbody>`);
        document.getElementById("tabela").innerHTML = tabela;

        //Máscara colocada separadamente para tabela
        mascara();

      });
    } else {
      erros(response.status);
    }
  });
}

function pegarAssuntos() {
  //fetch de assunto
  fetch(servidor + 'read/assunto', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 200 || response.status == 201) {
      response.json().then(function (json) {

        //reseta para usar denovo
        idAssunto = 0;
        document.getElementById("adicoes").innerHTML = "";

        document.getElementById("titulo").value = "";
        document.getElementById("relato").value = "";

        let x = "";
        for (let i = 0; i < json.length; i++) {
          x += "<option value='" + json[i].cod_assunto + "'>" + json[i].descricao + "</option>";
        }

        document.getElementById("assunto").innerHTML = x;

        document.getElementById("botaoUacom").innerHTML = " <button class='btn btn-primary' onclick='novoUacom()' type='button'>Cadastrar</button>";

      });
    } else {
      erros(response.status);
    }
  });
}

function anotaAssunto() {

  let valorAssunto = document.getElementById("assunto").value;

  //para garantir que não haja assunto igual
  let possuiassunto = false;

  for(let i = 0; i < idAssunto; i++){
    if(document.getElementById("adicao"+i) != null && valorAssunto == document.getElementById("adicao"+i).value){
      possuiassunto = true;
      //console.log("aqui passa");
    }
  }

  //se não houver assunto
   if(possuiassunto == false){

    //o 0 define que é a primeira a ser selecionada, sendo que não há mais de uma seleção nesse select.
    let nomeAssunto = document.querySelector("#assunto").selectedOptions[0].text;

    let assuntoSelecionado = `<button class="btn" id="adicao` + idAssunto + `" value="` + valorAssunto + `"> <a class="btn" id="removedor` + idAssunto + `" type="reset" onclick="removerAssunto(` + idAssunto + `)" title="Deletar">` + nomeAssunto + ` <img src="img/delete-icon.png" width="30px"></a> </button>`;

    document.getElementById("adicoes").innerHTML += assuntoSelecionado;

    idAssunto++;
  }
  else{
    alert("Assunto já inserido.");
  }
}

function removerAssunto(valor) {

  //para saber qual deletar
  valorRemovido[valor] = document.getElementById("adicao" + valor).value;
  document.getElementById("adicoes").removeChild(document.getElementById("adicao" + valor));

}

function novoUacom() {

  let infoUacom = {
    "cod_ibge": parseInt(meuCodigo),
    "relato": document.getElementById("relato").value,
    "titulo": document.getElementById("titulo").value,
  };

  //transforma as informações em string para mandar
  let corpo = JSON.stringify(infoUacom);
  //console.log(corpo);

  //função fetch para mandar
  fetch(servidor + 'read/uacom', {
    method: 'POST',
    body: corpo,
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 200 || response.status == 201) {
      //alert('Acompanhamento inserido com sucesso!');

      //pegar a data para enviar no uacomassunto
      response.json().then(function (json) {
        dataAssunto = json.data;
        novoAssunto();
      });

    } else {
      erros(response.status);
    }
  });
}

function novoAssunto() {

  for (let i = 0; i < idAssunto; i++) {
    if (document.getElementById("adicao" + i) != undefined) {

      let infoAssunto = {
        "cod_ibge": parseInt(meuCodigo),
        "data": dataAssunto,
        "cod_assunto": parseInt(document.getElementById("adicao" + i).value),
      };

      //transforma as informações em string para mandar
      let corpo = JSON.stringify(infoAssunto);
      //console.log(corpo);

      //função fetch para mandar
      fetch(servidor + 'read/uacomassunto', {
        method: 'POST',
        body: corpo,
        headers: {
          'Authorization': 'Bearer ' + meuToken
        },
      }).then(function (response) {

        //tratamento dos erros
        if (response.status == 200 || response.status == 201) {
          //reseta para usar denovo
          idAssunto = 0;
          document.getElementById("adicoes").innerHTML = "";

          location.reload();
        } else {
          erros(response.status);
        }
      });
    }
  }
}

function abrirEdicao(valor) {

  //fetch de assunto
  fetch(servidor + 'read/assunto', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 200 || response.status == 201) {
      response.json().then(function (json) {

        //reseta para usar denovo
        idAssunto = 0;
        document.getElementById("adicoes").innerHTML = "";

        document.getElementById("titulo").value = listaUacom[valor]["titulo"];
        document.getElementById("relato").value = listaUacom[valor]["relato"];

        let x = "";
        for (let i = 0; i < json.length; i++) {
          x += "<option value='" + json[i].cod_assunto + "'>" + json[i].descricao + "</option>";

          //para remoção de itens
          valorRemovido[i] = 0;
        }

        document.getElementById("assunto").innerHTML = x;

        document.getElementById("botaoUacom").innerHTML = "<a><button class='btn btn-primary multi-button ml-auto js-btn-next' onclick='editarUacom(" + valor + ")' type='button'>Editar</button></a>";

        PegarAssuntos2(valor);
      });
    } else {
      erros(response.status);
    }
  });

}

function PegarAssuntos2(valor) {
  //fetch de assunto

  //preenche os assuntos na parte de edição
  fetch(servidor + 'read/uacomassunto/' + meuCodigo + "/" + meuData[valor], {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 200 || response.status == 201) {
      response.json().then(function (json) {

        for (let i = 0; i < json.length; i++) {
          document.querySelector("#assunto").selectedIndex = (json[i].cod_assunto - 1);
          anotaAssunto();
        }

        listaEdicaoAssunto = json;

      });
    } else {
      erros(response.status);
    }
  });
}

function editarUacom(valor) {
  //retira fuso horário; preciso fazer ser um sistema automático ou usar "if != +" com procura 
  let retiraFuso =  meuData[valor].split("-");
  let dataUsada = retiraFuso[0] + "-" + retiraFuso[1] + "-" + retiraFuso[2];

  let edicaoUacom = {
    "cod_ibge": parseInt(meuCodigo),
    "data": dataUsada,
    "titulo": document.getElementById("titulo").value,
    "relato": document.getElementById("relato").value,
  };

  //transforma as informações do token em json
  let corpo = JSON.stringify(edicaoUacom);
  
  console.log(corpo);
  fetch(servidor + 'read/uacom/' + meuCodigo + '/' + dataUsada, {
    method: 'PUT',
    body: corpo,
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {
    //checar o status do pedido
    console.log(response.statusText);

    //tratamento dos erros
    if (response.status == 200 || response.status == 201) {

      //pegar a data para enviar no editarUacom2
      response.json().then(function (json) {
        editarUacom2(valor);
      });

    } else {
      erros(response.status);
    }
  });

}

function editarUacom2(valor) {
  //retira fuso horário; preciso fazer ser um sistema automático
  let retiraFuso =  meuData[valor].split("-");
  let dataUsada = retiraFuso[0] + "-" + retiraFuso[1] + "-" + retiraFuso[2];

  for (let i = 0; i < idAssunto; i++) {

    //para checar se precisa adicionar
    if (document.getElementById("adicao" + i) != undefined) {

      //caso ainda não esteja lá
      if (listaEdicaoAssunto[i] == undefined) {
        let infoAssunto = {
          "cod_ibge": parseInt(meuCodigo),
          "data": dataUsada,
          "cod_assunto": parseInt(document.getElementById("adicao" + i).value),
        };

        //transforma as informações em string para mandar
        let corpo = JSON.stringify(infoAssunto);
        //console.log(corpo);

        //função fetch para mandar
        fetch(servidor + 'read/uacomassunto', {
          method: 'POST',
          body: corpo,
          headers: {
            'Authorization': 'Bearer ' + meuToken
          },
        }).then(function (response) {

          //tratamento dos erros
          if (response.status == 200 || response.status == 201) {
            //console.log(response.statusText);
          } else {
            erros(response.status);
          }
        });
      }

    }

    //para checar se precisa deletar
    else {

      //caso não tivesse antes
      if (valorRemovido[i] != null) {
        //console.log(valorRemovido[i]);
        //função fetch para deletar
        fetch(servidor + 'read/uacomassunto/' + meuCodigo + "/" + dataUsada + "/" + valorRemovido[i], {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer ' + meuToken
          },
        }).then(function (response) {

          //tratamento dos erros
          if (response.status == 200 || response.status == 201 || response.status == 204) {
            //console.log(response.statusText);
          } else {
            erros(response.status);
          }
        });
      }

    }

  }

  esperar(2000);
  location.reload();
}

function esperar(tempo) {
  const comeco = Date.now();
  let fim = null;
  do {
    fim = Date.now();
  } while (fim - comeco < tempo);
}







//Processo
let listaProcesso = [];
function processo() {

  //cria o botão para editar
  document.getElementById("editar").innerHTML = (`<button class="btn btn-success" data-toggle="modal" data-target="#adicionarProcesso" onclick="criarProcesso()">Novo Processo</button>`);
  document.getElementById("editar2").innerHTML = "";

  //função fetch para chamar itens da tabela
  fetch(servidor + 'read/processo', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //checar os status de pedidos
    //console.log(response)

    //tratamento dos erros
    if (response.status == 200) {
      //console.log(response.statusText);

      //pegar o json que possui a tabela
      response.json().then(function (json) {

        //console.log(json);

        listaProcesso = json;

        let tabela = (`<thead style="background: #4b5366; color:white; font-size:15px">
        <tr>
        <th style="width:30%" scope="col">Processo</th>
        <th style="width:60%" scope="col">Descrição</th>
        <th style="width:5%" scope="col">Editar</th>
        <th style="width:5%" scope="col">Excluir</th>
        </tr>
        </thead>`);
        tabela += (`<tbody>`);

        for (i = 0; i < listaProcesso.length; i++) {

          tabela += (`<tr>`);
          tabela += (`<td>`);
          tabela += listaProcesso[i]["cod_processo"];
          tabela += (`</td><td>`);
          tabela += listaProcesso[i]["descricao"];
          tabela += (`<td>
                  <span class="d-flex">
                  <button onclick="editarProcesso(` + i + `)" class="btn btn-success" data-toggle="modal" data-target="#adicionarProcesso">
                  <i class="material-icons"data-toggle="tooltip" title="Edit">&#xE254;</i>
                  </button>
                  </span></td>`);
          tabela += (`<td>
                  <span class="d-flex">
                  <button onclick="excluirProcesso(` + i + `)" class="btn btn-success">
                  <img src="img/delete-icon.png" width="30px">
                  </button>
                  </span></td>`);
          tabela += (`</tr>`);
        }

        tabela += (`</tbody>`);
        document.getElementById("tabela").innerHTML = tabela;

        //Máscara colocada separadamente para tabela
        mascara();

      });
    } else {
      erros(response.status);
    }
  });
}

function criarProcesso(){
  document.getElementById("cod_processo").value = "";
  document.getElementById("cod_processo").disabled = false;
  document.getElementById("descricao").value = "";
  document.getElementById("botaoProcesso").innerHTML = " <button class='btn btn-primary' onclick='novoProcesso()' type='button'>Cadastrar</button>";
}

function novoProcesso(){
  let infoProcesso = {
    "cod_ibge": parseInt(meuCodigo),
    "cod_processo": document.getElementById("cod_processo").value,
    "descricao": document.getElementById("descricao").value,
  };

  //transforma as informações em string para mandar
  let corpo = JSON.stringify(infoProcesso);
  //console.log(corpo);

  //função fetch para mandar
  fetch(servidor + 'read/processo', {
    method: 'POST',
    body: corpo,
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 200 || response.status == 201) {
      //alert('Processo inserido com sucesso!');
      location.reload();
    } else {
      erros(response.status);
    }
  });
}

function editarProcesso(valor){
  document.getElementById("cod_processo").value = listaProcesso[valor].cod_processo;
  document.getElementById("cod_processo").disabled = true;
  document.getElementById("descricao").value = listaProcesso[valor].descricao;
  document.getElementById("botaoProcesso").innerHTML = "<button class='btn btn-primary' onclick='edicaoProcesso()' type='button'>Editar</button>";
}

function edicaoProcesso(){
  let edicaoProcesso = {
    "cod_ibge": parseInt(meuCodigo),
    "cod_processo": document.getElementById("cod_processo").value,
    "descricao": document.getElementById("descricao").value,
  };

  //transforma as informações do token em json
  let corpo = JSON.stringify(edicaoProcesso);
  
  //console.log(corpo);
  fetch(servidor + 'read/processo/' + document.getElementById("cod_processo").value + '/' + meuCodigo, {
    method: 'PUT',
    body: corpo,
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {
    //checar o status do pedido
    console.log(response.statusText);

    //tratamento dos erros
    if (response.status == 200 || response.status == 201) {
      location.reload();
    } else {
      erros(response.status);
    }
  });
}

function excluirProcesso(valorModulo){
  console.log("chega aqui");
  //será ajustado para funcionar com varios valores
  let info = [];
  info[0] = {
    "cod_ibge": parseInt(meuCodigo),
    "cod_processo": listaProcesso[valorModulo].cod_processo,
    "descricao": listaProcesso[valorModulo].descricao,
  }

  //transforma as informações do token em json
  let corpo = JSON.stringify(info);
  //console.log(corpo);
  
  //função fetch para deletar
  fetch(servidor + 'read/processo/' + listaProcesso[valorModulo].cod_processo + '/' + meuCodigo, {
    method: 'DELETE',
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
    // return response.json().then(function (json) {
    //   console.log(json);
    // });
  });
}







//Contatos

function contatosCD() {

  //cria o botão para editar
  document.getElementById("editar").innerHTML = (`<button class="btn btn-success" data-toggle="modal" data-target="#adicionarContato">Novo Contato</button>`);

  //função fetch para chamar contatos da tabela
  fetch(servidor + 'read/contato/' + meuCodigo + '/0', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //checar os status de pedidos
    //console.log(response)

    //tratamento dos erros
    if (response.status == 200) {
      //console.log(response.statusText);

      //pegar o json que possui a tabela
      response.json().then(function (json) {

        //console.log(json);

        let tabela = (`<thead style="background: #4b5366; color:white; font-size:15px">
        <tr>
        <th style="width:20%" scope="col">Nome</th>
        <th style="width:20%" scope="col">Função</th>
        <th style="width:20%" scope="col">E-mail</th>
        <th style="width:10%" scope="col">Telefones</th>
        <th style="width:10%" scope="col">Tipo</th>
        <th style="width:30%" scope="col">Opções</th>
        </tr>
        </thead>`);
        tabela += (`<tbody>`);

        // console.log(json)

        //cria uma lista apenas com os itens do lote selecionado
        let j = 0;
        for (let i = 0; i < json.length; i++) {
          if (json[i]["cod_ibge"] == meuCodigo) {
            listaItem[j] = json[i];
            j++;
          }
        }
        for (i = 0; i < listaItem.length; i++) {

          //salva os valores para edição
          meuItem[i] = listaItem[i]["cod_item"];
          meuTipo[i] = listaItem[i]["cod_tipo_item"];

          tabela += (`<tr>`);
          tabela += (`<td>`);
          tabela += (`<span id="nome style="white-space: pre-line">` + listaItem[i]["nome"] + `</span>`);
          tabela += (`</td> <td>`);
          tabela += (`<span id="funcao style="white-space: pre-line">` + listaItem[i]["funcao"] + `</span>`);
          tabela += (`</td> <td>`);
          tabela += (`<span id="email style="white-space: pre-line">` + listaItem[i]["email"] + `</span>`);
          tabela += (`</td> <td>`);
          tabela += (`<span class="" id="telefone" style="white-space: pre-line">` + listaItem[i].telefone + `</span>`);
          tabela += (`</td> <td>`);
          tabela += (`<span class="" id="tipo" style="white-space: pre-line">` + listaItem[i].tipo + `</span>`);
          tabela += (`</td><td> 
          <span class="d-flex">
            <button onclick="visualizarContato(` + listaItem[i].cod_contato + `,'` + listaItem[i].nome + `','` + listaItem[i].funcao + `','` + listaItem[i].email + `','` + i + `')" data-toggle="modal" href="#visualizar" class="btn btn-success">
              <i class="material-icons"data-toggle="tooltip" title="Visualizar">content_paste</i>
            </button>
            <button onclick="apagarContatoTelefone(` + listaItem[i].cod_contato + `)" class="btn btn-danger">
              <i class="material-icons"data-toggle="tooltip" title="Apagar">delete</i>
            </button>
          </span>
          </td>`);
          tabela += (`</tr>`);
          // console.log(tabela)
        }
        tabela += (`</tbody>`);
        document.getElementById("tabela").innerHTML = tabela;

        //Máscara colocada separadamente para tabela
        mascara();

      });
    } else {
      erros(response.status);
    }
  });
}

let id= 0
let codigoTelefone = '';
function visualizarContato(cod_contato,nome,funcao,email,identificador) {
  identificador= parseInt(identificador)
  
  fetch(servidor + 'read/telefone/' + cod_contato, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //checar os status de pedidos
    //console.log(response)

    //tratamento dos erros
    if (response.status == 200) {
      //console.log(response.statusText);

      //pegar o json que possui a tabela
      response.json().then(function (json) {

        // console.log(json)
        let tabela = (`<thead style="background: #4b5366; color:white; font-size:15px">
          <tr>
            <th style="width:20%" scope="col">Nome</th>
            <th style="width:20%" scope="col">Função</th>
            <th style="width:20%" scope="col">E-mail</th>
            <th style="width:30%" scope="col" rowspan="`+ json.length +`">Telefone</th>
            <th style="width:9%" scope="col">Ação</th>
          </tr>
          </thead>
        <tbody>
          <tr>`);
        tabela += (`<td><input value="` + nome + `" id="nome`+identificador+`" type="text" class="nome"></td>`);
        tabela += (`<td><input value="` + funcao + `" id="funcao`+identificador+`" type="text" class="funcao"></td>`);
        tabela += (`<td><input value="` + email + `" id="email`+identificador+`" type="text" class="email"></td>`);
        tabela += (`<td><div id="maisLittleInput">`);

        if(json.length == 0){
          tabela += (`<input value="" id="telefoneNew0" type="text" class="telefone" size="14">`);
            tabela += (`&nbsp&nbsp&nbsp&nbsp
            <select name="tipo" id="tipoNew0">
              <option value=""> Tipo</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Casa">Casa</option>
              <option value="Celular">Celular</option>
              <option value="Trabalho">Trabalho</option>
            </select>
            <br/>
            <br/>
            `);
        }else{
          for (i = 0; i < json.length; i++) {
            // console.log(json)
            if(json.length !=0){
              id = i +1;
            }
            tabela += (`<input value="` + json[i].telefone + `" id="telefone`+ parseInt(1+i) +`" type="text" class="telefone" size="14">`);
            tabela += (`&nbsp&nbsp&nbsp
            <select name="tipo" id="tipo`+ parseInt(1+i) +`">
              <option value="`+json[i].tipo+`">`+json[i].tipo+`</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Casa">Casa</option>
              <option value="Celular">Celular</option>
              <option value="Trabalho">Trabalho</option>
            </select>
            <button id="butaoDelet`+ parseInt(1+i) +`" onclick="apagarTelefone(`+ json[i].cod_telefone+`);lessInput(${id});" class="btn danger">
              <i class="material-icons"data-toggle="tooltip" title="Apagar Telefone">delete</i>
            </button>
            `);
          }
        }
        
        
        // console.log(id)
        tabela += (`</div>
        <siders/>
        </td>`);
        tabela += (`</td>
        <td> 
          <span class="d-flex">
            <button onclick="editarContato(`+ identificador +`,`+cod_contato+`);editarTelefone(`+ identificador +`,`+cod_contato+`);novoTelefone(`+cod_contato+`,${pass=true});" data-toggle="modal" href="#visualizar" class="btn ">
              <i class="material-icons"data-toggle="tooltip" title="Salvar">&#xE254;</i>
            </button>
          </span> 
          <span class="d-flex">
            &nbsp&nbsp&nbsp<a class="js-btn-next" type="reset" id="clicaInput" onclick="litteInput(${true});" title="Adicionar"><img  src="img/add-icon.png" width="25px"></a>
          </span> 
        </td>`);
        tabela += (`</tr></tbody>`);
        // console.log(tabela)

        
        document.getElementById("visualiza").innerHTML = tabela;
        mascara();
      });
    } else {
      erros(response.status);
    }
  });
  // document.getElementById("tabela").innerHTML = tabela;
}

contador=0
function litteInput(passe){
  // console.log(passe)
  if(passe == true){
    $(document).ready(function(){
      mascara();
      $("siders").append(`
      <div id="pequenoInput${contador}">
        <input value="" id="telefoneNew`+ contador +`" type="text" class="telefone" size="14">
        &nbsp&nbsp&nbsp
        <select name="tipo" id="tipoNew`+ contador +`">
          <option value="">Tipo</option>
          <option value="WhatsApp">WhatsApp</option>
          <option value="Casa">Casa</option>
          <option value="Celular">Celular</option>
          <option value="Trabalho">Trabalho</option>
        </select>
      </div>
      <br>
      `)
      
    });
    console.log(contador)
    contador = contador + 1;
  }
  return contador;
}

function lessInput(identifier){
  document.getElementById('maisLittleInput').removeChild(document.getElementById('telefone'+identifier));
  document.getElementById('maisLittleInput').removeChild(document.getElementById('tipo'+identifier));
  document.getElementById('maisLittleInput').removeChild(document.getElementById('butaoDelet'+identifier));
}

function editarTelefone(id, cod_contato) {

  fetch(servidor + 'read/telefone/' + cod_contato, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //checar os status de pedidos
    //console.log(response)

    //tratamento dos erros
    if (response.status == 200) {
      //console.log(response.statusText);

      //pegar o json que possui a tabela
      response.json().then(function (json) {

        litteInput(false)

        for (let i = 0; i < json.length; i++) {


          // console.log(document.getElementById("telefone2").value)
          edicaoItem[i] = {
            "telefone": document.getElementById("telefone" + parseInt(1 + i)).value,
            "tipo": document.getElementById("tipo" + parseInt(1 + i)).value,
          };


          console.log(edicaoItem[i])
          if (edicaoItem[i]["telefone"] != listaItem[i]["telefone"] || edicaoItem[i]["tipo"] != listaItem[i]["tipo"]) {
            //transforma as informações do token em json
            let corpo = JSON.stringify(edicaoItem[i]);
            //função fetch para mandar
            fetch(servidor + 'read/telefone/' + json[i].cod_telefone, {
              method: 'PUT',
              body: corpo,
              headers: {
                'Authorization': 'Bearer ' + meuToken
              },
            }).then(function (response) {
              //checar o status do pedido
              console.log(response.statusText);

              //tratamento dos erros
              if (response.status == 200 || response.status == 201) {
                setTimeout(function(){
                  location.reload()
                }, 2000);
              } else {
                erros(response.status);
              }
              // window.location.replace("./gerenciaCd.html");
            });
          }
        }
      });


    } else {
      erros(response.status);
    }
  });
}

function editarContato(id, cod_contato) {


  edicaoItem = {
    "nome": document.getElementById("nome" + id).value,
    "email": document.getElementById("email" + id).value,
    "funcao": document.getElementById("funcao" + id).value,
  };

  //console.log(edicaoItem)
  if (edicaoItem["nome"] != listaItem["nome"] || edicaoItem["email"] != listaItem["email"] || edicaoItem["funcao"] != listaItem["funcao"]) {
    //transforma as informações do token em json
    let corpo = JSON.stringify(edicaoItem);
    //função fetch para mandar
    fetch(servidor + 'read/contato/' + cod_contato, {
      method: 'PUT',
      body: corpo,
      headers: {
        'Authorization': 'Bearer ' + meuToken
      },
    }).then(function (response) {
      //checar o status do pedido
      console.log(response.statusText);

      //tratamento dos erros
      if (response.status == 200 || response.status == 201) {
        // location.reload();
      } else {
        erros(response.status);
      }
      // window.location.replace("./gerenciaCd.html");
    });
  }

}

function novoContato() {

  let infoContato = {
    "cod_ibge": parseInt(meuCodigo),
    "nome": document.getElementById("nome").value,
    "email": document.getElementById("email").value,
    "funcao": document.getElementById("funcao").value,
  };

  console.log(infoContato)
  //transforma as informações em string para mandar
  let corpo = JSON.stringify(infoContato);
  //função fetch para mandar
  fetch(servidor + 'read/contato', {
    method: 'POST',
    body: corpo,
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 200 || response.status == 201) {
      alert('Contato inserido com sucesso!')
      // location.reload();
    } else {
      erros(response.status);
    }
  });
}

function novoTelefone(cod_contato, pass) {

  let meuContato;
  let infoTelefone = [];

  //Pega o numero de inputs do modal de adicionar
  maisInput(false);
  //pega o numero de inputs do modal de editar
  litteInput(false);

  fetch(servidor + 'read/contato/' + meuCodigo + '/0', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {
    
    //tratamento dos erros
    if (response.status == 200 || response.status == 201) {
      response.json().then(function (json) {
        
        //Pega o ultimo contato salvo
        for (let i = 0; i < json.length; i++) {
          meuContato= json[i].cod_contato;
        }
        let tel0 = document.getElementById("telefoneNew0")
        
        if(pass== true && (tel0 != null) ){
          for (let i = 0; i <= contador; i++) {
            infoTelefone[i] = {
              "cod_contato": parseInt(cod_contato),
              "telefone": document.getElementById("telefoneNew"+parseInt(i)).value,
              "tipo": document.getElementById("tipoNew"+parseInt(i)).value,
            };
          
            if(infoTelefone[i].cod_contato != null && infoTelefone[i].telefone != null && infoTelefone[i].tipo != null){
              //transforma as informações em string para mandar
              let corpo = JSON.stringify(infoTelefone[i]);
              console.log(infoTelefone[i]);
              //função fetch para mandar
              fetch(servidor + 'read/telefone', {
                method: 'POST',
                body: corpo,
                headers: {
                  'Authorization': 'Bearer ' + meuToken
                },
              }).then(function (response) {
    
                //tratamento dos erros
                if (response.status == 200 || response.status == 201) {
                  // alert('O telefone: '+ infoTelefone[i].telefone +' do tipo: '+ infoTelefone[i].tipo +' cadastrado com sucesso!');
                } else {
                  erros(response.status);
                }
              });
            }
          }
        }
        else if(pass== true && contador>0 && tel0 == null){
          for (let i = 1; i <= contador; i++) {
            infoTelefone[i] = {
              "cod_contato": parseInt(cod_contato),
              "telefone": document.getElementById("telefoneNew"+parseInt(i)).value,
              "tipo": document.getElementById("tipoNew"+parseInt(i)).value,
            };
          
            if(infoTelefone[i].cod_contato != null && infoTelefone[i].telefone != null && infoTelefone[i].tipo != null){
              //transforma as informações em string para mandar
              let corpo = JSON.stringify(infoTelefone[i]);
              console.log(infoTelefone[i]);
              //função fetch para mandar
              fetch(servidor + 'read/telefone', {
                method: 'POST',
                body: corpo,
                headers: {
                  'Authorization': 'Bearer ' + meuToken
                },
              }).then(function (response) {
    
                //tratamento dos erros
                if (response.status == 200 || response.status == 201) {
                  // alert('O telefone: '+ infoTelefone[i].telefone +' do tipo: '+ infoTelefone[i].tipo +' cadastrado com sucesso!');
                } else {
                  erros(response.status);
                }
              });
            }
          }
        }
        else{

          for (let i = 0; i < indice+1; i++) {
            infoTelefone[i] = {
              "cod_contato": parseInt(meuContato),
              "telefone": document.getElementById("telefone"+i).value,
              "tipo": document.getElementById("tipo"+i).value,
            };
          
            if(infoTelefone[i].cod_contato != null && infoTelefone[i].telefone != null && infoTelefone[i].tipo != null){
              //transforma as informações em string para mandar
              let corpo = JSON.stringify(infoTelefone[i]);
              console.log(infoTelefone[i]);
              //função fetch para mandar
              fetch(servidor + 'read/telefone', {
                method: 'POST',
                body: corpo,
                headers: {
                  'Authorization': 'Bearer ' + meuToken
                },
              }).then(function (response) {
    
                //tratamento dos erros
                if (response.status == 200 || response.status == 201) {
                  // alert('O telefone: '+ infoTelefone[i].telefone +' do tipo: '+ infoTelefone[i].tipo +' cadastrado com sucesso!');
                } else {
                  erros(response.status);
                }
              });
            }
          }
        }
        if(pass != true){
          alert('O(s) telefone(s) foi(ram) cadastrado(s) com sucesso!');
          location.reload();
        }else{
          setTimeout(function(){
            location.reload()
          }, 3000);
        }
      });
    } else {
      erros(response.status);
    }
  });
}

let indice = 0;
function maisInput(passe){
  if(passe == true && indice < 3){
    indice = indice + 1;
    $(document).ready(function(){
      mascara();
      $("side").append('<div id="telTipo'+indice+'" class="form-row mt-4">'+
                          '<div class="col-12 col-sm-6">'+
                            '<input class="multisteps-form__input form-control telefone" type="text" placeholder="Telefone" id="telefone'+indice+'" name="telefone"/>'+
                          '</div>'+
                          '<div class="col-12 col-sm-6">'+
                            '<select class="multisteps-form__input form-control" name="tipo" id="tipo'+ indice +'">'+
                              '<option value="">Tipo</option>'+
                              '<option value="WhatsApp">WhatsApp</option>'+
                              '<option value="Casa">Casa</option>'+
                              '<option value="Celular">Celular</option>'+
                              '<option value="Trabalho">Trabalho</option>'+
                            '</select>'+
                          '</div>'+
                        '</div>')
    });
    // console.log(indice)
  }
  return indice;
}

function menosInput(){
  if(indice>0){
    document.getElementById('maisTelefone').removeChild(document.getElementById('telTipo'+indice));
  }
  indice = indice -1;
  // console.log(indice)
  return indice
}

function apagarContatoTelefone(cod_contato) {

  fetch(servidor + 'read/telefone/' + cod_contato, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //checar os status de pedidos
    //console.log(response)

    //tratamento dos erros
    if (response.status == 200) {
      //console.log(response.statusText);

      //pegar o json que possui a tabela
      response.json().then(function (json) {
        console.log(json)

        if (json.length != 0) {

          Swal.fire({
            title: 'Tem certeza?',
            text: "Que deseja excluir todos os telefones?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, tenho certeza!'
          }).then((result) => {

            if (result.value) {

              Swal.fire(
                'Sucesso!',
                'Os telefones foram excluidos com sucesso!',
                'success'
              )

              for (i = 0; i < json.length; i++) {
                fetch(servidor + 'read/telefone/' + json[i].cod_telefone, {
                  method: 'DELETE',
                  headers: {
                    'Authorization': 'Bearer ' + meuToken
                  },
                }).then(function (response) {
                  console.log('telefone deletado com sucesso!')
                });
              }

              Swal.fire({
                title: 'Tem certeza?',
                text: "Que deseja excluir este Contato?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sim, tenho certeza!'
              }).then((result) => {

                if (result.value) {

                  Swal.fire(
                    'Sucesso!',
                    'O Contato foi excluido com sucesso!',
                    'success'
                  )

                  fetch(servidor + 'read/contato/' + cod_contato, {
                    method: 'DELETE',
                    headers: {
                      'Authorization': 'Bearer ' + meuToken
                    },
                  }).then(function (response) {

                    console.log('Contato deletado com sucesso!')
                  });

                  setTimeout(function () {
                    location.reload()
                  }, 2000);

                } else {

                  location.reload();

                }
              });

            }
          });
        } else {
          Swal.fire({
            title: 'Tem certeza?',
            text: "Que deseja excluir este Contato?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, tenho certeza!'
          }).then((result) => {

            if (result.value) {

              Swal.fire(
                'Sucesso!',
                'O Contato foi excluido com sucesso!',
                'success'
              )
              fetch(servidor + 'read/contato/' + cod_contato, {
                method: 'DELETE',
                headers: {
                  'Authorization': 'Bearer ' + meuToken
                },
              }).then(function (response) {

                console.log('Contato deletado com sucesso!')
              });

              setTimeout(function () {
                location.reload()
              }, 2000);

            }
          });
        }
      })
    }
  });
}

function apagarTelefone(cod_telefone) {

  fetch(servidor + 'read/telefone/' + cod_telefone, {
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {
    //checar os status de pedidos
    console.log(response)

    //tratamento dos erros
    if (response.status == 204) {
      //console.log(response.statusText);
      alert('Telefone deletado com sucesso!')
    }
  });
}


//Ponto
function ponto() {

  //cria o botão para editar
  document.getElementById("editar").innerHTML = (`<button class="btn btn-success" data-toggle="modal" data-target="#adicionarPonto">Novo Ponto</button>`);
  document.getElementById("botaoPonto").innerHTML = " <button class='btn btn-primary' onclick='novoPidPonto()' type='button'>Cadastrar</button>";
  //função fetch para chamar contatos da tabela
  fetch(servidor + 'read/ponto/'+meuCodigo, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //checar os status de pedidos
    //console.log(response)

    //tratamento dos erros
    if (response.status == 200) {
      //console.log(response.statusText);

      //pegar o json que possui a tabela
      response.json().then(function (json) {

        //console.log(json);

        let tabela = (`<thead style="background: #4b5366; color:white; font-size:15px">
        <tr>
        <th style="width:20%" scope="col">Código de Ponto</th>
        <th style="width:20%" scope="col">Nome</th>
        <th style="width:20%" scope="col">Categoria</th>
        <th style="width:20%" scope="col">INEP</th>
        <th style="width:10%" scope="col">CEP</th>
        <th style="width:10%" scope="col">Bairro</th>
        <th style="width:30%" scope="col">Endereço</th>
        <th style="width:30%" scope="col">Número</th>
        <th style="width:30%" scope="col">Latitude</th>
        <th style="width:30%" scope="col">Longitude</th>
        <th style="width:30%" scope="col">Opções</th>
        </tr>
        </thead>`);
        tabela += (`<tbody>`);

        console.log(json)
        
        //cria uma lista apenas com os itens do lote selecionado
        let j = 0;
        for (let i = 0; i < json.length; i++) {
          if (json[i]["cod_ibge"] == meuCodigo) {
            listaItem[j] = json[i];
            j++;
          }
        }
        for (i = 0; i < listaItem.length; i++) {

          tabela += (`<tr>`);
          tabela += (`<td>`);

          tabela += (`<span id="cod_ponto" style="white-space: pre-line">` + listaItem[i]["cod_ponto"] + `</span>`);
          tabela += (`</td> <td>`);
          tabela += (`<span id="nome" style="white-space: pre-line">` + listaItem[i]["nome"] + `</span>`);
          tabela += (`</td> <td>`);
          tabela += (`<span id="email" style="white-space: pre-line">` + listaItem[i]["descricao"] + `</span>`);
          tabela += (`</td> <td>`);
          tabela += (`<span id="inep" style="white-space: pre-line">` + listaItem[i]["inep"] + `</span>`);
          tabela += (`</td> <td>`);
          tabela += (`<span class="" id="cep" style="white-space: pre-line">` + listaItem[i]["cep"] + `</span>`);
          tabela += (`</td> <td>`);
          tabela += (`<span class="" id="bairro" style="white-space: pre-line">` + listaItem[i]["bairro"] + `</span>`);
          tabela += (`</td> <td>`);
          tabela += (`<span class="" id="endereco" style="white-space: pre-line">` + listaItem[i]["endereco"] + `</span>`);
          tabela += (`</td> <td>`);
          tabela += (`<span class="" id="numero" style="white-space: pre-line">` + listaItem[i]["numero"] + `</span>`);
          tabela += (`</td> <td>`);
          tabela += (`<span class="" id="latitude" style="white-space: pre-line">` + listaItem[i]["latitude"] + `</span>`);
          tabela += (`</td> <td>`);
          tabela += (`<span class="" id="longitude" style="white-space: pre-line">` + listaItem[i]["longitude"] + `</span>`);
          tabela += (`</td> 
          <td>
            <span class="d-flex">
              <button onclick="edicaoPonto( ${listaItem[i].cod_ponto}, ${listaItem[i].cod_categoria} )" class="btn btn-success" data-toggle="modal" data-target="#adicionarPonto">
                <i class="material-icons"data-toggle="tooltip" title="Edit">&#xE254;</i>
              </button>
              <button onclick="apagarPidPonto( ${listaItem[i].cod_ponto}, ${listaItem[i].cod_categoria},  ${listaItem[i].cod_pid} )" class="btn btn-danger">
                <i class="material-icons"data-toggle="tooltip" title="Apagar">delete</i>
              </button>
            </span>
          </td>`);
          tabela += (`</tr>`);
          // console.log(tabela)
        }
        tabela += (`</tbody>`);
        document.getElementById("tabela").innerHTML = tabela;

        //Máscara colocada separadamente para tabela
        mascara();

        //Carrega o select de Categoria
        puxaCategoria();
      });
    } else {
      erros(response.status);
    }
  });
}

function puxaCategoria(codigo, descricao) {
  
  fetch(servidor + 'read/categoria', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 200) {
      response.json().then(function (json) {

        //variaveis
        let valor= [];

        //Primeiro option do select de "Categoria"

        if(codigo == null && descricao == null){
          valor[0] += "<option value=''>Categoria</option>";
        }else{
          valor[0] += `<option value='${codigo}'>${descricao}</option>`;
          $('#categoria').css('pointer-events','none');
          $('#categoria').css('background-color','#e9ecef');

        }

        for (i = 0; i < json.length; i++) {
          valor[i+1] += `<option value=${json[i].cod_categoria} > ${json[i].descricao} </option>`;
        }
        
        document.getElementById("categoria").innerHTML = valor;
      });
    } else {
      erros(response.status);
    }
  });
}

function novoPidPonto() {

  let ultimoPid

  let infoPid = {
    "cod_ibge": parseInt(meuCodigo),
    "nome": document.getElementById("nomePonto").value,
    "inep": document.getElementById("inepPonto").value,
  };
  
  //verifica se algum dos campos está inserido errado
  if(document.getElementById("lat") || document.getElementById("lon") || document.getElementById("grauLat")?.textContent || document.getElementById("grauLong")?.textContent){
    alert("Campo com valor inválido!")
  }else{
  
    console.log(infoPid)
    //transforma as informações em string para mandar
    let corpo1 = JSON.stringify(infoPid);
    //função fetch para mandar
    fetch(servidor + 'read/pid', {
      method: 'POST',
      body: corpo1,
      headers: {
        'Authorization': 'Bearer ' + meuToken
      },
    }).then(function (response) {
  
      //tratamento dos erros
      if (response.status == 200 || response.status == 201) {
        console.log('Pid inserido com sucesso!')
        
        setTimeout(function () {
        
          //função fetch para buscar o ultimo pid instalado
          fetch(servidor + 'read/pid', {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer ' + meuToken
            },
          }).then(function (response) {
    
            if (response.status == 200) {
    
              //pegar o json que possui a tabela
              response.json().then(function (json) {
    
                //ultimo cod_pid
                for (i = 0; i < json.length; i++) {
                  ultimoPid = json[i].cod_pid;
                }
                console.log(ultimoPid)
                
                let infoPonto
  
                if(document.getElementById('decimal')?.id == "decimal"){
                  infoPonto = {
                    "cod_ponto": parseInt(document.getElementById("cod_pontoPonto").value),
                    "cod_categoria": parseInt(document.getElementById("categoria").value),
                    "cod_ibge": parseInt(meuCodigo),
                    "cod_pid": parseInt(ultimoPid),
                    "endereco": document.getElementById("enderecoPonto").value,
                    "numero": document.getElementById("numeroPonto").value,
                    "complemento": document.getElementById("complementoPonto").value,
                    "bairro": document.getElementById("bairroPonto").value,
                    "cep": document.getElementById("cepPonto").value,
                    "latitude": parseFloat(document.getElementById("latitudePonto").value),
                    "longitude": parseFloat(document.getElementById("longitudePonto").value),
                  }
                } else if(document.getElementById('grau').id == "grau"){
  
                  //Pega os valores dos campos de graus e transforma em decimal
                  grauToDecimal();
                  
                  infoPonto = {
                    "cod_ponto": parseInt(document.getElementById("cod_pontoPonto").value),
                    "cod_categoria": parseInt(document.getElementById("categoria").value),
                    "cod_ibge": parseInt(meuCodigo),
                    "cod_pid": parseInt(ultimoPid),
                    "endereco": document.getElementById("enderecoPonto").value,
                    "numero": document.getElementById("numeroPonto").value,
                    "complemento": document.getElementById("complementoPonto").value,
                    "bairro": document.getElementById("bairroPonto").value,
                    "cep": document.getElementById("cepPonto").value,
                    "latitude": laatitude,
                    "longitude": loongitude
                  }
                }
                console.log(infoPonto)
                //transforma as informações em string para mandar
                let corpo2 = JSON.stringify(infoPonto);
                //função fetch para mandar
                fetch(servidor + 'read/ponto', {
                  method: 'POST',
                  body: corpo2,
                  headers: {
                    'Authorization': 'Bearer ' + meuToken
                  },
                }).then(function (response) {
              
                  //tratamento dos erros
                  if (response.status == 200 || response.status == 201) {
                    alert('Ponto inserido com sucesso!')
                    setTimeout(function () {
                      location.reload()
                    }, 2000);
                  } else {
                    erros(response.status);
                  }
                });
    
              });
            } else {
              erros(response.status);
            }
          });
        }, 1000);
      } else {
        erros(response.status);
      }
    });
  }
}

function apagarPidPonto(cod_ponto, cod_categoria, cod_pid) {

  Swal.fire({
    title: 'Tem certeza?',
    text: "Que deseja excluir o Ponto?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sim, tenho certeza!'
  }).then((result) => {

    if (result.value) {

      Swal.fire(
        'Sucesso!',
        'O Ponto foi excluido com sucesso!',
        'success'
      )
        
        
      fetch(servidor + `read/ponto/${cod_ponto}/${cod_categoria}/${meuCodigo}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + meuToken
        },
      }).then(function (response) {
        console.log('ponto deletado com sucesso!')

        setTimeout(function () {

          fetch(servidor + 'read/pid/' + cod_pid, {
            method: 'DELETE',
            headers: {
              'Authorization': 'Bearer ' + meuToken
            },
          }).then(function (response) {
    
            console.log('Pid deletado com sucesso!')
          });
    
          setTimeout(function () {
            location.reload()
          }, 1000);

        }, 2000);
      });
      
    }
  });
}

function viaCep(){

  fetch(`http://viacep.com.br/ws/${document.getElementById("cepPonto").value}/json/`, {
    method: 'GET',
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 200 || response.status == 201) {
      response.json().then(function (json) {
        console.log(json)
        document.getElementById("enderecoPonto").value = json.logradouro;
        document.getElementById("bairroPonto").value = json.bairro;
        document.getElementById("complementoPonto").value = json.complemento;
      });
    } else {
      erros(response.status);
    }
  });

}

//puxa a aba de edição, colocando todos os dados
function edicaoPonto(ponto, categoria) {
  
  //fetch de ponto
  fetch(servidor + `read/ponto/${ponto}/${categoria}/${meuCodigo}`, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 200 || response.status == 201) {
      response.json().then(function (json) {

        // console.log(json)
        //reseta para usar denovo
        idPonto = 0;

        document.getElementById("cod_pontoPonto").value = json.cod_ponto;
        document.getElementById("cod_pontoPonto").readOnly = true;

        document.getElementById("cepPonto").value = json.cep;
        document.getElementById("enderecoPonto").value = json.endereco;
        document.getElementById("bairroPonto").value = json.bairro;
        document.getElementById("numeroPonto").value = json.numero;
        document.getElementById("complementoPonto").value = json.complemento;
        document.getElementById("latitudePonto").value = json.latitude;
        document.getElementById("longitudePonto").value = json.longitude;

        let Ponto= json.cod_ponto
        let pid= json.cod_pid
        let categoria= json.cod_categoria

        //fetch de pid
        fetch(servidor + `read/pid/${pid}`, {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + meuToken
          },
        }).then(function (response) {

          //tratamento dos erros
          if (response.status == 200 || response.status == 201) {
            response.json().then(function (json) {

              document.getElementById("nomePonto").value = json.nome;
              document.getElementById("inepPonto").value = json.inep;


              //fetch de categoria
              fetch(servidor + `read/categoria/${categoria}`, {
                method: 'GET',
                headers: {
                  'Authorization': 'Bearer ' + meuToken
                },
              }).then(function (response) {

                //tratamento dos erros
                if (response.status == 200 || response.status == 201) {
                  response.json().then(function (json) {

                    puxaCategoria(json.cod_categoria, json.descricao);
                    
                    document.getElementById("botaoPonto").innerHTML = ` <button class='btn btn-primary' onclick='editarPidPonto(${Ponto}, ${pid}, ${categoria})' type='button'>Editar</button>`;
                  });
                } else {
                  erros(response.status);
                }
              });
            });
          } else {
            erros(response.status);
          }
        });
      });
    } else {
      erros(response.status);
    }
  });

}

//função que de fato faz a edição
function editarPidPonto(ponto, pid, categoria) {
  //verifica se algum dos campos está inserido errado
  if(document.getElementById("lat") || document.getElementById("lon") || document.getElementById("grauLat")?.textContent || document.getElementById("grauLong")?.textContent){
    alert("Campo com valor inválido!")
  }else{
    let edicaoPonto 

    if(document.getElementById("latitudePonto") && document.getElementById("longitudePonto")){
      edicaoPonto = {
        "cod_ponto": parseInt(document.getElementById("cod_pontoPonto").value),
        "cod_categoria": parseInt(document.getElementById("categoria").value),
        "cod_ibge": parseInt(meuCodigo),
        "cod_pid": parseInt(pid),
        "endereco": document.getElementById("enderecoPonto").value,
        "numero": document.getElementById("numeroPonto").value,
        "complemento": document.getElementById("complementoPonto").value,
        "bairro": document.getElementById("bairroPonto").value,
        "cep": document.getElementById("cepPonto").value,
        "latitude": parseFloat(document.getElementById("latitudePonto").value),
        "longitude": parseFloat(document.getElementById("longitudePonto").value),
      };
    }else{

      //Pega os valores dos campos de graus e transforma em decimal
      grauToDecimal();

      edicaoPonto = {
        "cod_ponto": parseInt(document.getElementById("cod_pontoPonto").value),
        "cod_categoria": parseInt(document.getElementById("categoria").value),
        "cod_ibge": parseInt(meuCodigo),
        "cod_pid": parseInt(pid),
        "endereco": document.getElementById("enderecoPonto").value,
        "numero": document.getElementById("numeroPonto").value,
        "complemento": document.getElementById("complementoPonto").value,
        "bairro": document.getElementById("bairroPonto").value,
        "cep": document.getElementById("cepPonto").value,
        "latitude": laatitude,
        "longitude": loongitude,
      };

    }

    let edicaoPid = {
      "cod_ibge": parseInt(meuCodigo),
      "nome": document.getElementById("nomePonto").value,
      "inep": document.getElementById("inepPonto").value,
    };

    //transforma as informações do token em json
    let corpo1 = JSON.stringify(edicaoPonto);
    let corpo2 = JSON.stringify(edicaoPid);
    
    console.log(corpo2);
    fetch(servidor + 'read/pid/' + pid, {
      method: 'PUT',
      body: corpo2,
      headers: {
        'Authorization': 'Bearer ' + meuToken
      },
    }).then(function (response) {
      //checar o status do pedido
      console.log(response.statusText);

      //tratamento dos erros
      if (response.status == 200 || response.status == 201) {

        //pegar a data para enviar no editarUacom2
        response.json().then(function (json) {
          setTimeout(function () {
            console.log(corpo1);
            fetch(servidor + `read/ponto/${ponto}/${categoria}/${meuCodigo}`, {
              method: 'PUT',
              body: corpo1,
              headers: {
                'Authorization': 'Bearer ' + meuToken
              },
            }).then(function (response) {
              //checar o status do pedido
              console.log(response.statusText);
    
              //tratamento dos erros
              if (response.status == 200 || response.status == 201) {
    
                //pegar a data para enviar no editarUacom2
                response.json().then(function (json) {

                  alert("Ponto editado com sucesso!")
                  setTimeout(function () {
                    location.reload()
                  }, 1000);
                });
    
              } else {
                // erros(response.status);
              }
            });
          }, 2000);
        });
      } else {
        erros(response.status);
      }
    });
  }
}


function puxaLatTipo(laatTipo) {
  if(laatTipo){
    return `<option value="${laatTipo}">${laatTipo}</option>`
  }
}
function latLong(input) {

  if(parseInt(input) == 1){
    //Pega os valores dos campos de graus e transforma em decimal
    grauToDecimal();

    console.log(laatitude,loongitude)
    
    if( isNaN(laatitude) && isNaN(loongitude)){
      laatitude = ''
      loongitude = ''
    }
    
    if(document.getElementById('grau')){
      document.getElementById('LatLong').removeChild(document.getElementById('grau'));
    }

    $(document).ready(function(){
      $("field").append(`<div id="decimal" class="multisteps-form__content">
                          <div class="form-row mt-4">
                            <div class="col-12 col-sm-12 mt-4">
                              <label for="latitudePonto">Latitude</label>
                              <input class="multisteps-form__input form-control " value="${laatitude}" onchange="checkLat()" type="text" name="latitudePonto" id="latitudePonto">
                              <mensagemLat id="mensagemLat"></mensagemLat>
                            </div>
                            <div class="col-12 col-sm-12 mt-4">
                              <label for="longitudePonto">Longitude</label>
                              <input class="multisteps-form__input form-control " value="${loongitude}" onchange="checkLong()" type="text" name="longitudePonto" id="longitudePonto">
                              <mensagemLon id="mensagemLon"></mensagemLon>
                            </div>
                          </div>
                        </div>`)
    });
    checkLat()
    checkLong()
  }else{

    //Pega os valores dos campos de decimais e transforma em graus
    decimalToGrau(parseFloat(document.getElementById("latitudePonto").value), parseFloat(document.getElementById("longitudePonto").value))

    console.log( laatTipo, laatGrau, laatMin, laatSeg, loongTipo, loongGrau, loongMin, loongSeg)

    if( laatGrau == null && laatMin == null && laatSeg == null && loongGrau == null && loongMin == null && loongSeg == null){
      laatGrau = ''
      laatMin = ''
      laatSeg = ''
      loongGrau = ''
      loongMin = ''
      loongSeg = ''
    }

    if(document.getElementById('decimal')){
      document.getElementById('LatLong').removeChild(document.getElementById('decimal'));
    }


    $(document).ready(function(){
      $("field").append(`
                      <div id="grau" class="multisteps-form__content">
                        <h1 class="mt-4">Latitude</h1>
                        <div class="form-row mt-4">
                          <div class="col-2 col-sm-2 ">
                            <label for="latTipo">Hemisfério</label>
                            <select class="multisteps-form__input form-control latTipo" name="latTipo" id="latTipo">
                              ${puxaLatTipo(laatTipo)}
                              <option value="N">N</option>
                              <option value="S">S</option>
                            </select>
                          </div>
                          <div class="col-3 col-sm-3 mb-4">
                            <label for="latGrau">Graus</label>
                            <input class="multisteps-form__input form-control" onchange="checkGrauLat('grau')" value="${laatGrau}" type="text" name="latGrau" id="latGrau" mask="99">
                          </div>
                          <b>º</b>
                          <div class="col-3 col-sm-3">
                            <label for="latMin">Minutos</label>
                            <input class="multisteps-form__input form-control" onchange="checkGrauLat('min')" value="${laatMin}" type="text" #latMin="ngModel" name="latMin" id="latMin" mask="99" >
                          </div>
                          <b>'</b>
                          <div class="col-3 col-sm-3">
                            <label for="latSeg">Segundos</label>
                            <input class="multisteps-form__input form-control" onchange="checkGrauLat('seg')" value="${laatSeg}" type="text" #latSeg="ngModel" name="latSeg" id="latSeg" mask="99.99" [dropSpecialCharacters]="false" [(ngModel)]="latLong.grau.latitude.latSeg">
                          </div>
                          <b>"</b>
                        </div>

                        <grauLat id="grauLat"></grauLat>

                        <h1 class="mt-4">Longitude</h1>
                        <div class="form-row mt-4">
                          <div class="col-2 col-sm-2 ">
                            <label for="longTipo">Hemisfério</label>
                            <select class="multisteps-form__input form-control longTipo" name="longTipo" id="longTipo">
                              <option value="O" selected>O</option>
                            </select>
                          </div>
                          <div class="col-3 col-sm-3 mb-4">
                            <label for="longGrau">Graus</label>
                            <input class="multisteps-form__input form-control" onchange="checkGrauLong('grau')" value="${loongGrau}" type="text" name="longGrau" id="longGrau" mask="99">
                          </div>
                          <b>º</b>
                          <div class="col-3 col-sm-3">
                            <label for="longMin">Minutos</label>
                            <input class="multisteps-form__input form-control" onchange="checkGrauLong('min')" value="${loongMin}" type="text" #longMin="ngModel" name="longMin" id="longMin" mask="99" >
                          </div>
                          <b>'</b>
                          <div class="col-3 col-sm-3">
                            <label for="longSeg">Segundos</label>
                            <input class="multisteps-form__input form-control" onchange="checkGrauLong('seg')" value="${loongSeg}" type="text" #longSeg="ngModel" name="longSeg" id="longSeg" mask="99.99" [dropSpecialCharacters]="false" [(ngModel)]="latLong.grau.latitude.latSeg">
                          </div>
                          <b>"</b>
                        </div>

                        <grauLong id="grauLong"></grauLong>
                      </div>`)
                      setTimeout(function () {
                        checkGrauLat("grau")
                        checkGrauLat("min")
                        checkGrauLat("seg")
                      }, 0400);
                      setTimeout(function () {
                        checkGrauLong("grau")
                        checkGrauLong("min")
                        checkGrauLong("seg")
                      }, 0500);
    });
  }
}

function grauToDecimal() {
  let lat = null;
  let long = null;
  let latitude = null;
  let longitude = null;

  const latGrau = Number(document.getElementById("latGrau").value);
  const latMin = Number(document.getElementById("latMin").value);
  const latSeg = Number(document.getElementById("latSeg").value);
  const longGrau = Number(document.getElementById("longGrau").value);
  const longMin = Number(document.getElementById("longMin").value);
  const longSeg = Number(document.getElementById("longSeg").value);

  // Latitude
  if (!((latGrau === 0) && (latMin === 0) && (latSeg === 0))) {
    lat = ( latGrau + ( (latMin / 60) + (latSeg / 3600) )).toFixed(6);
    if ( document.getElementById("latTipo").value === 'S' ) {
      latitude = `-${lat.toString()}`;
    } else {
      latitude = `+${lat.toString()}`;
    }
  } else {
    latitude = '';
  }

  // Longitude
  if (!((longGrau === 0) && (longMin === 0) && (longSeg === 0))) {
    long = (longGrau + ( ( longMin / 60) + ( longSeg / 3600) )).toFixed(6);
    longitude = `-${long.toString()}`;
  } else {
    longitude = '';
  }

  return laatitude = parseFloat(latitude) , loongitude = parseFloat(longitude)
}

function decimalToGrau(latitude, longitude) {
  let latGrau = null;
  let latMin = null;
  let latSeg = null;
  let latTipo = '';
  let longGrau = null;
  let longMin = null;
  let longSeg = null;
  const longTipo = 'O';
  let latitudeDecimal = Number(latitude);
  const longitudeDecimal = Number(longitude) * -1;

  (latitudeDecimal < 0) ? (latTipo = 'S', latitudeDecimal = latitudeDecimal * -1) : latTipo = 'N';

  if (latitude && !isNaN(latitude)) {
    // Grau Latitude
    latGrau = Math.trunc(latitudeDecimal);
    // Minutos Latitude
    latMin = Math.trunc((latitudeDecimal * 60) % 60);
    // Segundos Latitude
    latSeg = ((latitudeDecimal * 3600) % 60).toFixed(2);

    laatTipo = latTipo;
    laatGrau = latGrau;
    laatMin = latMin;
    laatSeg = latSeg;
  } else {
    laatTipo = '';
    laatGrau = null;
    laatMin = null;
    laatSeg = null;
  }
  if (longitude && !isNaN(longitude)) {
    // Grau Longitude
    longGrau = Math.trunc(longitudeDecimal);
    // Minutos Longitude
    longMin = Math.trunc((longitudeDecimal * 60) % 60);
    // Segundos Longitude
    longSeg = ((longitudeDecimal * 3600) % 60).toFixed(2);

    loongTipo = longTipo;
    loongGrau = longGrau;
    loongMin = longMin;
    loongSeg = longSeg;
  } else {
    loongTipo = '';
    loongGrau = null;
    loongMin = null;
    loongSeg = null;
  }

  return laatTipo, laatGrau, laatMin, laatSeg, loongTipo, loongGrau, loongMin, loongSeg
}

function checkLat() {
  let lat
  if(parseFloat(document.getElementById("latitudePonto").value) != null){
    lat = parseFloat(document.getElementById("latitudePonto").value);
  }
  
  console.log(lat)

  if(lat < -34.000000 || lat > 6.000000){
    if(document.getElementById('lat') == null){
      $("mensagemLat").append(`<div id="lat" class="ml-1 mt-1 text-danger">A latitude deve estar entre -34.000000 e +6.000000.</div>`)
    }
  }else{
    document.getElementById('mensagemLat').removeChild(document.getElementById('lat'));
  }

}

function checkLong() {
  let lon
  if(parseFloat(document.getElementById("longitudePonto").value) != null){
    lon = parseFloat(document.getElementById("longitudePonto").value);
  }

  if(lon < -75.000000 || lon > -32.000000){
    if(document.getElementById('lon') == null){
      $("mensagemLon").append(`<div id="lon" class="ml-1 mt-1 text-danger">A longitude deve estar entre -75.000000 e -32.000000</div>`)
    }
  }else{
    document.getElementById('mensagemLon').removeChild(document.getElementById('lon'));
  }
}

function checkGrauLat(campo) {
  console.log(campo)

  if(campo == "grau"){

    // console.log(document.getElementById('latTipo').value)
    
    //Verifica se o Hemisfério é N ou S
    if(document.getElementById('latTipo').value == "N"){
      let latGrau = parseFloat(document.getElementById("latGrau").value);

      if(latGrau>6){
        if(document.getElementById('grausLat') == null){
          $("grauLat").append(`<div id="grausLat" class="ml-1 mt-1 text-danger">O Grau deve estar entre Sul 34 e Norte 6.</div>`)
        }
      }else{
        document.getElementById('grauLat').removeChild(document.getElementById('grausLat'));
      }
    }else{
      let latGrau = parseFloat(document.getElementById("latGrau").value);

      if(latGrau>34){
        if(document.getElementById('grausLat') == null){
          $("grauLat").append(`<div id="grausLat" class="ml-1 mt-1 text-danger">O Grau deve estar entre Sul 34 e Norte 6.</div>`)
        }
      }else{
        document.getElementById('grauLat').removeChild(document.getElementById('grausLat'));
      }
    }
  }
  if(campo == "min"){
    let latMin = parseFloat(document.getElementById("latMin").value);

    if(latMin<0 || latMin>60){
      if(document.getElementById('grausMin') == null){
        $("grauLat").append(`<div id="grausMin" class="ml-1 mt-1 text-danger">O Minuto deve estar entre 0 e 60.</div>`)
      }
    }else{
      document.getElementById('grauLat').removeChild(document.getElementById('grausMin'));
    }
  }
  if(campo == "seg"){
    let latSeg = parseFloat(document.getElementById("latSeg").value);

    if(latSeg<0 || latSeg>60){
      if(document.getElementById('grausSeg') == null){
        $("grauLat").append(`<div id="grausSeg" class="ml-1 mt-1 text-danger">O Segundo deve estar entre 0 e 60.</div>`)
      }
    }else{
      document.getElementById('grauLat').removeChild(document.getElementById('grausSeg'));
    }
  }
}

function checkGrauLong(campo) {
  console.log(campo)

  if(campo == "grau"){
    let longGrau = parseFloat(document.getElementById("longGrau").value);

    if(longGrau<32 || longGrau >75){
      if(document.getElementById('grausLong') == null){
        $("grauLong").append(`<div id="grausLong" class="ml-1 mt-1 text-danger">O Grau deve estar entre Oeste 32 e Oeste 75.</div>`)
      }
    }else{
      document.getElementById('grauLong').removeChild(document.getElementById('grausLong'));
    }
  }
  if(campo == "min"){
    let longMin = parseFloat(document.getElementById("longMin").value);

    if(longMin<0 || longMin>60){
      if(document.getElementById('grausMinu') == null){
        $("grauLong").append(`<div id="grausMinu" class="ml-1 mt-1 text-danger">O Minuto deve estar entre 0 e 60.</div>`)
      }
    }else{
      document.getElementById('grauLong').removeChild(document.getElementById('grausMinu'));
    }
  }
  if(campo == "seg"){
    let longSeg = parseFloat(document.getElementById("longSeg").value);

    if(longSeg<0 || longSeg>60){
      if(document.getElementById('grausSegun') == null){
        $("grauLong").append(`<div id="grausSegun" class="ml-1 mt-1 text-danger">O Segundo deve estar entre 0 e 60.</div>`)
      }
    }else{
      document.getElementById('grauLong').removeChild(document.getElementById('grausSegun'));
    }
  }
}