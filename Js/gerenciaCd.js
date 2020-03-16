//pega o token do login
let meuToken = localStorage.getItem("token");

//pega o CNPJ escolhido anteriormente
let meuCD = localStorage.getItem("cod_ibge");
let meuMunicipio = localStorage.getItem("nome_municipio");
let meuUF = localStorage.getItem("uf");
document.getElementById("nome_municipio").value = meuMunicipio + " - " + meuUF;

//estruturas para as tabelas
let listaItem = [];
let meuItem = [],
  meuTipo = [];
let edicaoItem = [];
let itemMudado = [];

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
  "cod_ibge": " ",
  "cod_lote": " ",
  "os_pe": " ",
  "data_pe": " ",
  "os_imp": " ",
  "data_imp": " "
};

//cria variaveis para mudar os valores
let lote1 = document.getElementById("cod_lote");
let os_pe1 = document.getElementById("os_pe");
os_pe1.value = localStorage.getItem("os_pe");
let os_imp1 = document.getElementById("os_imp");
os_imp1.value = localStorage.getItem("os_imp");

//estes campos precisam de adaptações para serem aceitos como yyyy-MM-dd

let data_pe1 = document.getElementById("data_pe");
let data_imp1 = document.getElementById("data_imp");

let data1 = new Date(localStorage.getItem("data_pe"));
let data2 = new Date(localStorage.getItem("data_imp"));

let dataFinal1 = String(data1.getFullYear()).padStart(4, '0') + "-" + String(data1.getMonth() + 1).padStart(2, '0') + "-" + String(data1.getDate()).padStart(2, '0');
let dataFinal2 = String(data2.getFullYear()).padStart(4, '0') + "-" + String(data2.getMonth() + 1).padStart(2, '0') + "-" + String(data2.getDate()).padStart(2, '0');

data_pe1.value = dataFinal1;
data_imp1.value = dataFinal2;

window.onload = function () {

  itens();
  //preenche os cod_lotes
  fetch('http://localhost:8080/read/lote', {
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
        for (i = 0; i < json.length; i++) {
          x[i] += "<option>" + json[i].cod_lote + "</option>";
        }
        x.sort();
        document.getElementById("cod_lote").innerHTML = x;

        lote1.value = localStorage.getItem("cod_lote");
      });
    } else {
      erros(response.status);
    }
  });
}


function enviar() {

  info.cod_ibge = parseInt(meuCD);
  let lote1 = document.getElementById("cod_lote");
  info.cod_lote = parseInt(lote1.value);
  let os_pe1 = document.getElementById("os_pe");
  info.os_pe = os_pe1.value;
  let d = document.getElementById("data_pe");
  info.data_pe = d.value;
  let e = document.getElementById("os_imp");
  info.os_imp = e.value;
  let f = document.getElementById("data_imp");
  info.data_imp = f.value;

  //transforma as informações do token em json
  let corpo = JSON.stringify(info);
  //função fetch para mandar
  fetch('http://localhost:8080/read/cd/' + meuCD, {
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
  document.getElementById("editar").innerHTML = (`<button id="editar" onclick="editarItem()" class="btn btn-success">Editar</button>`);
  document.getElementById("editar2").innerHTML = (`<button id="editar" onclick="editarItem()" class="btn btn-success">Editar</button>`);

  //função fetch para chamar itens da tabela
  fetch('http://localhost:8080/read/cditens', {
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
                <th scope="col">Código do item</th>
                <th scope="col">Código do tipo de item</th>
                <th scope="col">Quantidade prevista</th>
                <th scope="col">Quantidade do projeto executivo</th>
                <th scope="col">Quantidade de termo de instalação </th>
                </tr>
                </thead>`);
        tabela += (`<tbody>`);

        //cria uma lista apenas com os itens do lote selecionado
        let j = 0;
        for (let i = 0; i < json.length; i++) {
          if (json[i]["cod_ibge"] == meuCD) {
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
          tabela += listaItem[i]["cod_item"];
          tabela += (`</td> <td>`);
          tabela += listaItem[i]["cod_tipo_item"];
          tabela += (`</td> <td>`);
          tabela += (`<input value="` + listaItem[i]["quantidade_previsto"] + `" onchange="mudaItem(` + i + `)" id="quantidade_previsto` + i + `" type="text">`);
          tabela += (`</td> <td>`);
          tabela += (`<input value="` + listaItem[i]["quantidade_projeto_executivo"] + `" onchange="mudaItem(` + i + `)" id="quantidade_projeto_executivo` + i + `" type="text">`);
          tabela += (`</td> <td>`);
          tabela += (`<input value="` + listaItem[i]["quantidade_termo_instalacao"] + `" onchange="mudaItem(` + i + `)" id="quantidade_termo_instalacao` + i + `" type="text">`);
          tabela += (`</td>`);
          tabela += (`</tr>`);

          edicaoItem[i] = {
            "quantidade_previsto": listaItem[i]["quantidade_previsto"],
            "quantidade_projeto_executivo": listaItem[i]["quantidade_projeto_executivo"],
            "quantidade_termo_instalacao": listaItem[i]["quantidade_termo_instalacao"],
          };
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
  edicaoItem[valor].quantidade_previsto = parseInt(document.getElementById("quantidade_previsto" + valor).value);
  edicaoItem[valor].quantidade_projeto_executivo = parseInt(document.getElementById("quantidade_projeto_executivo" + valor).value);
  edicaoItem[valor].quantidade_termo_instalacao = parseInt(document.getElementById("quantidade_termo_instalacao" + valor).value);
  itemMudado[valor] = valor;
}

function editarItem() {

  for (let i = 0; i < listaItem.length; i++) {

    if (itemMudado[i]!=null) {
      //transforma as informações do token em json
      let corpo = JSON.stringify(edicaoItem[i]);
      //função fetch para mandar
      fetch('http://localhost:8080/read/cditens/' + meuCD + '/' + meuItem[i] + '/' + meuTipo[i], {
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
        } else {
          //erros(response.status);
        }
        window.location.replace("./gerenciaCd.html");
      });
    }
  }

}