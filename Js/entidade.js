//capturar itens para mandar no gerenciaEstrutura
let entQuery = [];
//pega o token do login
let meuToken = localStorage.getItem("token");
//pega o JSON de municípios para uso em "adicionar entidades"
let cidades = [];
document.getElementById("nomeMun").disabled = true;



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

function changer() {
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
  let h = document.getElementById("nomeMun");
  info.nome_municipio = h.value;
}

function enabler() {
  let a = document.getElementById("uf");
  info.uf = a.value;
  document.getElementById("nomeMun").disabled = false;
  let i, y = [];
  for (i = 1; i < cidades.length; i++) {
    if (cidades[i].uf == a.value) {
      y[i] = "<option>" + cidades[i].nome_municipio + "</option>"
    }
  }
  document.getElementById("nomeMun").innerHTML = y;
}



function enviar() {

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
    if (response.status == 200) {
      window.location.replace("./entidade.html");
    } else if (response.status == 201) {
      alert("Usuário criado com sucesso");
      window.location.replace("./entidade.html");
    } else if (response.status == 202) {
      alert("Login efetivado com sucesso");
      window.location.replace("./entidade.html");
    } else if (response.status == 204) {
      alert("Apagado com sucesso.");
      window.location.replace("./entidade.html");
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




window.onload = function () {

  fetch('http://localhost:8080/read/municipio', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 200) {
      return response.json().then(function (json) {
        //pegando valores para usar em municipios
        cidades = json;
        //cria letiaveis
        let i, j = 1;
        let x = [],
          valorUF = [],
          valorFinalUF = [];

        //faz a ligação entre letiaveis e valores iniciais do banco
        valorUF[0] = json["0"].uf;
        valorFinalUF[0] = valorUF[0];
        //faz a ligação com os outros valores do banco
        for (i = 1; i < json.length; i++) {
          valorUF[i] = json[i].uf;
          if (valorUF[i] != valorUF[i - 1]) {
            valorFinalUF[j] = valorUF[i];
            j++;
          }
        }
        valorFinalUF.sort();
        for (i = 0; i < j; i++) {
          x[i] += "<option>" + valorFinalUF[i] + "</option>";
        }
        document.getElementById("uf").innerHTML = x;
      });
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
  });


  //Fazer Tabela

  //função fetch para mandar itens 
  fetch('http://localhost:8080/read/entidade', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {
    //tratamento dos erros
    if (response.status == 200) {
      console.log("ok");
    } else if (response.status == 201) {
      console.log("Entidade criada com sucesso");
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

      let tabela = (`<thead style="background: #4b5366; color:white; font-size:15px">
          <tr>
          <th> <span class="custom-checkbox">
          <input type="checkbox" id="selectAll">
          <label for="selectAll"></label>
          </span></th>
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

      for (let i = 0; i < json.length; i++) {
        entQuery[i]=json[i];
        tabela += (`<td>
              <span class="custom-checkbox">
              <input type="checkbox" id="checkbox1" name="options[]" value="1">
              <label for="checkbox1"></label>
              </span>
              </td>`);
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
              <button onclick="apagarEntidade(` + i + `)" class="btn btn-danger">
              <i class="material-icons"data-toggle="tooltip" title="Delete">&#xE872;</i>
              </button> 
              </span> </td>`);
        tabela += (`</tr> <tr>`);
      }


      tabela += (`</tr> </tbody>`);
      document.getElementById("tabela").innerHTML = tabela;

      $(document).ready(function () {
        // Select/Deselect checkboxes
        let checkbox = $('table tbody input[type="checkbox"]');
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


//leva para o editor da entidade selecionada
function editarEntidade(valor) {
  localStorage.setItem("cnpj", entQuery[valor].cnpj);
  localStorage.setItem("nome", entQuery[valor].nome);
  localStorage.setItem("endereco", entQuery[valor].endereco);
  localStorage.setItem("numero", entQuery[valor].numero);
  localStorage.setItem("bairro", entQuery[valor].bairro);
  localStorage.setItem("cep", entQuery[valor].cep);
  localStorage.setItem("uf", entQuery[valor].uf);
  localStorage.setItem("nome_municipio", entQuery[valor].nome_municipio);
  localStorage.setItem("observacao", entQuery[valor].observacao);
  window.location.href = "./gerenciaEntidade.html";
  let m=localStorage.getItem("nome_municipio");
  alert(m);
}


//apaga a entidade selecionada
function apagarEntidade(valor) {

  //transforma as informações do token em json
  let corpo = JSON.stringify(info);

  //função fetch para mandar
  fetch('http://localhost:8080/read/entidade/' + entQuery[valor].cnpj, {
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 200) {
      window.location.replace("./entidade.html");
    } else if (response.status == 201) {
      alert("Usuário criado com sucesso");
      window.location.replace("./entidade.html");
    } else if (response.status == 202) {
      alert("Login efetivado com sucesso");
      window.location.replace("./entidade.html");
    } else if (response.status == 204) {
      alert("Apagado com sucesso.");
      window.location.replace("./entidade.html");
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