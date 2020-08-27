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
  pegarCNPJ();
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

  //console.log(info);

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
    console.log(response);

    //tratamento dos erros
    if (response.status == 200 || response.status == 201) {
      //checar o json
      response.json().then(function (json) {
      console.log(json);
      });
      window.location.replace("./cd.html");
    } else {
      erros(response.status);
    }
  });
}







//CD acompanhameno (pode ir pra subtabelas se necessário)

let listaUacom = [], meuData = [];

function uacom() {

	//cria o botão para editar
	document.getElementById("editar").innerHTML = "";
	document.getElementById("editar2").innerHTML = (`<button id="editar" onclick="editarItemCD()" class="btn btn-success">Salvar Acompanhamento</button>`);
  
	//função fetch para chamar itens da tabela
	fetch(servidor + 'read/uacom', {
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
			<th style="width:20%" scope="col">Data</th>
			<th style="width:20%" scope="col">Titulo</th>
			<th style="width:60%" scope="col">Relato</th>
			</tr>
			</thead>`);
			tabela += (`<tbody>`);
  
			//cria uma lista apenas com os itens do lote selecionado
			let j = 0;
			for (let i = 0; i < json.length; i++) {
				if (json[i]["cod_ibge"] == meuCodigo) {
					listaUacom[j] = json[i];
					j++;
				}
			}
		    for (i = 0; i < listaUacom.length; i++) {
  
				//salva os valores para edição
				meuData[i] = listaUacom[i]["data"];
	
				tabela += (`<tr>`);
				tabela += (`<td>`);
				tabela += (`<input value="` + listaUacom[i]["data"] + `" class="data" id="data` + i + `" type="text" size="15">`);
				tabela += (`</td> <td>`);
				tabela += (`<input value="` + listaUacom[i]["titulo"] + `" id="titulo` + i + `" type="text" size="15">`);
				tabela += (`</td> <td>`);
				tabela += (`<input value="` + listaUacom[i]["relato"] + `" id="relato` + i + `" type="text" size="60">`);
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
  
function editarUacom() {
  
	for (let i = 0; i < listaUacom.length; i++) {
  
	  edicaoUacom[i] = {
		"data": parseInt(document.getElementById("data" + i).value),
		"titulo": parseInt(document.getElementById("titulo" + i).value),
		"relato": parseInt(document.getElementById("relato" + i).value),
	  };
  
	  // console.log(edicaoUacom)
	  if (edicaoUacom[i]["data"] != listaUacom[i]["data"] || edicaoUacom[i]["titulo"] != listaUacom[i]["titulo"] || edicaoUacom[i]["relato"] != listaUacom[i]["relato"]) {
		//transforma as informações do token em json
		let corpo = JSON.stringify(edicaoUacom[i]);
		//função fetch para mandar
		fetch(servidor + 'read/cditens/' + meuCodigo + '/' + meuData[i], {
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
		  location.reload();
		});
	  }
	}
}







//CD Itens

function itens() {

  //cria o botão para editar
  document.getElementById("editar").innerHTML = (`<button id="editar" onclick="editarItemCD()" class="btn btn-success">Salvar Alterações em Itens</button>`);
  document.getElementById("editar2").innerHTML = (`<button id="editar" onclick="editarItemCD()" class="btn btn-success">Salvar Alterações em Itens</button>`);

  //função fetch para chamar itens da tabela
  fetch(servidor + 'read/cditens', {
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
        <th style="width:40%" scope="col">Descrição</th>
        <th style="width:20%" scope="col">Quantidade prevista</th>
        <th style="width:20%" scope="col">Quantidade do projeto executivo</th>
        <th style="width:20%" scope="col">Quantidade de termo de instalação </th>
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
          tabela += listaItem[i]["descricao"];
          tabela += (`</td> <td>`);
          tabela += (`<input value="` + listaItem[i]["quantidade_previsto"] + `"class="inteiros" id="quantidade_previsto` + i + `" type="text" size="15">`);
          tabela += (`</td> <td>`);
          tabela += (`<input value="` + listaItem[i]["quantidade_projeto_executivo"] + `"class="quebrados" id="quantidade_projeto_executivo` + i + `" type="text" size="15">`);
          tabela += (`</td> <td>`);
          tabela += (`<input value="` + listaItem[i]["quantidade_termo_instalacao"] + `"class="quebrados" id="quantidade_termo_instalacao` + i + `" type="text" size="15">`);
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

function editarItemCD() {

  for (let i = 0; i < listaItem.length; i++) {

    edicaoItem[i] = {
      "quantidade_previsto": parseInt(document.getElementById("quantidade_previsto" + i).value),
      "quantidade_projeto_executivo": parseFloat(mascaraQuebrados(document.getElementById("quantidade_projeto_executivo" + i).value)),
      "quantidade_termo_instalacao": parseFloat(mascaraQuebrados(document.getElementById("quantidade_termo_instalacao" + i).value)),
    };

    // console.log(edicaoItem)
    if (edicaoItem[i]["quantidade_previsto"] != listaItem[i]["quantidade_previsto"] || edicaoItem[i]["quantidade_projeto_executivo"] != listaItem[i]["quantidade_projeto_executivo"] || edicaoItem[i]["quantidade_termo_instalacao"] != listaItem[i]["quantidade_termo_instalacao"]) {
      //transforma as informações do token em json
      let corpo = JSON.stringify(edicaoItem[i]);
      //função fetch para mandar
      fetch(servidor + 'read/cditens/' + meuCodigo + '/' + meuItem[i] + '/' + meuTipo[i], {
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
  }
}

//CD Contatos

function contatos() {

  //cria o botão para editar
  document.getElementById("editar").innerHTML = (`<button id="editar" onclick="editarContatoCD()" class="btn btn-success">Salvar Alterações</button>
                                                  <button class="btn btn-success" data-toggle="modal" data-target="#adicionarContato">Novo Contato</button>`);
  document.getElementById("editar2").innerHTML = (`<button id="editar" onclick="editarContatoCD()" class="btn btn-success">Salvar Alterações</button>`);

  //função fetch para chamar contatos da tabela
  fetch(servidor + 'read/contato', {
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
        <th style="width:20%" scope="col">Código de Contato</th>
        <th style="width:20%" scope="col">Nome</th>
        <th style="width:20%" scope="col">E-mail</th>
        <th style="width:20%" scope="col">Função</th>
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
          tabela += listaItem[i]["cod_contato"];
          tabela += (`</td> <td>`);
          tabela += (`<input value="` + listaItem[i]["nome"] + `"class="" id="nome` + i + `" type="text" size="30">`);
          tabela += (`</td> <td>`);
          tabela += (`<input value="` + listaItem[i]["email"] + `"class="" id="email` + i + `" type="text" size="30">`);
          tabela += (`</td> <td>`);
          tabela += (`<input value="` + listaItem[i]["funcao"] + `"class="" id="funcao` + i + `" type="text" size="30">`);
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
    "cod_contato": parseInt(document.getElementById("cod_contato").value),
    "cod_ibge": parseInt(meuCodigo),
    "cnpj": document.getElementById("cnpj").value,
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
      location.reload();
    } else {
      erros(response.status);
    }
  });
}



function pegarCNPJ() {
  
  //preenche os CNPJs
  fetch(servidor + 'read/entidade', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 200) {
      response.json().then(function (json) {
        //cria variaveis
        let i = 0;
        let x = [];
        x[0] += "<option value='00000000000000'>CNPJ</option>";
        for (i = 0; i < json.length; i++) {
          x[i + 1] += "<option>" + json[i].cnpj + "</option>";
        }
        
        document.getElementById("cnpj").innerHTML = x;
      });
    } else {
      erros(response.status);
    }
  });
}