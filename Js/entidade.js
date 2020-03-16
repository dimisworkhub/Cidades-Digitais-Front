//capturar itens para mandar no gerenciaEstrutura
let entTotal = [];
//pega o token do login
let meuToken = localStorage.getItem("token");
//pega o JSON de municípios para uso em "adicionar entidades"
let cidades = [];
document.getElementById("nome_municipio").disabled = true;


//tratamento de erros
function erros(value) {
  if (value == 400) {
    console.log(response.statusText);
    window.location.replace("./errors/400.html");
  } else if (value == 401) {
    console.log(response.statusText);
    window.location.replace("./errors/401.html");
  } else if (value == 403) {
    console.log(response.statusText);
    window.location.replace("./errors/403.html");
  } else if (value == 404) {
    console.log(response.statusText);
    window.location.replace("./errors/404.html");
  } else if (value == 409) {
    console.log(response.statusText);
    alert("Erro: Lote já existente.");
  } else if (value == 412) {
    console.log(response.statusText);
    alert("Erro: Informação colocada é incorreta.");
  } else if (value == 422) {
    console.log(response.statusText);
    alert("Erro: Formato de informação não aceito.");
  } else if (value == 500) {
    console.log(response.statusText);
    window.location.replace("./errors/500.html");
  } else if (value == 504) {
    console.log(response.statusText);
    window.location.replace("./errors/504.html");
  } else {
    alert("ERRO DESCONHECIDO");
  }
}



//JSON usado para mandar as informações no fetch
let info = {
  "cnpj": " ",
  "nome": " ",
  "endereco": " ",
  "numero": " ",
  "bairro": " ",
  "cep": " ",
  "nome_municipio": " ",
  "uf": " ",
  "observacao": " "
};



function enabler() {
  let uf1 = document.getElementById("uf");
  info.uf = uf1.value;
  document.getElementById("nome_municipio").disabled = false;
  let i, y = [];
  for (i = 0; i < cidades.length; i++) {
    if (cidades[i].uf == info.uf) {
      y[i] = "<option>" + cidades[i].nome_municipio + "</option>"
    }
  }
  y.sort();
  document.getElementById("nome_municipio").innerHTML = y;
}



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

  //função fetch para mandar itens 
  fetch('http://localhost:8080/read/entidade', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {
    //tratamento dos erros
    if (response.status == 200) {
      console.log(response.statusText);

      //pegar o json que possui a tabela
      response.json().then(function (json) {

        let tabela = (`<thead style="background: #4b5366; color:white; font-size:15px">
            <tr>
            <th scope="col">CNPJ</th>
            <th scope="col">Nome</th>
            <th scope="col">Endereço</th>
            <th scope="col">Número</th>
            <th scope="col">Bairro</th>
            <th scope="col">CEP</th>
            <th scope="col">UF</th>
            <th scope="col">Município</th>
            <th scope="col">Observações</th>
            <th scope="col">Opções</th>
            </tr>
            </thead>`);
        tabela += (`<tbody> <tr>`);

        for (let i = comeco; i < fim && i < json.length; i++) {
          entTotal[i] = json[i];
          tabela += (`<td>`);
          tabela += json[i]["cnpj"];
          tabela += (`</td> <td>`);
          tabela += json[i]["nome"]
          tabela += (`</td> <td>`);
          tabela += json[i]["endereco"]
          tabela += (`</td> <td>`);
          tabela += json[i]["numero"]
          tabela += (`</td> <td>`);
          tabela += json[i]["bairro"]
          tabela += (`</td> <td>`);
          tabela += json[i]["cep"]
          tabela += (`</td> <td>`);
          tabela += json[i]["uf"]
          tabela += (`</td> <td>`);
          tabela += json[i]["nome_municipio"]
          tabela += (`</td> <td>`);
          tabela += json[i]["observacao"]
          tabela += (`</td> <td> 
                <span class="d-flex">
                <button onclick="editarEntidade(` + i + `)" class="btn btn-success">
                <i class="material-icons"data-toggle="tooltip" title="Edit">&#xE254;</i>
                </button> 
                </span> </td>`);
          tabela += (`</tr> <tr>`);
        }
        tabela += (`</tr> </tbody>`);
        document.getElementById("tabela").innerHTML = tabela;

        totalPaginas = json.length / porPagina;

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
        //cria letiaveis
        let i, j = 0;
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
  });
}




function enviar() {

  let a = document.getElementById("cnpj");
  info.cnpj = a.value;
  let b = document.getElementById("nome");
  info.nome = b.value;
  let c = document.getElementById("endereco");
  info.endereco = c.value;
  let d = document.getElementById("numero");
  info.numero = d.value;
  let e = document.getElementById("bairro");
  info.bairro = e.value;
  let f = document.getElementById("cep");
  info.cep = f.value;
  let g = document.getElementById("obs");
  info.observacao = g.value;
  let h = document.getElementById("nome_municipio");
  info.nome_municipio = h.value;

  //transforma as informações do token em json
  let corpo = JSON.stringify(info);

  //função fetch para mandar
  fetch('http://localhost:8080/read/entidade', {
    method: 'POST',
    body: corpo,
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 201) {
      alert("Entidade criada com sucesso");
      return response.json().then(function (json) {
        console.log(json);
        window.location.replace("./entidade.html");
      });
    } else {
      erros(response.status);
    }
  });
}

//leva para o editor da entidade selecionada
function editarEntidade(valor) {
  localStorage.setItem("cnpj", entTotal[valor].cnpj);
  localStorage.setItem("nome", entTotal[valor].nome);
  localStorage.setItem("endereco", entTotal[valor].endereco);
  localStorage.setItem("numero", entTotal[valor].numero);
  localStorage.setItem("bairro", entTotal[valor].bairro);
  localStorage.setItem("cep", entTotal[valor].cep);
  localStorage.setItem("uf", entTotal[valor].uf);
  localStorage.setItem("nome_municipio", entTotal[valor].nome_municipio);
  localStorage.setItem("observacao", entTotal[valor].observacao);
  window.location.href = "./gerenciaEntidade.html";
}