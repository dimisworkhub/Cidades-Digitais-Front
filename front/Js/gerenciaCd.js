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

  //estes campos precisam de adaptações para serem aceitos com o padrão yyyy-MM-dd

  let data1 = new Date(localStorage.getItem("data_pe"));
  let data2 = new Date(localStorage.getItem("data_imp"));

  let dataFinal1 = String(data1.getFullYear()).padStart(4, '0') + "-" + String(data1.getMonth() + 1).padStart(2, '0') + "-" + String(data1.getDate()).padStart(2, '0');
  let dataFinal2 = String(data2.getFullYear()).padStart(4, '0') + "-" + String(data2.getMonth() + 1).padStart(2, '0') + "-" + String(data2.getDate()).padStart(2, '0');

  document.getElementById("data_pe").value = dataFinal1;
  document.getElementById("data_imp").value = dataFinal2;

}


function enviar() {

  //JSON usado para mandar as informações no fetch
  let info = {
    "cod_ibge": parseInt(meuCodigo),
    "cod_lote": parseInt(meuLote),
    "os_pe": document.getElementById("os_pe").value,
    "data_pe": document.getElementById("data_pe").value,
    "os_imp": document.getElementById("os_imp").value,
    "data_imp": document.getElementById("data_imp").value,
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
      //response.json().then(function (json) {
      //console.log(json);
      //});
      window.location.replace("./cd.html");
    } else {
      erros(response.status);
    }
  });
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
      console.log(response.statusText);

      //pegar o json que possui a tabela
      response.json().then(function (json) {

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
          tabela += (`<input value="` + listaItem[i]["quantidade_previsto"] + `" id="quantidade_previsto` + i + `" type="text" size="15">`);
          tabela += (`</td> <td>`);
          tabela += (`<input value="` + listaItem[i]["quantidade_projeto_executivo"] + `" id="quantidade_projeto_executivo` + i + `" type="text" size="15">`);
          tabela += (`</td> <td>`);
          tabela += (`<input value="` + listaItem[i]["quantidade_termo_instalacao"] + `" id="quantidade_termo_instalacao` + i + `" type="text" size="15">`);
          tabela += (`</td>`);
          tabela += (`</tr>`);
        }
        tabela += (`</tbody>`);
        document.getElementById("tabela").innerHTML = tabela;

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
      "quantidade_projeto_executivo": parseInt(document.getElementById("quantidade_projeto_executivo" + i).value),
      "quantidade_termo_instalacao": parseInt(document.getElementById("quantidade_termo_instalacao" + i).value),
    };

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
        window.location.replace("./gerenciaCd.html");
      });
    }
  }
}