

//capturar chave primaria
let loteTotal = [];

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
    alert("Erro: Formato de informação não aceito.");
  } else if (value == 500) {
    window.location.replace("./errors/500.html");
  } else if (value == 504) {
    window.location.replace("./errors/504.html");
  } else {
    alert("ERRO DESCONHECIDO");
  }
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






//sistema de paginação
let contador = 0;
let porPagina = 5;
let totalPaginas;


function antes() {
  contador--;
  paginacao();
}

function depois() {
  contador++;
  paginacao();
}

//garantindo o limite de paginação

function pagina(valor) {
  contador = valor;
  paginacao();
}

function paginacao() {
  porPagina = document.getElementById("quantos").value;
  let comeco = contador * porPagina;
  let fim = (contador + 1) * porPagina;

  //função fetch para chamar itens da tabela
  fetch('http://localhost:8080/read/lote', {
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

          loteTotal = json;
          totalPaginas = json.length / porPagina;
          let tabela = (`<thead style="background: #4b5366; color:white; font-size:15px">
              <tr>
              <th scope="col">Lote</th>
              <th scope="col">Entidade - CNPJ</th>
              <th scope="col">Contrato</th>
              <th scope="col">Data de Inicio</th>
              <th scope="col">Data Final</th>
              <th scope="col">Data de Reajuste</th>
              <th scope="col">Opções</th>
              </tr>
              </thead>`);
          tabela += (`<tbody> <tr>`);
          
          for (let i = comeco; i < fim && i < json.length; i++) {
            tabela += (`<td>`);
            tabela += json[i]["cod_lote"];
            tabela += (`</td> <td>`);
            tabela += json[i]["nome"] + " - " + json[i]["cnpj"];
            tabela += (`</td> <td>`);
            tabela += json[i]["contrato"];
            tabela += (`</td> <td>`);

            let data1 = new Date(json[i]["dt_inicio_vig"]);
            let dataf1 = String(data1.getDate()).padStart(2, '0') + '/' + String(data1.getMonth()+1).padStart(2, '0') + '/' + String(data1.getFullYear()).padStart(4, '0');
            tabela += dataf1;
            tabela += (`</td> <td>`);

            let data2 = new Date(json[i]["dt_final_vig"]);
            let dataf2 = String(data2.getDate()).padStart(2, '0') + '/' + String(data2.getMonth()+1).padStart(2, '0') + '/' + String(data2.getFullYear()).padStart(4, '0');
            tabela += dataf2;
            tabela += (`</td> <td>`);

            let data3 = new Date(json[i]["dt_reajuste"]);
            let dataf3 = String(data3.getDate()).padStart(2, '0') + '/' + String(data3.getMonth()+1).padStart(2, '0') + '/' + String(data3.getFullYear()).padStart(4, '0');
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

          //mostra quanto do total aparece na tela
          document.getElementById("mostrando").innerHTML = "Mostrando " + (comeco + 1) + " a " + fim + " de " + json.length;
          if (porPagina > json.length - comeco) {
            document.getElementById("mostrando").innerHTML = "Mostrando " + (comeco + 1) + " a " + json.length + " de " + json.length;
          }


          //conta quantas paginas é necessário
          let paginas = `<li id="anterior" class="page-item" ><a href="#" class="page-link" onclick="antes()">Anterior</a></li>`;
          if (json.length > porPagina) {
            for (i = 0; i < totalPaginas; i++) {
              paginas += `<li class="page-item" id="page` + i + `"><a href="#" onclick="pagina(` + i + `)" class="page-link">` + (i + 1) + `</a></li>`;
            }
          }
          paginas += `<li id="proximo" class="page-item" ><a href="#" class="page-link" onclick="depois()">Próximo</a></li>`;
          document.getElementById("paginacao").innerHTML = paginas;

          //limite das paginas
          if (contador > 0) {
            document.getElementById("anterior").style.visibility = "visible";
          } else {
            document.getElementById("anterior").style.visibility = "hidden";
          }
          if (fim<json.length) {
            document.getElementById("proximo").style.visibility = "visible";
          } else {
            document.getElementById("proximo").style.visibility = "hidden";
          }

       });
    } else {
      erros(response.status);
    }
  });
}

window.onload = function () {
  this.paginacao();
  //preenche os CNPJs
  fetch('http://localhost:8080/read/entidade', {
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
        x.sort();
        document.getElementById("cnpj").innerHTML = x;
      });
    } else {
      erros(response.status);
    }
  });
}

function enviar() {

  let a = document.getElementById("cod_lote");
  info.cod_lote = parseFloat(a.value);
  let b = document.getElementById("cnpj");
  info.cnpj = b.value;
  let c = document.getElementById("contrato");
  info.contrato = c.value;
  let d = document.getElementById("dt_inicio_vig");
  info.dt_inicio_vig = d.value;
  let e = document.getElementById("dt_final_vig");
  info.dt_final_vig = e.value;
  let f = document.getElementById("dt_reajuste");
  info.dt_reajuste = f.value;

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
    //console.log(response);

    //tratamento dos erros
    if (response.status == 201) {
      return response.json().then(function (json) {
        //console.log(json);
        window.location.replace("./lote.html");
      });
    } else {
      erros(response.status);
    }
  });
}

document.getElementById("cod_lote").oninput = function () {
  if (this.value.length > 0) {
    this.value = this.value.slice(0, 9);
  }
}

//leva para o editor da lote selecionada
function editarLote(valor) {
  localStorage.setItem("cod_lote", loteTotal[valor].cod_lote);
  localStorage.setItem("cnpj", loteTotal[valor].cnpj);
  localStorage.setItem("contrato", loteTotal[valor].contrato);
  localStorage.setItem("dt_inicio_vig", loteTotal[valor].dt_inicio_vig);
  localStorage.setItem("dt_final_vig", loteTotal[valor].dt_final_vig);
  localStorage.setItem("dt_reajuste", loteTotal[valor].dt_reajuste);
  window.location.href = "./gerenciaLote.html";
}