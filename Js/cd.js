//Fazer Tabela
let cdQuery = [];

//pega o token do login
let meuToken = localStorage.getItem("token");

//pega o JSON de municípios para uso na tabela
let cidades = [];

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

        let tabela = (`<thead style="background: #4b5366; color:white; font-size:15px">
            <tr>
            <th> <span class="custom-checkbox">
            <input type="checkbox" id="selectAll">
            <label for="selectAll"></label>
            </span></th>
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
        tabela += (`<tbody> <tr>`);

        for (let i = comeco; i < fim && i < json.length; i++) {
          cdQuery[i] = json[i];
          tabela += (`<td>
                <span class="custom-checkbox">
                <input type="checkbox" id="checkbox1" name="options[]" value="1">
                <label for="checkbox1"></label>
                </span>
                </td>`);
          tabela += (`<td>`);
          tabela += json[i]["cod_ibge"];
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

  //preenche os cod_ibges
  fetch('http://localhost:8080/read/municipio', {
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
        x[0] += "<option value='00000000000000'>Código do IBGE</option>";
        for (i = 0; i < json.length; i++) {
          cidades[i]=json[i];
          x[i + 1] += "<option>" + json[i].cod_ibge + "</option>";
        }
        x.sort();
        document.getElementById("cod_ibge").innerHTML = x;
      });
    this.paginacao();
    } else {
      erros(response.status);
    }
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