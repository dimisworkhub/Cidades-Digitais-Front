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







//CD acompanhameno (pode ir pra subtabelas se necessário)

let listaUacom = [], listaAssunto = [], meuData = [];

//usado para fazer o id dos botões de assunto
let contaAssunto = 0;

//usado para contar o total de botões
let totalAssunto = 0;

//assuntoSelecionado guarda os assuntos que serão adicionados
let dataAssunto, listaDeAssuntos, assuntoSelecionado = "";

function pegarAssunto(){
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

        listaAssunto=json;

        let x="";
        for(let i=0; i<json.length; i++){
          x += "<option value=" + json[i].cod_assunto + ">" + json[i].descricao + "</option>";
        }
        document.getElementById("assunto").innerHTML = x;

      });
    } else {
      erros(response.status);
    }
  });
}

function uacom() {

	//cria o botão para editar
	document.getElementById("editar").innerHTML = (`<button class="btn btn-success" data-toggle="modal" data-target="#adicionarUacom" onclick="pegarAssunto()">Novo Acompanhamento</button>`);
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
      
      listaUacom=json;
	
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



				//salva os valores para edição
				meuData[i] = listaUacom[i]["data"];
	
				tabela += (`<tr>`);
				tabela += (`<td class="data">`);
				tabela += arrumaData(listaUacom[i]["data"]);
        tabela += (`</td> <td>`);
        tabela += "Ainda trabalhando nisso.";
        //tabela += listaDeAssuntos;
        tabela += (`</td> <td>`);
				tabela += listaUacom[i]["titulo"];
				tabela += (`</td> <td>`);
				tabela += listaUacom[i]["relato"];
        tabela += (`</td>`);
        tabela += (`<td> 
                  <span class="d-flex">
                  <button onclick="editarUacom(` + i + `)" class="btn btn-success">
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

function anotaAssunto() {

  let valoresAssunto = document.getElementById("assunto").value;

  assuntoSelecionado = `<a class="btn btn-success" id="adicao` + contaAssunto + `" onclick="removerAssunto(` + contaAssunto + `)" value="` + + `"> Assunto `+  +`</a>`;

  document.getElementById("adicoes").innerHTML += assuntoSelecionado;

  contaAssunto++;
  totalAssunto++;
}

function removerAssunto(valor){

  document.getElementById("adicao"+valor).innerHTML = "";

  totalAssunto--;
  console.log(totalAssunto);
}

function novoUacom() {

  let infoUacom = {
    "cod_ibge": parseInt(meuCodigo),
    "relato": document.getElementById("relato").value,
    "titulo": document.getElementById("titulo").value,
  };

  //transforma as informações em string para mandar
  let corpo = JSON.stringify(infoUacom);

  console.log(corpo);
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

      alert('Acompanhamento inserido com sucesso!');

      response.json().then(function (json) {
      dataAssunto = json.data;
      novoAssunto();
      });

    } else {
      erros(response.status);
    }
  });
}

function novoAssunto(){
  for(let i = 0; i <= totalAssunto; i++){
    
    let infoAssunto = [];

    infoAssunto[i] = {
      "cod_ibge": parseInt(meuCodigo),
      "data": dataAssunto,
      "cod_assunto": document.getElementById("assunto"+i).value,
    };

    //transforma as informações em string para mandar
    let corpo = JSON.stringify(infoAssunto[i]);

    console.log(corpo);
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
        alert('Assunto inserido com sucesso!');
        location.reload();
      } else {
        erros(response.status);
      }
    });
  }
}



// function editarUacom(valor) {

//   document.getElementById("titulo").value = listaUacom[i]["titulo"];
//   document.getElementById("relato").value = listaUacom[i]["relato"];

//   let edicaoUacom = [];
  
// 	for (let i = 0; i < listaUacom.length; i++) {
  
// 	  edicaoUacom[i] = {
// 		"titulo": document.getElementById("titulo" + i).value,
// 		"relato": document.getElementById("relato" + i).value,
// 	  };
  
// 	  // console.log(edicaoUacom)
// 	  if (edicaoUacom[i]["titulo"] != listaUacom[i]["titulo"] || edicaoUacom[i]["relato"] != listaUacom[i]["relato"]) {
//       //transforma as informações do token em json
//       let corpo = JSON.stringify(edicaoUacom[i]);
//       //função fetch para mandar
//       fetch(servidor + 'read/uacom/' + meuCodigo + '/' + meuData[i], {
//         method: 'PUT',
//         body: corpo,
//         headers: {
//         'Authorization': 'Bearer ' + meuToken
//         },
//       }).then(function (response) {
//         //checar o status do pedido
//         console.log(response.statusText);
    
//         //tratamento dos erros
//         if (response.status == 200 || response.status == 201) {
//           location.reload();
//         } else {
//           erros(response.status);
//         }
//       });
// 	  }
// 	}
// }





//CD Contatos

function contatos() {

  //cria o botão para editar
  document.getElementById("editar").innerHTML = (`<button id="editar" onclick="editarContatoCD()" class="btn btn-success">Salvar Alterações</button>
                                                  <button class="btn btn-success" data-toggle="modal" data-target="#adicionarContato">Novo Contato</button>`);
  document.getElementById("editar2").innerHTML = (`<button id="editar" onclick="editarContatoCD()" class="btn btn-success">Salvar Alterações</button>`);

  //função fetch para chamar contatos da tabela
  fetch(servidor + 'read/contato/'+meuCodigo+'/0', {
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
        </tr>
        </thead>`);
        tabela += (`<tbody>`);

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
          tabela += (`<input value="` + listaItem[i]["nome"] + `"class="" id="nome` + i + `" type="text" size="30">`);
          tabela += (`</td> <td>`);
          tabela += (`<input value="` + listaItem[i]["funcao"] + `"class="" id="funcao` + i + `" type="text" size="30">`);
          tabela += (`</td> <td>`);
          tabela += (`<input value="` + listaItem[i]["email"] + `"class="" id="email` + i + `" type="text" size="30">`);
          tabela += (`</td>`);
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

function editarContatoCD() {

  for (let i = 0; i < listaItem.length; i++) {

    edicaoItem[i] = {
      "nome": document.getElementById("nome" + i).value,
      "email": document.getElementById("email" + i).value,
      "funcao": document.getElementById("funcao" + i).value,
    };

    console.log(listaItem[i])
    console.log(edicaoItem[i])
    if (edicaoItem[i]["nome"] != listaItem[i]["nome"] || edicaoItem[i]["email"] != listaItem[i]["email"] || edicaoItem[i]["funcao"] != listaItem[i]["funcao"]) {
      //transforma as informações do token em json
      let corpo = JSON.stringify(edicaoItem[i]);
      //função fetch para mandar
      fetch(servidor + 'read/contato/' + listaItem[i]["cod_contato"] , {
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
        window.location.replace("./gerenciaCd.html");
      });
    }
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
  let infoTelefone= [];

  fetch(servidor + 'read/contato/'+meuCodigo+'/0', {
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
        
        maisInput(false);

        for (let i = 0; i < indice+1; i++) {
          infoTelefone[i] = {
            "cod_contato": parseInt(meuContato),
            "telefone": document.getElementById("telefone"+i).value,
            "tipo": document.getElementById("tipo"+i).value,
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
function maisInput(passe){
  if(passe == true){
    $(document).ready(function(){
      mascara();
      $("side").append('<div class="form-row mt-4">'+
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
    indice = indice + 1;
  }
  return indice;
}