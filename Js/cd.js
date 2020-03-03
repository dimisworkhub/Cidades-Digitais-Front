//Fazer Tabela
let cdQuery = [];

//pega o token do login
let meuToken = localStorage.getItem("token");

//pega o JSON de municípios para uso na tabela e para adcionar "CD"s
let cidades = [];
document.getElementById("cod_ibge").disabled = true;

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
    alert("Erro: Cidade Digital já existente.");
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


//Fazer Entidade
let info = {
  "cod_ibge": " ",
  "cod_lote": " ",
  "os_pe": " ",
  "data_pe": " ",
  "os_imp": " ",
  "data_imp": " "
};



//sistema de paginação
let contador = 0;
let porPagina = 5;
let totalPaginas = (cdQuery.length + (porPagina - 1)) / porPagina;

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

  //função fetch para mandar
  fetch('http://localhost:8080/read/cd', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {
    //tratamento dos erros
    if (response.status == 200 || response.status == 201) {
      response.json().then(function (json) {
        //console.log(json);

        //mostra quanto do total aparece na tela
        document.getElementById("mostrando").innerHTML = "Mostrando " + porPagina + " de " + json.length;
        if(porPagina>json.length-fim){
          document.getElementById("mostrando").innerHTML = "Mostrando " + (json.length-comeco) + " de " + json.length;
        }

        let tabela = (`<thead style="background: #4b5366; color:white; font-size:15px">
            <tr>
            <th scope="col">Código IBGE do Município</th>
            <th scope="col">Estado</th>
            <th scope="col">Município</th>
            <th scope="col">Código Lote</th>
            <th scope="col">O.S. Projeto Executivo</th>
            <th scope="col">Data de Projeto Executivo</th>
            <th scope="col">O.S. Implementação</th>
            <th scope="col">Data de Implementação</th>
            <th scope="col">Opções</th>
            </tr>
            </thead>`);
        tabela += (`<tbody> <tr>`);

        for (let i = comeco; i < fim && i < json.length; i++) {
          cdQuery[i] = json[i];
          tabela += (`<td>`);
          tabela += json[i]["cod_ibge"];
          tabela += (`</td> <td>`);
          tabela += cidades[i]["uf"];
          tabela += (`</td> <td>`);
          tabela += cidades[i]["nome_municipio"];
          tabela += (`</td> <td>`);
          tabela += json[i]["cod_lote"]
          tabela += (`</td> <td>`);
          tabela += json[i]["os_pe"]
          tabela += (`</td> <td>`);
          tabela += json[i]["data_pe"]
          tabela += (`</td> <td>`);
          tabela += json[i]["os_imp"]
          tabela += (`</td> <td>`);
          tabela += json[i]["data_imp"]
          tabela += (`</td> <td> 
                <span class="d-flex">
                <button onclick="editarCd(` + i + `)" class="btn btn-success">
                <i class="material-icons"data-toggle="tooltip" title="Edit">&#xE254;</i>
                </button>
                </span> </td>`);
          tabela += (`</tr> <tr>`);
        }
        tabela += (`</tr> </tbody>`);
        document.getElementById("tabela").innerHTML = tabela;
      });
    } else {
      erros(response.status);
    }
  });
}



window.onload = function () {

  fetch('http://localhost:8080/read/municipio', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 200) {
      response.json().then(function (json) {
        //pegando valores para usar em municipios
        cidades = json;
        //cria variaveis
        let i, j = 1;
        let x = [],
          valorUF = [],
          valorFinalUF = [];

        //faz a ligação entre variaveis e valores do banco
        for (i = 0; i < json.length; i++) {
          valorUF[i] = json[i].uf;
          if (valorUF[i] != valorUF[i - 1]) {
            valorFinalUF[j] = valorUF[i];
            j++;
          }
        }
        for (i = 0; i < j; i++) {
          x[i] += "<option>" + valorFinalUF[i] + "</option>";
        }
        x.sort();
        document.getElementById("uf").innerHTML = x;
      });
    } else {
      erros(response.status);
    }
    this.paginacao();
  });

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
        x[0] += "<option value='00000000000000'>Código do Lote</option>";
        for (i = 0; i < json.length; i++) {
          x[i + 1] += "<option>" + json[i].cod_lote + "</option>";
        }
        x.sort();
        document.getElementById("cod_lote").innerHTML = x;
      });
    } else {
      erros(response.status);
    }
  });

  //conta quantas paginas é necessário
  let paginas = `<li id="anterior" class="page-item" ><a href="#" class="page-link" onclick="antes()">Anterior</a></li>`;
  for (i = 0; i <= Math.ceil(totalPaginas); i++) {
    paginas += `<li class="page-item"><a href="#" onclick="pagina(` + i + `)" class="page-link">` + (i + 1) + `</a></li>`;
  }
  paginas += `<li id="proximo" class="page-item" ><a href="#" class="page-link" onclick="depois()">Próximo</a></li>`;
  document.getElementById("paginacao").innerHTML = paginas;

}


function enabler() {
  document.getElementById("cod_ibge").disabled = false;
  let ibge = document.getElementById("cod_ibge");
  let i, y = [];
  for (i = 0; i < cidades.length; i++) {
    if (cidades[i].uf == ibge.value) {
      y[i] = "<option value='"+cidades[i].cod_ibge+"'>" + cidades[i].nome_municipio + "</option>"
    }
  }
  y.sort();
  document.getElementById("cod_ibge").innerHTML = y;
}



function editarCd(valor) {
  localStorage.setItem("COD_IBGE", cdQuery[valor].cod_ibge);
  window.location.href = "./gerenciaCd.html";
}




function enviar() {

  let a = document.getElementById("cod_ibge");
  info.cod_ibge = parseInt(a.value);
  let b = document.getElementById("cod_lote");
  info.cod_lote = parseInt(b.value);
  let c = document.getElementById("os_pe");
  info.os_pe = c.value;
  let d = document.getElementById("data_pe");
  info.data_pe = d.value;
  let e = document.getElementById("os_imp");
  info.os_imp = e.value;
  let f = document.getElementById("data_imp");
  info.data_imp = f.value;

  //pega o token do login
  let meuToken = localStorage.getItem("token");
  console.log(info);
  //transforma as informações do token em json
  let corpo = JSON.stringify(info);

  //função fetch para mandar
  fetch('http://localhost:8080/read/cd', {
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
      response.json().then(function (json) {
        console.log(json);
      });
      window.location.replace("./cd.html");
    } else {
      erros(response.status);
    }
  });
}