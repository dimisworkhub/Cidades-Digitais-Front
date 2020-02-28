//pega o token do login
let meuToken = localStorage.getItem("token");

//pega o CNPJ escolhido anteriormente
let meuLote = localStorage.getItem("cod_lote");

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


//JSON usado para mandar as informações no fetch
let info = {
  "cod_lote": " ",
  "cnpj": " ",
  "contrato": " ",
  "dt_inicio_vig": " ",
  "dt_final_vig": " ",
  "dt_reajuste": " ",
};

//captura as informações do input e coloca no JSON

function changer() {
  info.cod_lote = localStorage.getItem("cod_lote");
  let b = document.getElementById("cnpj");
  info.nome = b.value;
  let c = document.getElementById("contrato");
  info.endereco = c.value;
  let d = document.getElementById("dt_inicio_vig");
  info.numero = d.value;
  let e = document.getElementById("dt_final_vig");
  info.bairro = e.value;
  let f = document.getElementById("dt_reajuste");
  info.cep = f.value;
}


window.onload = function () {

  //captura o codigo do lote para usar como chave na edição
  let a = document.getElementById("cod_lote");
  a.value = meuLote;
  info.cod_lote = parseFloat(a.value);

  //preenche os outros campos
  let contrato1 = document.getElementById("contrato");
  contrato1.value = localStorage.getItem("contrato");
  //estes campos precisam de adaptações para serem aceitos como yyyy-MM-dd
  let dt_inicio_vig1 = document.getElementById("dt_inicio_vig");
  let dt_final_vig1 = document.getElementById("dt_final_vig");
  let dt_reajuste1 = document.getElementById("dt_reajuste");
  let data1 = new Date(localStorage.getItem("dt_inicio_vig"));
  let data2 = new Date(localStorage.getItem("dt_final_vig"));
  let data3 = new Date(localStorage.getItem("dt_reajuste"));
  let dataf1 = String(data1.getFullYear()).padStart(4, '0') + "-" + String(data1.getMonth()).padStart(2, '0') + "-" + String(data1.getDate()).padStart(2, '0');
  let dataf2 = String(data2.getFullYear()).padStart(4, '0') + "-" + String(data2.getMonth()).padStart(2, '0') + "-" + String(data2.getDate()).padStart(2, '0');
  let dataf3 = String(data3.getFullYear()).padStart(4, '0') + "-" + String(data3.getMonth()).padStart(2, '0') + "-" + String(data3.getDate()).padStart(2, '0');
  dt_inicio_vig1.value = dataf1;
  dt_final_vig1.value = dataf2;
  dt_reajuste1.value = dataf3;



  fetch('http://localhost:8080/read/entidade', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //checar o status do pedido
    //console.log(response);

    //tratamento dos erros
    if (response.status == 200) {
      response.json().then(function (json) {
        //console.log(json);
        let x = [];
        for (i = 0; i < json.length; i++) {
          x[i] += "<option>" + json[i].cnpj + "</option>";
        }
        x.sort();
        document.getElementById("cnpj").innerHTML = x;

        let cnpj1 = document.getElementById("cnpj");
        cnpj1.value = localStorage.getItem("cnpj");


      });
    } else {
      erros(response.status);
    }
  });
}


function enviar() {

  //transforma as informações do token em json
  let corpo = JSON.stringify(info);
  //função fetch para mandar
  fetch('http://localhost:8080/read/lote/' + meuLote, {
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
      alert("Usuário criado com sucesso");
      //checar o json
      //response.json().then(function (json) {
      //console.log(json);
      //});
      window.location.replace("./entidade.html");
    } else {
      erros(response.status);
    }
  });
}