//pega o token do login
let meuToken = localStorage.getItem("token");

//pega o CNPJ escolhido anteriormente
let meuLote = localStorage.getItem("cod_lote");
let edicaoItem = [];
let listaItem = [];
let meuItem = [],
  meuTipo = [];

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

  reajuste();
  //captura o codigo do lote para usar como chave na edição
  let a = document.getElementById("cod_lote");
  a.value = meuLote;

  fetch('http://localhost:8080/read/entidade', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //checar o status do pedido
    //console.log(response);

    //tratamento dos erros
    if (response.status == 200) {
      response.json().then(function (json) {
        //console.log(json);
        let x = [];
        for (i = 0; i < json.length; i++) {
          x[i] += "<option>" + json[i].cnpj + "</option>";
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

  //estes campos precisam de adaptações para serem aceitos como yyyy-MM-dd

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

  //transforma as informações do token em json
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

  //função fetch para chamar itens da tabela
  fetch('http://localhost:8080/read/loteitens', {
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
                <th scope="col">Valor</th>
                </tr>
                </thead>`);
        tabela += (`<tbody>`);

        let j = 0;
        //cria uma lista apenas com os itens do lote selecionado
        for (let i = 0; i < json.length; i++) {
          if (json[i]["cod_lote"] == meuLote) {
            listaItem[j] = json[i];
            j++;
          }
        }
        for (i = 0; i < listaItem.length; i++) {
          tabela += (`<tr>`);
          meuItem[i] = listaItem[i]["cod_item"];
          meuTipo[i] = listaItem[i]["cod_tipo_item"];
          tabela += (`<td id="preco` + i + `">`);
          tabela += listaItem[i]["preco"];
          tabela += (`</td>`);
          tabela += (`</tr>`);
        }
        tabela += (`</tbody>`);
        document.getElementById("tabela").innerHTML = tabela;

        //cria o botão para editar
        document.getElementById("editar").innerHTML = (`<button id="editar" onclick="editarItem()" class="btn btn-success">Editar</button>`);

      });
    } else {
      erros(response.status);
    }
  });
}


function descricao(codItem,codTipo){
  //função fetch para chamar itens da tabela
  fetch('http://localhost:8080/read/itens' + codItem + '/' + codTipo, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 200) {
      console.log(response.statusText);

      //pegar o json que possui a tabela
      response.json().then(function (json) {
        console.log(json.descricao);
        return json.descricao;
      });
    } else {
      erros(response.status);
    }
  });
}


function editarItem() {
  for (let i = 0; i < listaItem.length; i++) {
    edicaoItem[i] = {
      "preco": "&",
    };

    document.getElementById("preco" + i).innerHTML = `<input type="number" id="preco" onchange="edicaoItem[` + i + `].preco=parseFloat(this.value);">`;

  }
  document.getElementById("editar").innerHTML = (`<button id="editar" onclick="editarItem2()" class="btn btn-success">Salvar</button>`);
}

function editarItem2() {
  for (let i = 0; i < listaItem.length; i++) {
    if(edicaoItem[i].preco!="&"){
      //transforma as informações do token em json
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
          alert("Valor alterado com sucesso");
          itens();
        } else {
          erros(response.status);
        }
      });
    }
  }

      //captura as descrições necessárias
      //função fetch para mandar
      fetch('http://localhost:8080/read/loteitens/' + meuLote + '/' + meuItem[i] + '/' + meuTipo[i], {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + meuToken
        },
      }).then(function (response) {
        //checar o status do pedido
        //console.log(response.statusText);

        //tratamento dos erros
        if (response.status == 200 || response.status == 201) {
          
        } else {
          erros(response.status);
        }
      });
}



//lote reajustes



function reajuste() {
  
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
                <th style="width:45%" scope="col">Percentual de Reajuste</th>
                <th style="width:45%" scope="col">Ano de Referência</th>
                <th style="width:10%" scope="col">Ações</th>
                </tr>
                </thead>`);
        tabela += (`<tbody>`);
        let listaReajuste = [],j=0,i;
        
        for(i=0;i<json.length;i++){
          if(json[i].cod_lote==meuLote){
            listaReajuste[j]=json[i];
          }
        }
        for (i = 0; i < listaReajuste.length; i++) {
          tabela += (`<tr><td>`);
          tabela += listaReajuste[i]["percentual"];
          tabela += (`</td><td>`);
          tabela += listaReajuste[i]["ano_ref"];
          tabela += (`</td> <td> 
                <span class="d-flex">
                <button onclick="editarEntidade(` + i + `)" class="btn btn-success">
                <i class="material-icons"data-toggle="tooltip" title="Edit">&#xE254;</i>
                </button>
                <button onclick="apagarEntidade(` + i + `)" class="btn btn-danger">
                <i class="material-icons"data-toggle="tooltip" title="Delete">&#xE872;</i>
                </button>
                </span> </td>`);
          tabela += (`</tr> <tr>`);
        }
        tabela += (`</tbody>`);
        document.getElementById("tabela").innerHTML = tabela;

        //cria o botão para editar
        document.getElementById("editar").innerHTML = (`<button id="editar" onclick="editarItem()" class="btn btn-success">Editar</button>`);

      });
    } else {
      erros(response.status);
    }
  });
}

// function editarItem() {
//   for (let i = 0; i < listaItem.length; i++) {
//     edicaoItem[i] = {
//       "preco": "&",
//     };

//     document.getElementById("preco" + i).innerHTML = `<input type="number" id="preco" onchange="edicaoItem[` + i + `].preco=parseFloat(this.value);">`;

//   }
//   document.getElementById("editar").innerHTML = (`<button id="editar" onclick="editarItem2()" class="btn btn-success">Salvar</button>`);
// }

// function editarItem2() {
//   for (let i = 0; i < listaItem.length; i++) {
//     if(edicaoItem[i].preco!="&"){
//       //transforma as informações do token em json
//       let corpo = JSON.stringify(edicaoItem[i]);
//       //função fetch para mandar
//       fetch('http://localhost:8080/read/loteitens/' + meuLote + '/' + meuItem[i] + '/' + meuTipo[i], {
//         method: 'PUT',
//         body: corpo,
//         headers: {
//           'Authorization': 'Bearer ' + meuToken
//         },
//       }).then(function (response) {

//         //checar o status do pedido
//         //console.log(response.statusText);

//         //tratamento dos erros
//         if (response.status == 200 || response.status == 201) {
//           //checar a resposta do pedido
//           //console.log(json);
//           alert("Valor alterado com sucesso");
//           itens();
//         } else {
//           //erros(response.status);
//         }
//       });
//     }
//   }
// }