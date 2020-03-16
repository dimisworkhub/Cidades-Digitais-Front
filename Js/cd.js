//pega o token do login
let meuToken = localStorage.getItem("token");

//Fazer Tabela
let cdTotal = [];

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
let totalPaginas = cdTotal.length/porPagina;


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
  if(cdTotal.length%porPagina!=0){
    totalPaginas++;
  }

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

        cdTotal = json;
        totalPaginas = json.length / porPagina;
        
        let tabela = (`<thead style="background: #4b5366; color:white; font-size:15px">
            <tr>
            <th scope="col">Código IBGE do Município</th>
            <th scope="col">Município</th>
            <th scope="col">Código Lote</th>
            <th scope="col">O.S. Projeto Executivo</th>
            <th scope="col">Data de Projeto Executivo</th>
            <th scope="col">O.S. Implementação</th>
            <th scope="col">Data de Implementação</th>
            <th scope="col">Opções</th>
            </tr>
            </thead>`);
        tabela += (`<tbody>`);

        for (let i = comeco; i < fim && i < json.length; i++) {
          tabela += (`<tr>`);
          tabela += (`<td>`);
          tabela += json[i]["cod_ibge"];
          tabela += (`</td> <td>`);
          tabela += cidades[i]["nome_municipio"] + " - " + cidades[i]["uf"];
          tabela += (`</td> <td>`);
          tabela += json[i]["cod_lote"]
          tabela += (`</td> <td>`);
          tabela += json[i]["os_pe"]
          tabela += (`</td> <td>`);
          let data1 = new Date(json[i]["data_pe"]);
          let dataf1 = String(data1.getDate()).padStart(2, '0') + '/' + String(data1.getMonth()+1).padStart(2, '0') + '/' + String(data1.getFullYear()).padStart(4, '0');
          tabela += dataf1;
          tabela += (`</td> <td>`);
          tabela += json[i]["os_imp"]
          tabela += (`</td> <td>`);
          let data2 = new Date(json[i]["data_imp"]);
          let dataf2 = String(data2.getDate()).padStart(2, '0') + '/' + String(data2.getMonth()+1).padStart(2, '0') + '/' + String(data2.getFullYear()).padStart(4, '0');
          tabela += dataf2;
          tabela += (`</td> <td> 
                <span class="d-flex">
                <button onclick="editarCd(` + i + `)" class="btn btn-success">
                <i class="material-icons"data-toggle="tooltip" title="Edit">&#xE254;</i>
                </button>
                </span> </td>`);
          tabela += (`</tr>`);
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
        let i, j = 0;
        let x = [],
          valorUF = [],
          valorFinalUF = [];

        //faz a ligação entre variaveis e valores do banco
        for (i = 0; i < json.length; i++) {
          valorUF[i] = json[i].uf;
          if (i!=0 && valorUF[i] != valorUF[i - 1]) {
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

}


function enabler() {
  document.getElementById("cod_ibge").disabled = false;
  let uf = document.getElementById("uf");
  let i, x = [];
  for (i = 0; i < cidades.length; i++) {
    if (cidades[i].uf == uf.value) {
      x[i] = "<option value='"+cidades[i].cod_ibge+"'>" + cidades[i].nome_municipio + "</option>"
    }
  }
  x.sort();
  document.getElementById("cod_ibge").innerHTML = x;
}



function editarCd(valor) {
  localStorage.setItem("cod_ibge", cdTotal[valor].cod_ibge);
  localStorage.setItem("cod_lote", cdTotal[valor].cod_lote);
  localStorage.setItem("os_pe", cdTotal[valor].os_pe);
  localStorage.setItem("data_pe", cdTotal[valor].data_pe);
  localStorage.setItem("os_imp", cdTotal[valor].os_imp);
  localStorage.setItem("data_imp", cdTotal[valor].data_imp);
  localStorage.setItem("nome_municipio", cidades[valor].nome_municipio);
  localStorage.setItem("uf", cidades[valor].uf);
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
        //console.log(json);
      });
      window.location.replace("./cd.html");
    } else {
      erros(response.status);
    }
  });
}