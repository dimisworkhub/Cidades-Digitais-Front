//Fazer Tabela
let jsonFinal = [];

//pega o JSON de municípios para uso na tabela e para adcionar "CD"s
let cidades = [];

window.onload = function () {
  this.paginacao();
  this.pegarMunicipio();
}

function paginacao() {

  porPagina = document.getElementById("quantos").value;
  let comeco = contador * porPagina;
  let fim = (contador + 1) * porPagina;

  //função fetch para mandar
  fetch(servidor + 'read/cd', {
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
        
        let tabela = (`<thead style="background: #4b5366; color:white; font-size:15px">
            <tr>
            <th style="width:15%" scope="col">Código IBGE do Município</th>
            <th style="width:25%" scope="col">Município</th>
            <th style="width:10%" scope="col">Lote</th>
            <th style="width:10%" scope="col">O.S. Projeto Executivo</th>
            <th style="width:10%" scope="col">Data de Projeto Executivo</th>
            <th style="width:10%" scope="col">O.S. Implementação</th>
            <th style="width:10%" scope="col">Data de Implementação</th>
            <th style="width:10%" scope="col">Opções</th>
            </tr>
            </thead>`);
        tabela += (`<tbody>`);

        //sistema de filtragem:
        let filtrado = [];
        filtrado = filtro(json,["cod_ibge","cod_lote","os_pe","data_pe","os_imp","data_imp"]);

        //para edição
        jsonFinal=filtrado;

        for (let i = comeco; i < fim && i < filtrado.length; i++) {
          tabela += (`<tr>`);
          tabela += (`<td>`);
          tabela += filtrado[i]["cod_ibge"];
          tabela += (`</td> <td>`);
          tabela += filtrado[i]["nome_municipio"] + ` - ` + filtrado[i]["uf"];
          tabela += (`</td> <td>`);
          tabela += filtrado[i]["cod_lote"];
          tabela += (`</td> <td>`);
          tabela += filtrado[i]["os_pe"];
          tabela += (`</td> <td>`);
          let data1 = new Date(filtrado[i]["data_pe"]);
          let dataf1 = String(data1.getDate()).padStart(2, '0') + '/' + String(data1.getMonth() + 1).padStart(2, '0') + '/' + String(data1.getFullYear()).padStart(4, '0');
          tabela += dataf1;
          tabela += (`</td> <td>`);
          tabela += filtrado[i]["os_imp"];
          tabela += (`</td> <td>`);
          let data2 = new Date(filtrado[i]["data_imp"]);
          let dataf2 = String(data2.getDate()).padStart(2, '0') + '/' + String(data2.getMonth() + 1).padStart(2, '0') + '/' + String(data2.getFullYear()).padStart(4, '0');
          tabela += dataf2;
          tabela += (`</td> <td> 
                <span class="d-flex">
                <button onclick="editarCd(` + i + `)" class="btn btn-success">
                <i class="material-icons"data-toggle="tooltip" title="Edit">&#xE254;</i>
                </button>
                </span> </td>`);
          tabela += (`</tr>`);
        }

        tabela += (`</tbody>`);
        document.getElementById("tabela").innerHTML = tabela;

        paginasOrganizadas(filtrado,comeco,fim);
      });
    } else {
      erros(response.status);
    }
  });
}



function editarCd(valor) {
  localStorage.setItem("cod_ibge", jsonFinal[valor].cod_ibge);
  localStorage.setItem("cod_lote", jsonFinal[valor].cod_lote);
  localStorage.setItem("os_pe", jsonFinal[valor].os_pe);
  localStorage.setItem("data_pe", jsonFinal[valor].data_pe);
  localStorage.setItem("os_imp", jsonFinal[valor].os_imp);
  localStorage.setItem("data_imp", jsonFinal[valor].data_imp);
  localStorage.setItem("nome_municipio", cidades[valor].nome_municipio);
  localStorage.setItem("uf", cidades[valor].uf);
  window.location.href = "./gerenciaCd.html";
}





//funções para preencher os selects corretamente

function pegarLote() {
  //preenche os cod_lotes
  fetch(servidor + 'read/lote', {
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
          x[i + 1] += "<option>" + json[i].cod_lote + "</option>";
        }
        x[0] += "<option value=''>Código do Lote</option>";
        document.getElementById("cod_lote").innerHTML = x;
      });
    } else {
      erros(response.status);
    }
  });
}



function pegarMunicipio() {
  document.getElementById("cod_ibge").innerHTML = "<option value=''>Cidade</option>";
  document.getElementById("cod_ibge").disabled = true;

  //preenche os campos para estado e municipio
  let answer = fetch(servidor + 'read/municipio', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 200) {
      response.json().then(function (json) {

        //pegando valores para usar em enabler()
        cidades = json;

        //cria variaveis
        let i, j = 0;
        let x = [],
          valorUF = [];

        //para tirar repetições
        for (i = 0; i < json.length; i++) {
          if (i != 0 && json[i].uf != json[i - 1].uf) {
            valorUF[j] = json[i].uf;
            j++;
          }
        }
        //preenche "uf"
        x[0] += "<option value='A'>Estado</option>";
        for (i = 0; i < j; i++) {
          x[i + 1] += "<option>" + valorUF[i] + "</option>";
        }
        
        document.getElementById("uf").innerHTML = x;
      });
    } else {
      erros(response.status);
    }
  });
}

function enabler() {
  document.getElementById("cod_ibge").disabled = false;

  //variaveis
  let uf = document.getElementById("uf");
  let i, j = 0;
  let x = [], cidadesFinal = [];

  //para tirar repetições
  for (i = 0; i < cidades.length; i++) {
    if (cidades[i].uf == uf.value) {
      cidadesFinal[j] = cidades[i];
      j++;
    }
  }

  //preenche "cod_ibge"
  x[0] = "<option value='A'>Cidade</option>";
  for (i = 0; i < cidadesFinal.length; i++) {
    x[i+1] = "<option value=" + cidadesFinal[i].cod_ibge + ">" + cidadesFinal[i].nome_municipio + "</option>";
  }
  
  document.getElementById("cod_ibge").innerHTML = x;
}



function enviar() {

  //estrutura usada para mandar o JSON no fetch
  let info = {
    "cod_ibge": " ",
    "cod_lote": " ",
    "os_pe": " ",
    "data_pe": " ",
    "os_imp": " ",
    "data_imp": " "
  };

  info.cod_ibge = parseInt(document.getElementById("cod_ibge").value);
  info.cod_lote = parseInt(document.getElementById("cod_lote").value);
  info.os_pe = document.getElementById("os_pe").value;
  info.data_pe = document.getElementById("data_pe").value;
  info.os_imp = document.getElementById("os_imp").value;
  info.data_imp = document.getElementById("data_imp").value;

  //transforma as informações do token em json
  let corpo = JSON.stringify(info);
  //função fetch para mandar
  fetch(servidor + 'read/cd', {
    method: 'POST',
    body: corpo,
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //checar o status do pedido
    //console.log(response);

    //tratamento dos erros
    if (response.status == 200 || response.status == 201 || response.status == 202) {
      alert("Cidade Digital criada com sucesso");
      location.reload();
    } else {
      erros(response.status);
    }
  });
}