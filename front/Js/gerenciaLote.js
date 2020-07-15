//pega o CNPJ escolhido anteriormente
let meuCodigo = localStorage.getItem("cod_lote");
document.getElementById("cod_lote").value = meuCodigo;

function pegarEntidade() {
  fetch(servidor + 'read/entidadeget', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 200) {
      response.json().then(function (json) {
        //pegar o json
        //console.log(json);
        let x = [];
        for (i = 0; i < json.length; i++) {
          // o valor pego é o cnpj, mas o campo mostra o nome da entidade
          x[i] += "<option value=" + json[i].cnpj + ">" + json[i].nome + "</option>";
        }


        document.getElementById("cnpj").innerHTML = x;

        let cnpj1 = document.getElementById("cnpj");
        cnpj1.value = localStorage.getItem("cnpj");
      });
    } else {
      erros(response.status);
    }
  });
}

window.onload = function () {

  mascara();

  //preenche os campos
  document.getElementById("contrato").value = localStorage.getItem("contrato");

  //estes campos precisam de adaptações para a mascara

  //exemplo:
  //primeiro separar o valor inicial em uma variavel
  let data1 = localStorage.getItem("dt_inicio_vig");
  //depois utilizar split
  let dataSeparada1 = data1.split("-");
  //por fim, retirar o horario que aparece normalmente junto ao formato de data
  let dataEspecial1 = dataSeparada1[2].split("T");

  //o mesmo se aplica nos outros 2

  let data2 = localStorage.getItem("dt_final_vig");
  let dataSeparada2 = data2.split("-");
  let dataEspecial2 = dataSeparada2[2].split("T");

  let data3 = localStorage.getItem("dt_reajuste");
  let dataSeparada3 = data3.split("-");
  let dataEspecial3 = dataSeparada3[2].split("T");

  //colocar os valores nos campos necessarios

  document.getElementById("dt_inicio_vig").value = dataEspecial1[0] + dataSeparada1[1] + dataSeparada1[0];
  document.getElementById("dt_final_vig").value = dataEspecial2[0] + dataSeparada2[1] + dataSeparada2[0];
  document.getElementById("dt_reajuste").value = dataEspecial3[0] + dataSeparada3[1];

  //esta função preenche o campo de lote
  pegarEntidade();
}

function enviar() {

  let data1 = document.getElementById("dt_inicio_vig").value;
  let dataSeparada1 = data1.split("");
  //formato de data original (retirando mascara)
  let dataFinal1 = dataSeparada1[6] + dataSeparada1[7] + dataSeparada1[8] + dataSeparada1[9] + "-" + dataSeparada1[3] + dataSeparada1[4] + "-" + dataSeparada1[0] + dataSeparada1[1];

  let data2 = document.getElementById("dt_final_vig").value;
  let dataSeparada2 = data2.split("");
  //formato de data original (retirando mascara)
  let dataFinal2 = dataSeparada2[6] + dataSeparada2[7] + dataSeparada2[8] + dataSeparada2[9] + "-" + dataSeparada2[3] + dataSeparada2[4] + "-" + dataSeparada2[0] + dataSeparada2[1];

  let data3 = document.getElementById("dt_reajuste").value;
  let dataSeparada3 = data3.split("");
  //formato de data original (retirando mascara)
  let dataFinal3 = "0000-" + dataSeparada3[3] + dataSeparada3[4] + "-" + dataSeparada3[0] + dataSeparada3[1];

  //JSON usado para mandar as informações no fetch
  let info = {
    "cod_lote": parseFloat(document.getElementById("cod_lote").value),
    "cnpj": document.getElementById("cnpj").value,
    "contrato": document.getElementById("contrato").value,
    "dt_inicio_vig": dataFinal1,
    "dt_final_vig": dataFinal2,
    "dt_reajuste": dataFinal3,
  };

  //transforma as informações em string para mandar
  let corpo = JSON.stringify(info);
  //função fetch para mandar
  fetch(servidor + 'read/lote/' + meuCodigo, {
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
        console.log(json);
      });
      window.location.replace("./lote.html");
    } else {
      erros(response.status);
    }
  });
}

//lote reajustes

//variaveis de reajuste
let listaReajuste = [];
let edicaoReajuste = [];
let meuAno = [];
let reajusteMudado = [];
let apagado;

function reajuste() {

  document.getElementById("cod_lote1").value = meuCodigo;
  document.getElementById("cod_lote1").disabled = true;

  document.getElementById("editar").innerHTML = (`<button onclick="editarReajuste()" class="btn btn-success" >Salvar Alterações em Reajustes</button>
                                                  <button class="btn btn-success" data-toggle="modal" data-target="#adicionarReajuste">Novo Reajuste</button>`);
  document.getElementById("editar2").innerHTML = (`<button onclick="editarReajuste()" class="btn btn-success" >Salvar Alterações em Reajustes</button>`);

  //função fetch para chamar reajustes da tabela
  fetch(servidor + 'read/reajuste', {
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
          if (json[i].cod_lote == meuCodigo) {
            listaReajuste[j] = json[i];
            j++;
          }
        }

        for (i = 0; i < listaReajuste.length; i++) {

          //salva os valores para edição
          meuAno[i] = listaReajuste[i]["ano_ref"];

          //captura itens para tabela
          tabela += (`<tr>`);
          tabela += (`<td>`);
          tabela += listaReajuste[i]["ano_ref"];
          tabela += (`</td> <td>`);
          tabela += (`<input class="percentual" value="` + (listaReajuste[i]["percentual"])*100 + `" id="percentual` + i + `" type="text">`);
          tabela += (`</td> <td>
          <button onclick=" apagado =` + listaReajuste[i]["ano_ref"] + `" class="btn btn-danger" data-toggle="modal" data-target="#deletarReajuste">
          <i class="material-icons"data-toggle="tooltip" title="Delete">&#xE872;</i>
          </button>
          </td>`);
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

function editarReajuste() {

  //para organizar a mascara
  let percent,percent2,percent3,percent4;

  for (i = 0; i < listaReajuste.length; i++) {

    //asd.asd.asd
    //ajustar percentual:
    percent = document.getElementById("percentual" +i).value;
    percent2 = percent.split(".");
    percent3 = percent2[1].split("%");
    percent4 = (percent2[0] + percent3[0])/100;
    
    //cria json para edição
    edicaoReajuste[i] = {
      "percentual": parseFloat(percent4),
    }

    if (edicaoReajuste[i]["percentual"] != listaReajuste[i]["percentual"]) {
      //transforma as informações em string para mandar
      let corpo = JSON.stringify(edicaoReajuste[i]);
      //função fetch para mandar
      fetch(servidor + 'read/reajuste/' + listaReajuste[i]["ano_ref"] + '/' + meuCodigo, {
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
          location.reload();
        } else {
          erros(response.status);
        }
      });
    }
  }
}

function novoReajuste() {

  //ajustar percentual:
  let percent = document.getElementById("percentual").value;
  let percent2 = percent.split("%");

  let infoReajuste = {
    "cod_lote": parseInt(meuCodigo),
    "ano_ref": parseInt(document.getElementById("ano_ref").value),
    "percentual": parseFloat(percent2[0]),
  };

  //transforma as informações em string para mandar
  let corpo = JSON.stringify(infoReajuste);
  //função fetch para mandar
  fetch(servidor + 'read/reajuste', {
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

function apagarReajuste() {

  //função fetch para deletar
  fetch(servidor + 'read/reajuste/' + apagado + "/" + meuCodigo, {
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 204) {
      //alert("Apagado com sucesso.");
      location.reload();
    } else {
      erros(response.status);
    }
    return response.json().then(function (json) {
      console.log(json);
    });
  });
}