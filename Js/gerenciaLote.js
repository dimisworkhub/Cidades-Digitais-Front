//pega o token do login
let meuToken = localStorage.getItem("token");

//pega o CNPJ escolhido anteriormente
let meuLote = localStorage.getItem("cod_lote");
document.getElementById("cod_lote").value = meuLote;

//cuida de lote_itens
let edicaoItem = [];
let listaItem = [];
let meuItem = [];
let meuTipo = [];
let itemMudado = [];

//cuida de reajuste
let listaReajuste = [];
let edicaoReajuste = [];
let meuAno = [];
let reajusteMudado = [];

//tratamento de erros
function erros(value) {
  if (value == 400) {
    window.location.replace("./errors/400.html");
  } else if (value == 401) {
    window.location.replace("./errors/401.html");
  } else if (value == 403) {
    window.location.replace("./errors/403.html");
  } else if (value == 404) {
    window.location.replace("./errors/404.html");
  } else if (value == 409) {
    alert("Erro: Lote já existente.");
  } else if (value == 412) {
    alert("Erro: Informação colocada é incorreta.");
  } else if (value == 422) {
    alert("Erro: Formato de informação não aceito.");
  } else if (value == 500) {
    window.location.replace("./errors/500.html");
  } else if (value == 504) {
    window.location.replace("./errors/504.html");
  } else {
    alert("ERRO DESCONHECIDO");
  }
}


//JSON usado para mandar as informações no fetch
let info = {
  "cod_lote": "",
  "cnpj": "",
  "contrato": "",
  "dt_inicio_vig": "",
  "dt_final_vig": "",
  "dt_reajuste": "",
};


window.onload = function () {

  fetch('http://localhost:8080/read/entidadeget', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 200) {
      response.json().then(function (json) {
        //console.log(json);
        let x = [];
        for (i = 0; i < json.length; i++) {
          x[i] += "<option value=" + json[i].cnpj + ">" + json[i].nome + "</option>";
        }
        x.sort();
        document.getElementById("cnpj").innerHTML = x;

        let cnpj1 = document.getElementById("cnpj");
        cnpj1.value = localStorage.getItem("cnpj");
      });


    } else {
      erros(response.status);
    }
  });


  //preenche os campos
  let contrato1 = document.getElementById("contrato");
  contrato1.value = localStorage.getItem("contrato");

  //estes campos precisam de adaptações para serem aceitos, como yyyy-MM-dd

  let dt_inicio_vig1 = document.getElementById("dt_inicio_vig");
  let dt_final_vig1 = document.getElementById("dt_final_vig");
  let dt_reajuste1 = document.getElementById("dt_reajuste");

  let data1 = new Date(localStorage.getItem("dt_inicio_vig"));
  let data2 = new Date(localStorage.getItem("dt_final_vig"));
  let data3 = new Date(localStorage.getItem("dt_reajuste"));

  let dataFinal1 = String(data1.getFullYear()).padStart(4, '0') + "-" + String(data1.getMonth() + 1).padStart(2, '0') + "-" + String(data1.getDate()).padStart(2, '0');
  let dataFinal2 = String(data2.getFullYear()).padStart(4, '0') + "-" + String(data2.getMonth() + 1).padStart(2, '0') + "-" + String(data2.getDate()).padStart(2, '0');
  let dataFinal3 = String(data3.getFullYear()).padStart(4, '0') + "-" + String(data3.getMonth() + 1).padStart(2, '0') + "-" + String(data3.getDate()).padStart(2, '0');

  dt_inicio_vig1.value = dataFinal1;
  dt_final_vig1.value = dataFinal2;
  dt_reajuste1.value = dataFinal3;


}


function enviar() {

  info.cod_lote = parseFloat(meuLote);
  info.cnpj = document.getElementById("cnpj").value;
  info.contrato = document.getElementById("contrato").value;
  info.dt_inicio_vig = document.getElementById("dt_inicio_vig").value;
  info.dt_final_vig = document.getElementById("dt_final_vig").value;
  info.dt_reajuste = document.getElementById("dt_reajuste").value;

  //transforma as informações em string para mandar
  let corpo = JSON.stringify(info);
  //função fetch para mandar
  fetch('http://localhost:8080/read/lote/' + meuLote, {
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
      window.location.replace("./lote.html");
    } else {
      erros(response.status);
    }
  });
}


//lote Itens:


function itens() {

  //cria o botão para editar
  document.getElementById("editar").innerHTML = (`<button id="editar" onclick="editarItem()" class="btn btn-success">Salvar Alterações em Itens</button>`);
  document.getElementById("editar2").innerHTML = (`<button id="editar" onclick="editarItem()" class="btn btn-success">Salvar Alterações em Itens</button>`);

  //função fetch para chamar itens da tabela
  fetch('http://localhost:8080/read/loteitens', {
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

        let j = 0;
        //cria uma lista apenas com os itens do lote selecionado
        for (let i = 0; i < json.length; i++) {
          if (json[i]["cod_lote"] == meuLote) {
            listaItem[j] = json[i];
            j++;
          }
        }

        //cria a tabela para 
        let tabela = (`<thead style="background: #4b5366; color:white; font-size:15px">
                <tr>
                <th scope="col">Código do Item, Tipo de Item e Descrição do item</th>
                <th scope="col">Valor</th>
                </tr>
                </thead>`);
        tabela += (`<tbody>`);

        for (i = 0; i < listaItem.length; i++) {

          //salva os valores para edição
          meuItem[i] = listaItem[i]["cod_item"];
          meuTipo[i] = listaItem[i]["cod_tipo_item"];

          //cria json para edição
          edicaoItem[i] = {
            "preco": "",
          };

          //captura itens para tabela
          tabela += (`<tr>`);
          tabela += (`<td>`);
          tabela += listaItem[i]["cod_item"] + "." + listaItem[i]["cod_tipo_item"] + " - " + listaItem[i]["descricao"];
          tabela += (`</td> <td>`);
          tabela += "R$ " + (`<input value="` + listaItem[i]["preco"] + `" onchange="mudaItem(` + i + `)" id="preco` + i + `" type="text" class="preco">`);
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

function mudaItem(valor) {
  edicaoItem[valor].preco = parseFloat(document.getElementById("preco" + valor).value);
  itemMudado[valor]=valor;
}

function editarItem() {
  for (i = 0; i < listaItem.length; i++) {
    if (itemMudado[i]!=null) {
      //transforma as informações em string para mandar
      let corpo = JSON.stringify(edicaoItem[i]);
      //função fetch para mandar
      fetch('http://localhost:8080/read/loteitens/' + meuLote + '/' + meuItem[i] + '/' + meuTipo[i], {
        method: 'PUT',
        body: corpo,
        headers: {
          'Authorization': 'Bearer ' + meuToken
        },
      }).then(function (response) {
        //checar o status do pedido
        //console.log(response.statusText);

        //tratamento dos erros
        if (response.status == 200 || response.status == 201) {
          //checar a resposta do pedido
          //console.log(json);
          window.location.replace("./gerenciaLote.html");
        } else {
          //erros(response.status);
        }
      });
    }
  }
}


//lote reajustes


function reajuste() {

  document.getElementById("cod_lote1").value = meuLote;
  document.getElementById("cod_lote1").disabled = true;

  document.getElementById("editar").innerHTML = (`<button onclick="editarReajuste()" class="btn btn-success" >Salvar Alterações em Reajustes</button>
                                                  <button class="btn btn-success" data-toggle="modal" data-target="#adicionarReajuste">Novo Reajuste</button>`);
  document.getElementById("editar2").innerHTML = (`<button onclick="editarReajuste()" class="btn btn-success">Salvar Alterações em Reajustes</button>`);

  //função fetch para chamar reajustes da tabela
  fetch('http://localhost:8080/read/reajuste', {
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
        <th style="width:46%" scope="col">Ano de Referência</th>
        <th style="width:46%" scope="col">Percentual de Reajuste</th>
        <th style="width:8%" scope="col">Apagar</th>
        </tr>
        </thead>`);
        tabela += (`<tbody>`);

        let j = 0;
        for (let i = 0; i < json.length; i++) {
          if (json[i].cod_lote == meuLote) {
            listaReajuste[j] = json[i];
            j++;
          }
        }

        for (i = 0; i < listaReajuste.length; i++) {

          //salva os valores para edição
          meuAno[i] = listaReajuste[i]["ano_ref"];

          //cria json para edição
          edicaoReajuste[i] = {
            "percentual": "",
          };

          //captura itens para tabela
          tabela += (`<tr>`);
          tabela += (`<td>`);
          tabela += listaReajuste[i]["ano_ref"];
          tabela += (`</td><td>`);
          tabela += (`<input value="` + listaReajuste[i]["percentual"] + `" onchange="mudaReajuste(` + i + `)" id="percentual` + i + `" type="number">`) + "%";
          tabela += (`</td><td>
          <button onclick="apagarReajuste(` + listaReajuste[i]["ano_ref"] + `)" class="btn btn-danger">
          <i class="material-icons"data-toggle="tooltip" title="Delete">&#xE872;</i>
          </button>
          </td>`);
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

function mudaReajuste(valor) {
  edicaoReajuste[valor].percentual = parseFloat(document.getElementById("percentual" + valor).value);
  reajusteMudado[valor]=valor;
}

function editarReajuste() {
  for (i = 0; i < listaReajuste.length; i++) {
    if (reajusteMudado[i]!=null) {
      //transforma as informações em string para mandar
      let corpo = JSON.stringify(edicaoReajuste[i]);
      //função fetch para mandar
      fetch('http://localhost:8080/read/reajuste/' + listaReajuste[i]["ano_ref"] + '/' + meuLote, {
        method: 'PUT',
        body: corpo,
        headers: {
          'Authorization': 'Bearer ' + meuToken
        },
      }).then(function (response) {

        //tratamento dos erros
        if (response.status == 200 || response.status == 201) {
          //checar a resposta do pedido
          //console.log(json);
          window.location.replace("./gerenciaLote.html");
        } else {
          erros(response.status);
        }
      });
    }
  }
}

function novoReajuste() {

  let infoReajuste = {
    "cod_lote": parseInt(meuLote),
    "ano_ref": "",
    "percentual": "",
  };

  infoReajuste.ano_ref = parseInt(document.getElementById("ano_ref").value);
  infoReajuste.percentual = parseFloat(document.getElementById("percentual").value);

  //transforma as informações em string para mandar
  let corpo = JSON.stringify(infoReajuste);
  //função fetch para mandar
  fetch('http://localhost:8080/read/reajuste', {
    method: 'POST',
    body: corpo,
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 200 || response.status == 201) {
      //checar a resposta do pedido
      //console.log(json);

      location.reload();
    } else {
      erros(response.status);
    }
  });
}

function apagarReajuste(valor) {

  //função fetch para deletar
  fetch('http://localhost:8080/read/reajuste/' + valor + "/" + meuLote, {
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 204) {
      alert("Apagado com sucesso.");
      window.location.replace("./gerenciaLote.html");
    } else {
      erros(response.status);
    }
    return response.json().then(function (json) {
      console.log(json);
    });
  });
}


//lote previsão de empenho


function previsao() {

  document.getElementById("editar").innerHTML = (`<button onclick="editarReajuste()" class="btn btn-success" >Salvar Alterações em Reajustes</button>`);
  document.getElementById("editar2").innerHTML = (`<button onclick="editarReajuste()" class="btn btn-success">Salvar Alterações em Reajustes</button>`);

  //função fetch para chamar reajustes da tabela
  fetch('http://localhost:8080/read/reajuste', {
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
        <th style="width:15%" scope="col">Código de Previsão de Empenho</th>
        <th style="width:15%" scope="col">Ano de Referência</th>
        </tr>
        </thead>`);
        tabela += (`<tbody>`);

        let j = 0;
        for (let i = 0; i < json.length; i++) {
          if (json[i].cod_lote == meuLote) {
            listaReajuste[j] = json[i];
            j++;
          }
        }

        for (i = 0; i < listaReajuste.length; i++) {

          //salva os valores para edição
          meuAno[i] = listaReajuste[i]["ano_ref"];

          //cria json para edição
          edicaoReajuste[i] = {
            "percentual": "",
          };

          //captura itens para tabela
          tabela += (`<tr>`);
          tabela += (`<td>`);
          tabela += listaReajuste[i]["ano_ref"];
          tabela += (`</td><td>`);
          tabela += (`<input value="` + listaReajuste[i]["percentual"] + `" onchange="mudaReajuste(` + i + `)" id="percentual` + i + `" type="number">`) + "%";
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