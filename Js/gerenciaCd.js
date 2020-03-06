//pega o token do login
let meuToken = localStorage.getItem("token");

//pega o CNPJ escolhido anteriormente
let meuCD = localStorage.getItem("cod_ibge");
document.getElementById("cod_ibge").value=meuCD;

//estruturas para as tabelas
let listaItem = [];
let meuItem = [], meuTipo = []; 
let edicaoItem1 = [],edicaoItem2 = [],edicaoItem3 = [];
document.getElementById("cod_ibge").value=meuCD;

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

  let dataFinal1 = String(data1.getFullYear()).padStart(4, '0') + "-" + String(data1.getMonth()+1).padStart(2, '0') + "-" + String(data1.getDate()).padStart(2, '0');
  let dataFinal2 = String(data2.getFullYear()).padStart(4, '0') + "-" + String(data2.getMonth()+1).padStart(2, '0') + "-" + String(data2.getDate()).padStart(2, '0');
  
  data_pe1.value = dataFinal1;
  data_imp1.value = dataFinal2;

window.onload = function () {
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
                <th scope="col">Código do IBGE</th>
                <th scope="col">Código do item</th>
                <th scope="col">Código do tipo de item</th>
                <th scope="col">Quantidade prevista</th>
                <th scope="col">Quantidade do projeto executivo</th>
                <th scope="col">Quantidade de termo de instalação </th>
                </tr>
                </thead>`);
        tabela += (`<tbody> <tr>`);

        //cria uma lista apenas com os itens do lote selecionado
        let j=0;
        for (let i = 0; i < json.length; i++) {
          if (json[i]["cod_ibge"] == meuCD) {
            listaItem[j] = json[i];
            j++;
          }
        }
        for (i = 0; i < listaItem.length; i++) {
          meuItem[i]=listaItem[i]["cod_item"];
          meuTipo[i]=listaItem[i]["cod_tipo_item"];
          tabela += (`<tr>`);
          tabela += (`<td>`);
          tabela += listaItem[i]["cod_ibge"];
          tabela += (`</td> <td>`);
          tabela += listaItem[i]["cod_item"];
          tabela += (`</td> <td>`);
          tabela += listaItem[i]["cod_tipo_item"];
          tabela += (`</td> <td id="quantidade_previsto` + i + `">`);
          tabela += listaItem[i]["quantidade_previsto"];
          tabela += (`</td> <td id="quantidade_projeto_executivo` + i + `">`);
          tabela += listaItem[i]["quantidade_projeto_executivo"];
          tabela += (`</td> <td id="quantidade_termo_instalacao` + i + `">`);
          tabela += listaItem[i]["quantidade_termo_instalacao"];
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

function editarItem() {
  for(let i=0; i<listaItem.length;i++){
    edicaoItem1[i] = {
      "quantidade_previsto": "&",
    };
    edicaoItem2[i] = {
      "quantidade_projeto_executivo": "&",
    };
    edicaoItem3[i] = {
      "quantidade_termo_instalacao": "&",
    };
    document.getElementById("quantidade_previsto" + i).innerHTML = `<input type="text" id="quantidade_previsto" onchange="edicaoItem1[`+i+`].quantidade_previsto=parseFloat(this.value);">`;
    document.getElementById("quantidade_projeto_executivo" + i).innerHTML = `<input type="text" id="quantidade_projeto_executivo" onchange="edicaoItem2[`+i+`].quantidade_projeto_executivo=parseFloat(this.value);">`;
    document.getElementById("quantidade_termo_instalacao" + i).innerHTML = `<input type="text" id="quantidade_termo_instalacao" onchange="edicaoItem3[`+i+`].quantidade_termo_instalacao=parseFloat(this.value);">`;
  }
  document.getElementById("editar").innerHTML = (`<button id="editar" onclick="editarItem2()" class="btn btn-success">Salvar</button>`);
}

function editarItem2() {
  for(let i=0;i<listaItem.length;i++){
    
    let corpoFinal;
    if(edicaoItem1[i].quantidade_previsto!="&"){
      corpoFinal = edicaoItem1[i];
      //transforma as informações do token em json
      let corpo = JSON.stringify(corpoFinal);
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
          alert("Valores alterados com sucesso");
          itens();
        } else {
          //erros(response.status);
        }
      });
    }
    if(edicaoItem2[i].quantidade_projeto_executivo!="&"){
      corpoFinal = edicaoItem2[i];
      //transforma as informações do token em json
      let corpo = JSON.stringify(corpoFinal);
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
          alert("Valores alterados com sucesso");
          itens();
        } else {
          //erros(response.status);
        }
      });
    }
    if(edicaoItem3[i].quantidade_termo_instalacao!="&"){
      corpoFinal = edicaoItem3[i];
      //transforma as informações do token em json
      let corpo = JSON.stringify(corpoFinal);
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
          alert("Valores alterados com sucesso");
          itens();
        } else {
          //erros(response.status);
        }
      });
    } 
  }
}