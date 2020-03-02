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
  "cod_lote": "",
  "cnpj": "",
  "contrato": "",
  "dt_inicio_vig": "",
  "dt_final_vig": "",
  "dt_reajuste": "",
};

window.onload = function () {

  //captura o codigo do lote para usar como chave na edição
  let a = document.getElementById("cod_lote");
  a.value = meuLote;
  info.cod_lote = parseFloat(meuLote);

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

  let dataFinal1 = String(data1.getFullYear()).padStart(4, '0') + "-" + String(data1.getMonth()+1).padStart(2, '0') + "-" + String(data1.getDate()).padStart(2, '0');
  let dataFinal2 = String(data2.getFullYear()).padStart(4, '0') + "-" + String(data2.getMonth()+1).padStart(2, '0') + "-" + String(data2.getDate()).padStart(2, '0');
  let dataFinal3 = String(data3.getFullYear()).padStart(4, '0') + "-" + String(data3.getMonth()+1).padStart(2, '0') + "-" + String(data3.getDate()).padStart(2, '0');
  
  dt_inicio_vig1.value = dataFinal1;
  dt_final_vig1.value = dataFinal2;
  dt_reajuste1.value = dataFinal3;



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
  alert(corpo);
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
      //checar o json
      //response.json().then(function (json) {
      //console.log(json);
      //});
      window.location.replace("./lote.html");
    } else {
      erros(response.status);
    }
  });
}