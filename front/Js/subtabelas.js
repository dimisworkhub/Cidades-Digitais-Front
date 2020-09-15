//variavel usada nas subtabelas:
let listaFinal = [];

//tabela pra previsão de empenho:

function previsaoSub(valorCodigo) {

  document.getElementById("editar").innerHTML = (`<br>`);
  document.getElementById("editar2").innerHTML = (`<br>`);

  //função fetch para chamar os itens de previsão da tabela
  fetch(servidor + 'read/previsaoempenho', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 200) {

      //pegar o json que possui a tabela
      response.json().then(function (json) {

        //console.log(json);

        let tabela = (`<thead style="background: #4b5366; color:white; font-size:15px">
          <tr>
          <th style="width:25%" scope="col">Previsão de Empenho</th>
          <th style="width:40%" scope="col">Natureza da despesa</th>
          <th style="width:10%" scope="col">Tipo</th>
          <th style="width:10%" scope="col">Data</th>
          <th style="width:15%" scope="col">Ano de Referência</th>
          </tr>
          </thead>`);
        tabela += (`<tbody>`);

        let j = 0;
        for (let i = 0; i < json.length; i++) {

          //valorCodigo define se é no html de Lote (1), de Cidades Digitais (2)
          if (valorCodigo == '1') {
            if (meuCodigo == json[i]["cod_lote"]) {
              listaFinal[j] = json[i];
              j++;
            }
          } else if (valorCodigo == '2') {
            if (meuLote == json[i]["cod_lote"]) {
              listaFinal[j] = json[i];
              j++;
            }
          }
        }

        for (i = 0; i < listaFinal.length; i++) {
          //captura itens para tabela
          tabela += (`<tr style="cursor:pointer" id="linha` + i + `" onmouseover="sublinhar(` + i + "," + json.length + `)" onclick="redirecionar(` + i + "," + "'previsao'" + `)">`);
          tabela += (`<td>`);
          tabela += listaFinal[i]["cod_previsao_empenho"];
          tabela += (`</td><td>`);
          tabela += listaFinal[i]["natureza_despesa"];
          tabela += (`</td><td>`);
          if (listaFinal[i]["tipo"] == "o") {
            tabela += "Original";
          } else {
            tabela += "Reajuste";
          }
          tabela += (`</td><td class="data">`);

          mascara();

          tabela += arrumaData(listaFinal[i]["data"]);
          tabela += (`</td><td>`);
          tabela += listaFinal[i]["ano_referencia"];
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

//tabela pra empenho:

function empenhoSub(valorCodigo) {

  document.getElementById("editar").innerHTML = (`<br>`);
  document.getElementById("editar2").innerHTML = (`<br>`);

  //filtro de subtabelas pelo codigo escolhido (1 para previsao, 2 para lote, 3 para cidades digitais)
  let caminhoEmpenho;

  if (valorCodigo == '1') {
    caminhoEmpenho = 'read/empenhocodprevisaoempenho/' + meuCodigo;
  } else {
    caminhoEmpenho = 'read/empenho';
  }

  //função fetch para chamar os itens de empenho da tabela
  fetch(servidor + caminhoEmpenho, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 200) {

      //pegar o json que possui a tabela
      response.json().then(function (json) {

        //console.log(json);

        let tabela = "";
        if (valorCodigo == '1') {
          tabela += (`<thead style="background: #4b5366; color:white; font-size:15px">
            <tr>
            <th style="width:50%" scope="col">Código de Empenho</th>
            <th style="width:50%" scope="col">Data</th>
            </tr>
            </thead>`);
        }

        //caso não seja em previsão
        else if (valorCodigo == '2' || valorCodigo == '3') {
          tabela += (`<thead style="background: #4b5366; color:white; font-size:15px">
            <tr>
            <th style="width:20%" scope="col">Código de Empenho</th>
            <th style="width:40%" scope="col">Natureza de Despesa</th>
            <th style="width:15%" scope="col">Tipo</th>
            <th style="width:25%" scope="col">Data</th>
            </tr>
            </thead>`);
        }
        tabela += (`<tbody>`);

        let j = 0;
        for (let i = 0; i < json.length; i++) {

          if (valorCodigo == '1') {
            if (meuCodigo == json[i]["cod_previsao_empenho"]) {
              listaFinal[j] = json[i];
              j++;
            }
          } else if (valorCodigo == '2') {
            if (meuCodigo == json[i]["cod_lote"]) {
              listaFinal[j] = json[i];
              j++;
            }
          } else if (valorCodigo == '3') {
            if (meuLote == json[i]["cod_lote"]) {
              listaFinal[j] = json[i];
              j++;
            }
          }

          //else if feito assim para pegar o valor do i na tabela normal
          else if (json[i]["cod_empenho"] == listaItem[valorUsado]["cod_empenho"]) {
            localStorage.setItem("id_empenho", json[i].id_empenho);
            localStorage.setItem("cod_empenho", json[i].cod_empenho);
            localStorage.setItem("cod_lote", json[i].cod_lote);
            localStorage.setItem("cod_previsao_empenho", json[i].cod_previsao_empenho);
            localStorage.setItem("cod_natureza_despesa", json[i].cod_natureza_despesa);
            localStorage.setItem("descricao", json[i].descricao);
            localStorage.setItem("tipo", json[i].tipo);
            localStorage.setItem("data", json[i].data);
            window.location.href = "./gerenciaEmpenho.html";
          }
        }

        for (i = 0; i < listaFinal.length; i++) {
          //captura itens para tabela
          tabela += (`<tr style="cursor:pointer" id="linha` + i + `" onmouseover="sublinhar(` + i + "," + json.length + `)" onclick="redirecionar(` + i + "," + "'empenho'" + `)">`);
          tabela += (`<td>`);
          tabela += listaFinal[i]["cod_empenho"];
          tabela += (`</td>`);

          //caso não seja em previsão
          if (valorCodigo == '2' || valorCodigo == '3') {
            tabela += (`<td>`);
            tabela += listaFinal[i]["cod_natureza_despesa"] + " - " + listaFinal[i]["descricao"];
            tabela += (`</td>`);
            tabela += (`<td>`);
            if (listaFinal[i]["tipo"] == "o") {
              tabela += "Original";
            } else {
              tabela += "Reajuste";
            }
            tabela += (`</td>`);
          }

          tabela += (`<td class="data">`);

          mascara();

          tabela += arrumaData(listaFinal[i]["data"]);
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

//tabela pra fatura:

function faturaSub(valorCodigo) {

  document.getElementById("editar").innerHTML = (`<br>`);
  document.getElementById("editar2").innerHTML = (`<br>`);

  //filtro de subtabelas pelo codigo escolhido (1 para empenho, 2 para CD)
  let caminhoFatura;

  if (valorCodigo == '1') {
    caminhoFatura = 'read/fatura/' + meuCodigo;
  }

  //caso não seja em empenho
  else if (valorCodigo == '2') {
    caminhoFatura = 'read/fatura';
  }

  //função fetch para chamar os itens de previsão da tabela
  fetch(servidor + caminhoFatura, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 200) {

      //pegar o json que possui a tabela
      response.json().then(function (json) {

        //console.log(json);

        let tabela = (`<thead style="background: #4b5366; color:white; font-size:15px">
          <tr>
          <th style="width:20%" scope="col">Código de Fatura</th>
          <th style="width:50%" scope="col">Município</th>
          <th style="width:30%" scope="col">Data</th>
          </tr>
          </thead>`);
        tabela += (`<tbody>`);

        let j = 0;
        for (let i = 0; i < json.length; i++) {
          listaFinal[j] = json[i];
          j++;
        }

        for (i = 0; i < listaFinal.length; i++) {
          //captura itens para tabela
          tabela += (`<tr style="cursor:pointer" id="linha` + i + `" onmouseover="sublinhar(` + i + "," + json.length + `)" onclick="redirecionar(` + i + "," + "'fatura'" + `)">`);
          tabela += (`<td>`);
          tabela += listaFinal[i]["num_nf"];
          tabela += (`</td><td>`);
          tabela += listaFinal[i]["nome_municipio"] + " - " + listaFinal[i]["uf"] + " - " + listaFinal[i]["cod_ibge"];

          tabela += (`</td><td class="data">`);

          mascara();

          tabela += arrumaData(listaFinal[i]["data"]);
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

//tabela pra pagamento:

function pagamentoSub(valorCodigo) {

  document.getElementById("editar").innerHTML = (`<br>`);
  document.getElementById("editar2").innerHTML = (`<br>`);

  //função fetch para chamar os itens de previsão da tabela
  fetch(servidor + 'read/otb', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 200) {

      //pegar o json que possui a tabela
      response.json().then(function (json) {

        //console.log(json);

        let tabela = (`<thead style="background: #4b5366; color:white; font-size:15px">
          <tr>
          <th style="width:50%" scope="col">Código de Pagamento</th>
          <th style="width:50%" scope="col">Data de Pagamento</th>
          </tr>
          </thead>`);
        tabela += (`<tbody>`);

        let j = 0;
        for (let i = 0; i < json.length; i++) {
          //filtro ainda sera alterado quando for criado
          //  if (valorCodigo == json[i]["num_nf"]) {
          listaFinal[j] = json[i];
          j++;
          //  }
        }

        for (i = 0; i < listaFinal.length; i++) {
          //captura itens para tabela
          tabela += (`<tr style="cursor:pointer" id="linha` + i + `" onmouseover="sublinhar(` + i + "," + json.length + `)" onclick="redirecionar(` + i + "," + "'pagamento'" + `)">`);
          tabela += (`<td>`);
          tabela += listaFinal[i]["cod_otb"];
          tabela += (`</td><td>`);
          tabela += listaFinal[i]["dt_pgto"];
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



//usado apenas caso seja necessário pegar empenho de itens fatura
let valorUsado;

//função necessaria para o funcionamento dos links nas subtabelas
function redirecionar(valor, caminhoRedirect) {
  console.log("chega aqui");
  if (caminhoRedirect == "previsao") {
    localStorage.setItem("cod_previsao_empenho", listaFinal[valor].cod_previsao_empenho);
    localStorage.setItem("cod_lote", listaFinal[valor].cod_lote);
    localStorage.setItem("data", listaFinal[valor].data);
    localStorage.setItem("tipo", listaFinal[valor].tipo);
    localStorage.setItem("ano_referencia", listaFinal[valor].ano_referencia);

    //para mostrar a descrição
    localStorage.setItem("natureza_despesa", listaFinal[valor].natureza_despesa);
    window.location.href = "./gerenciaPrevisao.html";
  } else if (caminhoRedirect == "empenho") {
    localStorage.setItem("id_empenho", listaFinal[valor].id_empenho);
    localStorage.setItem("cod_empenho", listaFinal[valor].cod_empenho);
    localStorage.setItem("cod_lote", meuCodigoSec);
    localStorage.setItem("cod_previsao_empenho", meuCodigo);
    localStorage.setItem("cod_natureza_despesa", listaFinal[valor].cod_natureza_despesa);
    localStorage.setItem("descricao", listaFinal[valor].descricao);
    localStorage.setItem("tipo", listaFinal[valor].tipo);
    localStorage.setItem("data", listaFinal[valor].data);
    window.location.href = "./gerenciaEmpenho.html";
  } else if (caminhoRedirect == "fatura") {
    localStorage.setItem("num_nf", listaFinal[valor]["num_nf"]);
    localStorage.setItem("cod_ibge", listaFinal[valor]["cod_ibge"]);
    localStorage.setItem("dt_nf", listaFinal[valor]["dt_nf"]);
    localStorage.setItem("uf", listaFinal[valor]["uf"]);
    localStorage.setItem("nome_municipio", listaFinal[valor]["nome_municipio"]);
    window.location.href = "./gerenciaFatura.html";

  } else if (caminhoRedirect == "pagamento") {
    localStorage.setItem("cod_otb", listaFinal[valor]["cod_otb"]);
    localStorage.setItem("dt_pgto", listaFinal[valor]["dt_pgto"]);
    window.location.href = "./gerenciaPagamento.html";
  }
  //caso especial da função empenho
  else if (caminhoRedirect == "empItensFatura") {
    //valores usados no caso especial
    valorUsado = valor;
    empenhoSub("0");
  }
}

//função decorativa para facilitar a vizualização do link
function sublinhar(valor, tamanho) {
  for (i = 0; i < tamanho; i++) {
    if (i == valor) {
      document.getElementById("linha" + i).style.color = "blue";
      document.getElementById("linha" + i).style.textDecoration = "underline";
    } else {
      document.getElementById("linha" + i).style.color = "black";
      document.getElementById("linha" + i).style.textDecoration = "none";
    }
  }
}

//para empenho em itensfatura
function sublinhar2(valor, tamanho) {
  for (i = 0; i < tamanho; i++) {
    if (i == valor) {
      document.getElementById("empenho" + i).style.color = "blue";
      document.getElementById("empenho" + i).style.textDecoration = "underline";
    } else {
      document.getElementById("empenho" + i).style.color = "black";
      document.getElementById("empenho" + i).style.textDecoration = "none";
    }
  }
}



//variaveis comuns de itens:

let listaItem = [],
  meuItem = [],
  meuTipo = [],
  edicaoItem = [],
  itemMudado = [];

let caminhoFinal;



//lote itens

function itensLote() {

  //cria o botão para editar
  document.getElementById("editar").innerHTML = (`<button id="editar" onclick="editarItemLote()" class="btn btn-success">Salvar Alterações</button>`);
  document.getElementById("editar2").innerHTML = (`<button id="editar" onclick="editarItemLote()" class="btn btn-success">Salvar Alterações</button>`);

  //função fetch para chamar itens da tabela
  fetch(servidor + 'read/loteitens', {
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
          if (json[i]["cod_lote"] == meuCodigo) {
            listaItem[j] = json[i];
            j++;
          }
        }

        //cria o cabeçalho da tabela
        let tabela = (`<thead style="background: #4b5366; color:white; font-size:15px">
                <tr>
                <th style="width:50%" scope="col">Descrição</th>
                <th style="width:50%" scope="col">Valor</th>
                </tr>
                </thead>`);
        tabela += (`<tbody>`);

        for (i = 0; i < listaItem.length; i++) {

          //salva os valores para edição
          meuItem[i] = listaItem[i]["cod_item"];
          meuTipo[i] = listaItem[i]["cod_tipo_item"];

          //captura itens para tabela
          tabela += (`<tr>`);
          tabela += (`<td>`);
          tabela += listaItem[i]["cod_item"] + "." + listaItem[i]["cod_tipo_item"] + " - " + listaItem[i]["descricao"];
          tabela += (`</td> <td>`);
          tabela += (`<input value="` + (listaItem[i]["preco"] * 100) + `" id="preco` + i + `" type="text" class="preco" size="50">`);
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

function editarItemLote() {

  for (i = 0; i < listaItem.length; i++) {

    //cria json para edição
    //função splitPreco é usada aqui dentro
    edicaoItem[i] = {
      "preco": parseFloat(mascaraQuebrados(document.getElementById("preco" + i).value)),
    };

    if (listaItem[i]["preco"] != edicaoItem[i]["preco"]) {
      //transforma as informações em string para mandar
      let corpo = JSON.stringify(edicaoItem[i]);
      //console.log(corpo);

      //função fetch para mandar
      fetch(servidor + 'read/loteitens/' + meuCodigo + '/' + meuItem[i] + '/' + meuTipo[i], {
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
          location.reload();
        } else {
          erros(response.status);
        }
      });
    }
  }
}



//CD Itens

function itensCD() {

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





//Itens de fiscalizacao

//caso itensfatura seja o selecionado
let meuEmpenho = [];

function itensFiscalizacao(caminho) {

  if (caminho == "itensfatura") {
    //cria o botão para editar
    document.getElementById("editar").innerHTML = (`<button class="btn btn-success" onclick="editarItem('` + caminho + `')">Salvar Alterações em Itens</button> <button class="btn btn-success" data-toggle="modal" data-target="#adicionarItensFatura">Novo Item Fatura</button>`);
    document.getElementById("editar2").innerHTML = (`<button class="btn btn-success" onclick="editarItem('` + caminho + `')">Salvar Alterações em Itens</button>`);
  } else {
    //cria o botão para editar
    document.getElementById("editar").innerHTML = (`<button class="btn btn-success" onclick="editarItem('` + caminho + `')">Salvar Alterações em Itens</button>`);
    document.getElementById("editar2").innerHTML = (`<button class="btn btn-success" onclick="editarItem('` + caminho + `')">Salvar Alterações em Itens</button>`);
  }

  //função fetch para chamar itens da tabela
  fetch(servidor + 'read/' + caminho + "/" + meuCodigo + "/" + meuCodigoSec, {
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

        //testar o json
        //console.log(json);

        let tabela = "";

        //armazenando para edição
        listaItem = json;

        //mudanças feitas para fatura funcionar
        if (caminho == "itensfatura") {
          tabela = (`<thead style="background: #4b5366; color:white; font-size:15px">
          <tr>
          <th style="width:30%" scope="col">Descrição</th>
          <th style="width:10%" scope="col">Empenho</th>
          <th style="cursor:pointer;width:10%" onclick="descricaoItem('Tipo')" scope="col">Tipo</th>
          <th style="cursor:pointer;width:5%" onclick="descricaoItem('Quantidade disponível')" scope="col">Quantidade Disponível</th>
          <th style="cursor:pointer;width:5%" onclick="descricaoItem('Quantidade')" scope="col">Quantidade</th>
          <th style="cursor:pointer;width:20%" onclick="descricaoItem('Valor')" scope="col">Valor</th>
          <th style="cursor:pointer;width:20%" onclick="descricaoItem('Subtotal')" scope="col">Subtotal</th>
          </tr>
          </thead>`);
        } else {
          tabela = (`<thead style="background: #4b5366; color:white; font-size:15px">
          <tr>
          <th style="width:50%" scope="col">Descrição</th>
          <th style="cursor:pointer;width:5%" onclick="descricaoItem('Quantidade disponível')" scope="col">Quantidade Disponível</th>
          <th style="cursor:pointer;width:5%" onclick="descricaoItem('Quantidade')"  scope="col">Quantidade</th>
          <th style="cursor:pointer;width:20%" onclick="descricaoItem('Valor')" scope="col">Valor</th>
          <th style="cursor:pointer;width:20%" onclick="descricaoItem('Subtotal')" scope="col">Subtotal</th>
          </tr>
          </thead>`);
        }

        //calculo do total dos valores de cada linha
        let total = 0;
        let totalFinal = 0;

        //criando corpo da tabela
        tabela += (`<tbody>`);

        for (i = 0; i < listaItem.length; i++) {
          //salva os valores para edição
          meuTipo[i] = listaItem[i]["cod_tipo_item"];
          meuItem[i] = listaItem[i]["cod_item"];

          tabela += (`<tr>`);
          tabela += (`<td>`);
          tabela += listaItem[i]["cod_tipo_item"] + '.' + listaItem[i]["cod_item"] + ' - ' + listaItem[i]["descricao"];

          //apenas para fatura
          if (caminho == "itensfatura") {
            meuEmpenho[i] = listaItem[i]["id_empenho"];

            //coluna especial de empenho
            tabela += (`</td> <td id="empenho` + i + `" style="cursor:pointer" onclick="redirecionar(` + i + "," + "'empItensFatura'" + `)" onmouseover="sublinhar2(` + i + "," + listaItem.length + `)">`);
            tabela += listaItem[i]["cod_empenho"];
            tabela += (`</td><td>`);

            if (listaItem[i]["tipo"] == "o") {
              tabela += "Original";
            } else {
              tabela += "Reajuste";
            }
          }

          tabela += (`</td> <td>`);
          tabela += listaItem[i]["quantidade_disponivel"];
          tabela += (`</td> <td>`);
          tabela += (`<input value="` + listaItem[i]["quantidade"] * 100 + `" class="quebrados" id="quantidade` + i + `" onchange="checarQuantidade(` + i + `)" type="text" size="10" style="text-align: right;"></input>`);
          tabela += (`</td> <td>`);
          tabela += (`<input value="` + listaItem[i]["valor"] * 100 + `" class="preco" id="valor` + i + `" type="text" size="15" style="text-align: right;"></input>`);
          tabela += (`</td> <td class="preco">`);

          //calculo do subtotal
          //multiplicado por 100 porque a máscara foi feita com base em preencher as centenas primeiro
          total = (listaItem[i]["quantidade"] * listaItem[i]["valor"]);
          totalFinal = totalFinal + total;

          tabela += arredondamento(total);
          tabela += (`</td>`);
          tabela += (`</tr>`);
        }

        //a parte final da tabela é organizada de forma diferente.
        tabela += (`<tr>`);
        tabela += (`<td>`);
        tabela += (`<p> Total: </p>`);
        tabela += (`</td>`);

        //espaços
        tabela += (`<td>`);
        tabela += (`</td>`);
        tabela += (`<td>`);
        tabela += (`</td>`);
        tabela += (`<td>`);
        tabela += (`</td>`);

        //espaços extras para fatura
        if (caminho == "itensfatura") {
          tabela += (`<td>`);
          tabela += (`</td>`);
          tabela += (`<td>`);
          tabela += (`</td>`);
        }

        //valor final
        tabela += (`<td class="preco">`);
        tabela += arredondamento(totalFinal);
        tabela += (`</td>`);

        tabela += (`</tr>`);
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

function descricaoItem(valor) {
  $("#descricaoItem").modal({
    show: true
  });

  descricaoItem2(valor);
}

function descricaoItem2(itemDescrito) {

  //frase inicial
  document.getElementById("explicacao").innerHTML = itemDescrito;

  //calculos para cada caso
  if (itemDescrito == "Subtotal") {
    document.getElementById("calculo").innerHTML = "Quantidade x Valor = " + itemDescrito;
  } else {
    document.getElementById("calculo").innerHTML = "misterio";
  }

}

function checarQuantidade(valor){

  if (mascaraQuebrados(document.getElementById("quantidade" + valor).value) > (listaItem[valor].quantidade_disponivel + listaItem[valor].quantidade)) {

    //Alerta inteligente que necessita de uma confirmação para continuar
    Swal.fire({
      title: 'Tem certeza?',
      text: "A Quantidade inserida no item " + listaItem[valor].cod_tipo_item + "." + listaItem[valor].cod_item + " é maior que a Quantidade Disponível!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, tenho certeza!'
    }).then((result) => {
      
      if (result.value) {

        Swal.fire(
          'Sucesso!',
          'Item foi inserido!',
          'success'
        )

      } else {

        document.getElementById("quantidade" + valor).value = listaItem[valor].quantidade;

        Swal.fire(
          'Cancelado!',
          'O item não foi inserido!',
          'error'
        )

      }
    });

  }
}

function editarItem(caminho) {

  for (let i = 0; i < listaItem.length; i++) {

    //identifica se o item foi alterado
    if (listaItem[i]["quantidade"] != mascaraQuebrados(document.getElementById("quantidade" + i).value) || listaItem[i]["valor"] != mascaraQuebrados(document.getElementById("valor" + i).value)) {

      //itens fatura precisa de um caminho especial
      if (caminho == "itensfatura") {
        caminhoFinal = servidor + 'read/' + caminho + '/' + meuCodigo + '/' + meuCodigoSec + '/' + meuEmpenho[i] + '/' + meuItem[i] + '/' + meuTipo[i];
      } else {
        caminhoFinal = servidor + 'read/' + caminho + '/' + meuCodigo + '/' + meuItem[i] + '/' + meuTipo[i];
      }

      //Para os casos especificos em tipos de item 8,9 e 10. Validos apenas em itens de 1 a 5 e de fatura ou previsão.
      //preciso ajustar para ficar bom (talvez o thiago queira que eu acople)
      // if (listaItem[i].cod_tipo_item >= "8" && listaItem[i].cod_tipo_item <= "10" && (caminho == "itensfatura" || caminho == "itensprevisao") && listaItem[i].tipo == "o") {

      //   //valor de limite
      //   //utiliza os valores atualizados
      //   let valorMax = listaItem[i].quantidade_disponivel * edicaoItem[i].valor;

      //   //processo para pegar os outros valores:
      //   let valorSoma = "";
      //   for (let j = 0; j < listaItem.length; j++) {
      //     //garantindo ser um dos valores com mesmo item e do mesmo grupo de tipos
      //     if (listaItem[i].cod_tipo_item >= "8" && listaItem[i].cod_tipo_item <= "10" && listaItem[j].cod_item == listaItem[i].cod_item) {

      //       valorSoma = (mascaraQuebrados(document.getElementById("valor" + i).value) * mascaraQuebrados(document.getElementById("quantidade" + i).value)) + valorSoma;

      //     }
      //   }

      //   if (valorMax < valorSoma) {
      //     alert("Há um problema no item " + listaItem[i].cod_tipo_item + "." + listaItem[i].cod_item + ". Ele está ultrapassando o limite do seu grupo.");
      //   }

      // }

      //independente do alerta
      
      edicaoItem[i] = {
        "quantidade": parseFloat(mascaraQuebrados(document.getElementById("quantidade" + i).value)),
        "valor": parseFloat(mascaraQuebrados(document.getElementById("valor" + i).value)),
      };

      //transforma as informações do token em json
      corpo = JSON.stringify(edicaoItem[i]);

      //função fetch para mandar
      fetch(caminhoFinal, {
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
          //console.log(corpo + " OK");
        } else {
          erros(response.status);
        }
      });
    }

  }

  location.reload();

}