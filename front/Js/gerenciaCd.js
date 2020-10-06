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
  meuData = [];

//usado para fazer o id dos botões de assunto
let idAssunto = 0, testenumero = [];

//dataAssunto usado para enviar assuntos após enviar as informações de acompanhamento
let dataAssunto;



//precisa ficar de fora para poder ser alterado
let optionAssunto = "";

//valorPego serve apenas para quando já foi usado um dos assuntos na criação.
function pegarAssuntos(valorPego) {
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

        document.getElementById("titulo").value = "";
        document.getElementById("relato").value = "";

        for (let i = 0; i < json.length; i++) {

          //caso original:
          if (valorPego == 0) {
            optionAssunto += "<option value='" + json[i].cod_assunto + "   " + json[i].descricao + "'>" + json[i].descricao + "</option>";
          }

          // //caso precise retirar
          // else {
          //   if (json[i].cod_assunto == testenumero) {
          //     optionAssunto -= "<option value='" + json[i].cod_assunto + "   " + json[i].descricao + "'>" + json[i].descricao + "</option>";
          //   }
          // }

        }
        document.getElementById("assunto").innerHTML = optionAssunto;

        document.getElementById("botaoFinal").innerHTML = " <button class='btn btn-primary multi-button ml-auto js-btn-next' onclick='novoUacom()' type='button'>Cadastrar</button>";

      });
    } else {
      erros(response.status);
    }
  });
}

function uacom() {

  //cria o botão para editar
  document.getElementById("editar").innerHTML = (`<button class="btn btn-success" data-toggle="modal" data-target="#adicionarUacom" onclick="pegarAssuntos(0)">Novo Acompanhamento</button>`);
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
			<th style="width:5%" scope="col">editar</th>
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
                  <button onclick="edicaoModal(` + i + `)" class="btn btn-success" data-toggle="modal" data-target="#adicionarUacom">
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



function anotaAssunto() {

  let valoresAssunto = document.getElementById("assunto").value;
  let valoresAssunto2 = valoresAssunto.split("   ");

  let assuntoSelecionado = `<button class="btn" id="adicao` + idAssunto + `" value="` + valoresAssunto2[0] + `">` + valoresAssunto2[1] + `</button> <a class="js-btn-next" id="removedor` + idAssunto + `" type="reset" onclick="removerAssunto(` + idAssunto + `)" title="Deletar"> <img src="img/delete-icon.png" width="30px"> </a>`;

  document.getElementById("adicoes").innerHTML += assuntoSelecionado;

  idAssunto++;
}

function removerAssunto(valor) {
  document.getElementById("adicao" + valor).innerHTML = null;
  document.getElementById("removedor" + valor).innerHTML = null;
}

function novoAssunto() {
  for (let i = 0; i < idAssunto; i++) {
    if (document.getElementById("adicao" + i).innerHTML != "") {

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
          location.reload();
        } else {
          erros(response.status);
        }
      });
    }
  }
}



function edicaoModal(valor) {

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

        document.getElementById("titulo").value = listaUacom[valor]["titulo"];
        document.getElementById("relato").value = listaUacom[valor]["relato"];

        let x = "";
        for (let i = 0; i < json.length; i++) {
          x += "<option value='" + json[i].cod_assunto + "   " + json[i].descricao + "'>" + json[i].descricao + "</option>";
        }

        document.getElementById("assunto").innerHTML = x;

        document.getElementById("botaoFinal").innerHTML = " <button class='btn btn-primary multi-button ml-auto js-btn-next' onclick='editarUacom(" + valor + ")' type='button'>Cadastrar</button>";

      });
    } else {
      erros(response.status);
    }
  });

}



function editarUacom(valor) {

  let edicaoUacom = {
    "titulo": document.getElementById("titulo").value,
    "relato": document.getElementById("relato").value,
  };

  //transforma as informações do token em json
  let corpo = JSON.stringify(edicaoUacom);

  fetch(servidor + 'read/uacom/' + meuCodigo + '/' + meuData[valor], {
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



function editarUacom2(valor) {
  console.log("Ainda pensando como fazer...");
}





//Contatos

function contatosCD() {

  //cria o botão para editar
  document.getElementById("editar").innerHTML = (`<button id="editar" onclick="editarContato()" class="btn btn-success">Salvar Alterações</button>
                                                  <button class="btn btn-success" data-toggle="modal" data-target="#adicionarContato">Novo Contato</button>`);
  document.getElementById("editar2").innerHTML = (`<button id="editar" onclick="editarContato()" class="btn btn-success">Salvar Alterações</button>`);

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


function visualizarContato(cod_contato, nome, funcao, email, identificador) {
  identificador = parseInt(identificador)

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
        tabela += (`<td><input value="` + nome + `" id="nome` + identificador + `" type="text" class="nome"></td>`);
        tabela += (`<td><input value="` + funcao + `" id="funcao` + identificador + `" type="text" class="funcao"></td>`);
        tabela += (`<td><input value="` + email + `" id="email` + identificador + `" type="text" class="email"></td>`);


        tabela += (`<td>`);
        for (i = 0; i < json.length; i++) {
          tabela += (`<input value="` + json[i].telefone + `" id="telefone` + parseInt(1 + i) + `" type="text" class="telefone" size="14">`);
          tabela += (`&nbsp&nbsp&nbsp<select name="tipo" id="tipo` + parseInt(1 + i) + `">
          <option value="` + json[i].tipo + `">` + json[i].tipo + `</option>
          <option value="WhatsApp">WhatsApp</option>
          <option value="Casa">Casa</option>
          <option value="Celular">Celular</option>
          <option value="Trabalho">Trabalho</option>
          </select>
          <button onclick="apagarTelefone(`+ json[i].cod_telefone+`)" class="btn danger">
          <i class="material-icons"data-toggle="tooltip" title="Apagar Telefone">delete</i>
          </button>
          `);

        }
        tabela += (`</td>`);
        tabela += (`</td><td> 
          <span class="d-flex">
          <button onclick="editarContato(` + identificador + `,` + cod_contato + `);editarTelefone(` + identificador + `,` + cod_contato + `);" data-toggle="modal" href="#visualizar" class="btn ">
          <i class="material-icons"data-toggle="tooltip" title="Salvar">&#xE254;</i>
          </button>
          </span> </td>`);
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
        
        if(json.length==0){
          location.reload();
        }

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
                location.reload();
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

  console.log(edicaoItem)
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

function novoTelefone() {

  let meuContato;
  let infoTelefone = [];

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
          meuContato = json[i].cod_contato;
        }

        maisInput(false);

        for (let i = 0; i < indice + 1; i++) {
          infoTelefone[i] = {
            "cod_contato": parseInt(meuContato),
            "telefone": document.getElementById("telefone" + i).value,
            "tipo": document.getElementById("tipo" + i).value,
          };


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
        alert('O(s) telefone(s) foi(ram) cadastrado(s) com sucesso!');
        location.reload();
      });
    } else {
      erros(response.status);
    }
  });
}

let indice = 0;

function maisInput(passe) {
  if (passe == true && indice < 3) {
    $(document).ready(function () {
      mascara();
      $("side").append('<div id="telTipo' + indice + '" class="form-row mt-4">' +
        '<div class="col-12 col-sm-6">' +
        '<input class="multisteps-form__input form-control telefone" type="text" placeholder="Telefone" id="telefone' + indice + '" name="telefone"/>' +
        '</div>' +
        '<div class="col-12 col-sm-6">' +
        '<select class="multisteps-form__input form-control" name="tipo" id="tipo' + indice + '">' +
        '<option value="">Tipo</option>' +
        '<option value="WhatsApp">WhatsApp</option>' +
        '<option value="Casa">Casa</option>' +
        '<option value="Celular">Celular</option>' +
        '<option value="Trabalho">Trabalho</option>' +
        '</select>' +
        '</div>' +
        '</div>')
    });
    indice = indice + 1;
  }
  return indice;
}

function menosInput() {
  document.getElementById('telTipo' + indice).innerHTML = '';
  if (indice > 1) {
    indice = indice - 1;
  } else {
    indice = 1;
  }
  console.log(indice)
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
                  
                  fetch(servidor + 'read/contato/'+cod_contato, {
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
              fetch(servidor + 'read/contato/'+cod_contato, {
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

  fetch(servidor + 'read/telefone/'+cod_telefone, {
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