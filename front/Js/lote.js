//capturar chave primaria
let jsonFinal = [];

function paginacao() {
  porPagina = document.getElementById("quantos").value;
  let comeco = contador * porPagina;
  let fim = (contador + 1) * porPagina;

  //função fetch para chamar itens da tabela
  fetch(servidor + 'read/lote', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {
    //console.log(response)
    //tratamento dos erros
    if (response.status == 200) {
      console.log(response.statusText);
      //pegar o json que possui a tabela
      response.json().then(function (json) {

        //para ser usado no campo abaixo
        mascara();

        let tabela = (`<thead style="background: #4b5366; color:white; font-size:15px">
            <tr>
            <th style="width:10%" scope="col">Lote</th>
            <th style="width:20%" scope="col">Entidade - CNPJ</th>
            <th style="width:15%" scope="col">Contrato</th>
            <th style="width:15%" scope="col">Data de Inicio</th>
            <th style="width:15%" scope="col">Data Final</th>
            <th style="width:15%" scope="col">Data de Reajuste</th>
            <th style="width:10%" scope="col">Opções</th>
            </tr>
            </thead>`);
        tabela += (`<tbody>`);

        //sistema de filtragem:
        let filtrado = [];
        filtrado = filtro(json,["cnpj","nome","endereco","bairro","cep","uf","nome_municipio","observacao"]);

        //para edição
        jsonFinal=filtrado;

        for (let i = comeco; i < fim && i < filtrado.length; i++) {
          tabela += (`<tr><td>`);
          tabela += filtrado[i]["cod_lote"];
          tabela += (`</td> <td>`);
          tabela += filtrado[i]["nome"] + " - " + filtrado[i]["cnpj"];
          tabela += (`</td> <td>`);
          tabela += filtrado[i]["contrato"];
          tabela += (`</td> <td class="data">`);

          //organizado junto à mascara
          //mesma lógica de gerenciaLote

          let data1 = filtrado[i]["dt_inicio_vig"];
          let dataSeparada1 = data1.split("-");
          let dataEspecial1 = dataSeparada1[2].split("T");

          tabela += dataEspecial1[0] + dataSeparada1[1] + dataSeparada1[0];
          tabela += (`</td> <td class="data">`);

          let data2 = filtrado[i]["dt_final_vig"];
          let dataSeparada2 = data2.split("-");
          let dataEspecial2 = dataSeparada2[2].split("T");

          tabela += dataEspecial2[0] + dataSeparada2[1] + dataSeparada2[0];
          tabela += (`</td> <td class="data2">`);

          let data3 = filtrado[i]["dt_reajuste"];
          let dataSeparada3 = data3.split("-");
          let dataEspecial3 = dataSeparada3[2].split("T");

          tabela += dataEspecial3[0] + dataSeparada3[1];

          tabela += (`</td><td>
                  <span class="d-flex">
                  <button onclick="editarLote(` + i + `)" class="btn btn-success">
                  <i class="material-icons"data-toggle="tooltip" title="Edit">&#xE254;</i>
                  </button>
                  </td></tr>`);
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
        paginacao();
      });
    } else {
      erros(response.status);
    }
  });
}


window.onload = function () {
  pegarCNPJ();
}

function enviar() {

  //estrutura usada para mandar o JSON no fetch
  let info = {
    "cod_lote": parseFloat(document.getElementById("cod_lote").value),
    "cnpj": document.getElementById("cnpj").value,
    "contrato": document.getElementById("contrato").value,
    "dt_inicio_vig": document.getElementById("dt_inicio_vig").value,
    "dt_final_vig": document.getElementById("dt_final_vig").value,
    "dt_reajuste": document.getElementById("dt_reajuste").value,
  };

  //transforma as informações do token em json
  let corpo = JSON.stringify(info);
  //função fetch para mandar
  fetch(servidor + 'read/lote', {
    method: 'POST',
    body: corpo,
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //checar o status do pedido
    //console.log(response);

    //tratamento dos erros
    if (response.status == 201) {
      location.reload();
    } else {
      erros(response.status);
    }
  });
}

//leva para o editor do campo selecionado
function editarLote(valor) {
  localStorage.setItem("cod_lote", jsonFinal[valor].cod_lote);
  localStorage.setItem("cnpj", jsonFinal[valor].cnpj);
  localStorage.setItem("contrato", jsonFinal[valor].contrato);
  localStorage.setItem("dt_inicio_vig", jsonFinal[valor].dt_inicio_vig);
  localStorage.setItem("dt_final_vig", jsonFinal[valor].dt_final_vig);
  localStorage.setItem("dt_reajuste", jsonFinal[valor].dt_reajuste);
  window.location.href = "./gerenciaLote.html";
}