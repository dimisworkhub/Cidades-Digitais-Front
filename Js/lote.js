//capturar chave primaria
let loteQuery = [];

//pega o token do login
let meuToken = localStorage.getItem("token");       


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
    alert("Erro: Informação incorreta.");
  } else if (value == 500) {
    window.location.replace("./errors/500.html");
  } else if (value == 504) {
    window.location.replace("./errors/504.html");
  } else {
    alert("ERRO DESCONHECIDO");
  }
}


//Fazer Tabela
window.onload = function () {
  //função fetch para chamar itens da tabela
  fetch('http://localhost:8080/read/lote', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {
    console.log(response)
    //tratamento dos erros
    if (response.status == 200) {
      console.log("ok");

    } else {
      //erros(response.status);
    }
    //pegar o json que possui a tabela
    return response.json().then(function (json) {
      console.log(json);

      let tabela = (`<thead style="background: #4b5366; color:white; font-size:15px">
          <tr>
          <th scope="col">Lote</th>
          <th scope="col">CNPJ</th>
          <th scope="col">Contrato</th>
          <th scope="col">Data de Inicio</th>
          <th scope="col">Data Final</th>
          <th scope="col">Data de Reajuste</th>
          <th scope="col">Opções</th>
          </tr>
          </thead>`);
      tabela += (`<tbody> <tr>`);

      for (let i = 0; i < json.length; i++) {
        loteQuery[i] = json[i]["cnpj"];
        tabela += (`<td>`);
        tabela += json[i]["cod_lote"];
        tabela += (`</td> <td>`);
        tabela += json[i]["cnpj"];
        tabela += (`</td> <td>`);
        tabela += json[i]["contrato"];
        tabela += (`</td> <td>`);

        let data1 = new Date(json[i]["dt_inicio_vig"]);
        let dataf1 = data1.getDate() + '/' + data1.getMonth() + '/' + data1.getFullYear();
        tabela += dataf1;
        tabela += (`</td> <td>`);

        let data2 = new Date(json[i]["dt_final_vig"]);
        let dataf2 = data2.getDate() + '/' + data2.getMonth() + '/' + data2.getFullYear();
        tabela += dataf2;
        tabela += (`</td> <td>`);

        let data3 = new Date(json[i]["dt_reajuste"]);
        let dataf3 = data3.getDate() + '/' + data3.getMonth() + '/' + data3.getFullYear();
        tabela += dataf3;

        tabela += (`</td> <td> 
                <span class="d-flex">
                <button onclick="editarLote(` + i + `)" class="btn btn-success">
                <i class="material-icons"data-toggle="tooltip" title="Edit">&#xE254;</i>
                </button>
                </td>`);
        tabela += (`</tr> <tr>`);
      }
      tabela += (`</tr> </tbody>`);
      document.getElementById("tabela").innerHTML = tabela;

      $(document).ready(function () {
        // Select/Deselect checkboxes
        var checkbox = $('table tbody input[type="checkbox"]');
        $("#selectAll").click(function () {
          if (this.checked) {
            checkbox.each(function () {
              this.checked = true;
            });
          } else {
            checkbox.each(function () {
              this.checked = false;
            });
          }
        });
        checkbox.click(function () {
          if (!this.checked) {
            $("#selectAll").prop("checked", false);
          }
        });
      });


    });
  });

  //preenche os CNPJs
  fetch('http://localhost:8080/read/entidade', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 200) {
      return response.json().then(function (json) {
        //cria variaveis
        let i = 0;
        let x = [];
        x[0] += "<option value='00000000000000'>CNPJ</option>";
        for (i = 0; i < json.length; i++) {
          x[i+1] += "<option>" + json[i].cnpj + "</option>";
        }
        x.sort();
        document.getElementById("cnpj").innerHTML = x;
      });
    } else {
      //erros(response.status);
    }
  });
}


function changer() {
  var a = document.getElementById("cod_lote");
  info.cod_lote = parseFloat(a.value);
  var b = document.getElementById("cnpj");
  info.cnpj = b.value;
  var c = document.getElementById("contrato");
  info.contrato = c.value;
  var d = document.getElementById("dt_inicio_vig");
  info.dt_inicio_vig = d.value;
  var e = document.getElementById("dt_final_vig");
  info.dt_final_vig = e.value;
  var f = document.getElementById("dt_reajuste");
  info.dt_reajuste = f.value;

}


//Fazer Lote
let info = {
  "cod_lote": "",
  "cnpj": "",
  "contrato": "",
  "dt_inicio_vig": "",
  "dt_final_vig": "",
  "dt_reajuste": ""
};

function enviar() {

  //transforma as informações do token em json
  let corpo = JSON.stringify(info);

  //função fetch para mandar
  fetch('http://localhost:8080/read/lote', {
    method: 'POST',
    body: corpo,
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //checar o status do pedido
    console.log(response);

    //tratamento dos erros
    if (response.status == 201) {
      return response.json().then(function (json) {
        window.location.replace("./lote.html");
      });
    } else {
      erros(response.status);
    }
  });
}

document.getElementById("cod_lote").oninput = function () {
  if (this.value.length > 1) {
    this.value = this.value.slice(0, 9);
  }
}

//leva para o editor da lote selecionada
function editarLote(valor) {
  localStorage.setItem("cod_lote", loteQuery[valor].cod_lote);
  localStorage.setItem("cnpj", loteQuery[valor].cnpj);
  localStorage.setItem("contrato", loteQuery[valor].contrato);
  localStorage.setItem("dt_inicio_vig", loteQuery[valor].dt_inicio_vig);
  localStorage.setItem("dt_final_vig", loteQuery[valor].dt_final_vig);
  localStorage.setItem("dt_reajuste", loteQuery[valor].dt_reajuste);
  window.location.href = "./gerenciaLote.html";
}