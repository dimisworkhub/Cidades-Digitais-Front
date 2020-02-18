//capturar chave primaria
let loteQuery = [];

//pega o token do login
let meuToken = localStorage.getItem("token");

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
      
    } else if (response.status == 201) {
      console.log("Lote criado com sucesso");
    } else if (response.status == 204) {
      console.log("Apagado com sucesso.");
    } else if (response.status == 400) {
      window.location.replace("./errors/400.html");
    } else if (response.status == 401) {
      window.location.replace("./errors/401.html");
    } else if (response.status == 403) {
      window.location.replace("./errors/403.html");
    } else if (response.status == 404) {
      window.location.replace("./errors/404.html");
    } else if (response.status == 409) {
      console.log("Erro: Usuário já existente.");
    } else if (response.status == 412) {
      console.log("Erro: Informação colocada é incorreta.");
    } else if (response.status == 422) {
      console.log("Erro: Usuário ou senha inválidos.");
    } else if (response.status == 500) {
      window.location.replace("./errors/500.html");
    } else if (response.status == 504) {
      window.location.replace("./errors/504.html");
    }
    //caso seja um dos erros não listados
    else {
      console.log("ERRO DESCONHECIDO");
    }
    //pegar o json que possui a tabela
    return response.json().then(function (json) {
      console.log(json);

      let tabela = (`<thead style="background: #4b5366; color:white; font-size:15px">
          <tr>
          <th> <span class="custom-checkbox">
          <input type="checkbox" id="selectAll">
          <label for="selectAll"></label>
          </span></th>
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
        tabela += (`<td>
                <span class="custom-checkbox">
                <input type="checkbox" id="checkbox1" name="options[]" value="1">
                <label for="checkbox1"></label>
                </span>
                </td>`);
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
                <button onclick="apagarLote(` + i + `)" class="btn btn-danger">
                <i class="material-icons"data-toggle="tooltip" title="Delete">&#xE872;</i>
                </button> 
                </span> </td>`);
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
}


function changer() {
  console.log(info);
  var a = document.getElementById("cod_lote");
  info.cod_lote = parseInt(a.value);
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
  "cod_lote": "" ,
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
    if (response.status == 200) {
      window.location.replace("./home.html");
    } else if (response.status == 201) {
      alert("Lote criado com sucesso");
      window.location.replace("./home.html");
    } else if (response.status == 202) {
      alert("Login efetivado com sucesso");
      window.location.replace("./home.html");
    } else if (response.status == 204) {
      alert("Apagado com sucesso.");
      window.location.replace("./home.html");
    } else if (response.status == 400) {
      window.location.replace("./errors/400.html");
    } else if (response.status == 401) {
      window.location.replace("./errors/401.html");
    } else if (response.status == 403) {
      window.location.replace("./errors/403.html");
    } else if (response.status == 404) {
      window.location.replace("./errors/404.html");
    } else if (response.status == 409) {
      alert("Erro: Lote já existente.");
    } else if (response.status == 412) {
      alert("Erro: Informação colocada é incorreta.");
    } else if (response.status == 500) {
      window.location.replace("./errors/500.html");
    } else if (response.status == 504) {
      window.location.replace("./errors/504.html");
    } else {
      alert("ERRO DESCONHECIDO");
    }
    return response.json().then(function (json) {
      console.log(json);
    });
  });
}

document.getElementById("cod_lote").oninput = function () {
  if (this.value.length > 1) {

      this.value = this.value.slice(0,11); 
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

//apaga a lote selecionada
function apagarLote(valor) {

  //transforma as informações do token em json
  let corpo = JSON.stringify(info);
  console.log(info);
  //função fetch para mandar
  fetch('http://localhost:8080/read/lote/' + loteQuery[valor].cod_lote, {
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 200) {
      window.location.replace("./lote.html");
    } else if (response.status == 201) {
      alert("Usuário criado com sucesso");
      window.location.replace("./lote.html");
    } else if (response.status == 202) {
      alert("Login efetivado com sucesso");
      window.location.replace("./lote.html");
    } else if (response.status == 204) {
      alert("Apagado com sucesso.");
      window.location.replace("./lote.html");
    } else if (response.status == 400) {
      window.location.replace("./errors/400.html");
    } else if (response.status == 401) {
      window.location.replace("./errors/401.html");
    } else if (response.status == 403) {
      window.location.replace("./errors/403.html");
    } else if (response.status == 404) {
      window.location.replace("./errors/404.html");
    } else if (response.status == 409) {
      alert("Erro: Usuário já existente.");
    } else if (response.status == 412) {
      alert("Erro: Informação colocada é incorreta.");
    } else if (response.status == 422) {
      alert("Erro: Usuário ou senha inválidos.");
    } else if (response.status == 500) {
      window.location.replace("./errors/500.html");
    } else if (response.status == 504) {
      window.location.replace("./errors/504.html");
    } else {
      alert("ERRO DESCONHECIDO");
    }
    return response.json().then(function (json) {
      console.log(json);
    });
  });
}